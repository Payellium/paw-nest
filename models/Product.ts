
import mongoose, { Schema, Model } from "mongoose";
import type { ProductCategory } from "@/types/product";

export interface IProduct {
    id: number;
    name: string;
    category: ProductCategory;
    description: string;
    price: number;
    oldPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: "Best Seller" | "New" | "Sale";
    featured: boolean;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["Food", "Toys", "Beds", "Grooming", "Accessories"],
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        oldPrice: {
            type: Number,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },
        image: {
            type: String,
            required: true,
        },
        badge: {
            type: String,
            enum: ["Best Seller", "New", "Sale"],
        },
        featured: {
            type: Boolean,
            default: false,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product =
    (mongoose.models.Product as Model<IProduct>) ||
    mongoose.model<IProduct>("Product", productSchema);

export default Product;
