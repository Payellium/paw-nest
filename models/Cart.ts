
import mongoose, { Schema, models, model } from "mongoose";

const CartItemSchema = new Schema(
    {
        productId: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const CartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        items: {
            type: [CartItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;
