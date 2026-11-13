
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AIConversation from "@/models/AIConversation";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please log in to update your conversation." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid conversation ID." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { messages } = body;

        if (
            !Array.isArray(messages) ||
            messages.length === 0 ||
            messages.length > 100
        ) {
            return NextResponse.json(
                { error: "Invalid conversation messages." },
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

        await connectDB();

        // Ownership is checked together with the conversation ID.
        const conversation = await AIConversation.findOneAndUpdate(
            {
                _id: id,
                userId: session.user.id,
            },
            {
                $set: { messages },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!conversation) {
            return NextResponse.json(
                { error: "Conversation not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            conversation,
        });
    } catch (error) {
        console.error("Update AI conversation error:", error);

        return NextResponse.json(
            { error: "Unable to update your conversation." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Please log in to delete your conversation." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid conversation ID." },
                { status: 400 }
            );
        }

        await connectDB();

        // A user can delete only their own conversation.
        const deletedConversation =
            await AIConversation.findOneAndDelete({
                _id: id,
                userId: session.user.id,
            });

        if (!deletedConversation) {
            return NextResponse.json(
                { error: "Conversation not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Conversation deleted successfully.",
        });
    } catch (error) {
        console.error("Delete AI conversation error:", error);

        return NextResponse.json(
            { error: "Unable to delete your conversation." },
            { status: 500 }
        );
    }
}
