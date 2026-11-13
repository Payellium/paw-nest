import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AIConversation from "@/models/AIConversation";

const PAWNEST_AI_INSTRUCTIONS = `
You are PawNest AI, a friendly and responsible cat-care assistant.

Your purpose is to help cat owners understand:
- Common cat health concerns and symptoms.
- Cat behavior and emotional well-being.
- Nutrition, feeding, grooming, and hygiene.
- Kitten care and general cat wellness.

IMPORTANT SAFETY RULES:
1. You are not a veterinarian. Never claim to diagnose an illness.
2. Never prescribe medication or provide medication dosages.
3. Never recommend human medication for cats.
4. Explain possible causes carefully without presenting guesses as facts.
5. If a cat has difficulty breathing, collapses, has seizures,
   cannot urinate, has severe bleeding, or may have swallowed poison,
   advise the owner to seek emergency veterinary care immediately.
6. For concerning or persistent symptoms, recommend consulting a vet.
7. Ask relevant follow-up questions when important details are missing.
8. Be empathetic, clear, practical, and easy to understand.
9. Do not invent medical facts.
10. Keep answers focused on cats and responsible cat care.

Start conversations warmly and explain things in beginner-friendly language.
`;

export async function POST(request: Request) {
  try {
    // 1. Verify the logged-in user.
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please log in to use PawNest AI." },
        { status: 401 },
      );
    }

    // 2. Check Gemini API configuration.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "PawNest AI is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    // 3. Validate the incoming message.
    const body = await request.json();

    const message = typeof body.message === "string" ? body.message.trim() : "";

    const conversationId = body.conversationId;

    if (!message || message.length > 4000) {
      return NextResponse.json(
        { error: "Please provide a valid message." },
        { status: 400 },
      );
    }

    await connectDB();

    // 4. Load an existing conversation only if it belongs to this user.
    let existingConversation = null;

    if (conversationId) {
      if (
        typeof conversationId !== "string" ||
        !mongoose.Types.ObjectId.isValid(conversationId)
      ) {
        return NextResponse.json(
          { error: "Invalid conversation ID." },
          { status: 400 },
        );
      }

      existingConversation = await AIConversation.findOne({
        _id: conversationId,
        userId: session.user.id,
      });

      if (!existingConversation) {
        return NextResponse.json(
          { error: "Conversation not found." },
          { status: 404 },
        );
      }
    }

    // 5. Prepare conversation history for Gemini.
    const previousMessages = existingConversation
      ? (existingConversation.messages.slice(-19) as {
          role: "user" | "assistant";
          content: string;
        }[])
      : [];

    const conversation = [
      ...previousMessages.map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    // 6. Generate the AI response.
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: conversation,
      config: {
        systemInstruction: PAWNEST_AI_INSTRUCTIONS,
        maxOutputTokens: 700,
      },
    });

    const reply =
      response.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    // 7. Save the messages in MongoDB.
    let savedConversation;

    if (existingConversation) {
      existingConversation.messages.push(
        { role: "user", content: message },
        { role: "assistant", content: reply },
      );

      savedConversation = await existingConversation.save();
    } else {
      savedConversation = await AIConversation.create({
        userId: session.user.id,
        title: message.slice(0, 60),
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: reply },
        ],
      });
    }

    // 8. Return the reply and conversation ID.
    return NextResponse.json({
      success: true,
      reply,
      conversationId: savedConversation._id.toString(),
    });
  } catch (error) {
    console.error("PawNest AI API error:", error);

    return NextResponse.json(
      {
        error:
          "Sorry, PawNest AI could not respond right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
