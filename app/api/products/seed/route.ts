
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { products } from "@/data/products";

export async function POST(request: Request) {
    try {
        const seedSecret = process.env.PRODUCT_SEED_SECRET;
        const providedSecret = request.headers.get("x-seed-secret");

        if (!seedSecret || providedSecret !== seedSecret) {
            return NextResponse.json(
                { success: false, message: "Unauthorized." },
                { status: 401 }
            );
        }

        await connectDB();

        const operations = products.map((product) => ({
            updateOne: {
                filter: { id: product.id },
                update: { $set: product },
                upsert: true,
            },
        }));

        const result = await Product.bulkWrite(operations);

        return NextResponse.json({
            success: true,
            message: "Products seeded successfully.",
            totalProducts: products.length,
            inserted: result.upsertedCount,
            updated: result.modifiedCount,
        });
    } catch (error) {
        console.error("Product seeding error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to seed products.",
            },
            { status: 500 }
        );
    }
}
