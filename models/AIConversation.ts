
import mongoose, { Schema, models, model } from "mongoose";

const AIMessageSchema = new Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const AIConversationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            default: "New conversation",
            maxlength: 100,
        },
        messages: {
            type: [AIMessageSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const AIConversation =
    models.AIConversation ||
    model("AIConversation", AIConversationSchema);

export default AIConversation;
