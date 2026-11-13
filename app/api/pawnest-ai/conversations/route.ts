
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AIConversation from "@/models/AIConversation";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please log in to view your chat history." },
                { status: 401 }
            );
        }

        await connectDB();

        // Only retrieve conversations belonging to the logged-in user.
        const conversations = await AIConversation.find({
            userId: session.user.id,
        })
            .select("title messages createdAt updatedAt")
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            conversations,
        });
    } catch (error) {
        console.error("Fetch AI conversations error:", error);

        return NextResponse.json(
            { error: "Unable to load your chat history." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please log in to start a conversation." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const firstMessage =
            typeof body.firstMessage === "string"
                ? body.firstMessage.trim()
                : "";

        if (!firstMessage || firstMessage.length > 4000) {
            return NextResponse.json(
                { error: "Please provide a valid message." },
                { status: 400 }
            );
        }

        await connectDB();

        const conversation = await AIConversation.create({
            userId: session.user.id,
            title: firstMessage.slice(0, 60),
            messages: [
                {
                    role: "user",
                    content: firstMessage,
                },
            ],
        });

        return NextResponse.json(
            {
                success: true,
                conversation,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create AI conversation error:", error);

        return NextResponse.json(
            { error: "Unable to create a new conversation." },
            { status: 500 }
        );
    }
}
