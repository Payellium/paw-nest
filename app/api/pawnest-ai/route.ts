
import OpenAI from "openai";
import { NextResponse } from "next/server";

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
        const apiKey = process.env.OPENAI_API_KEY;

        // Check the API key before initializing OpenAI.
        if (!apiKey) {
            return NextResponse.json(
                {
                    error: "PawNest AI is temporarily unavailable. Please try again later.",
                },
                { status: 503 }
            );
        }

        // Initialize OpenAI only when the API is actually requested.
        const openai = new OpenAI({
            apiKey,
        });

        const body = await request.json();
        const messages = body.messages;

        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Please provide a message." },
                { status: 400 }
            );
        }

        if (messages.length > 20) {
            return NextResponse.json(
                {
                    error: "Conversation is too long. Please start a new chat.",
                },
                { status: 400 }
            );
        }

        const validMessages = messages.every(
            (message) =>
                message &&
                ["user", "assistant"].includes(message.role) &&
                typeof message.content === "string" &&
                message.content.trim().length > 0 &&
                message.content.length <= 4000
        );

        if (!validMessages) {
            return NextResponse.json(
                { error: "Invalid message format." },
                { status: 400 }
            );
        }

        const conversation = messages.map((message) => ({
            role: message.role as "user" | "assistant",
            content: message.content,
        }));

        const response = await openai.responses.create({
            model: "gpt-5-mini",
            instructions: PAWNEST_AI_INSTRUCTIONS,
            input: conversation,
            max_output_tokens: 700,
        });

        return NextResponse.json({
            reply: response.output_text,
        });

    } catch (error) {
        console.error("PawNest AI API error:", error);

        return NextResponse.json(
            {
                error: "Sorry, PawNest AI could not respond right now. Please try again.",
            },
            { status: 500 }
        );
    }
}
