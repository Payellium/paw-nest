
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const featured = searchParams.get("featured");

        const filter: { featured?: boolean } = {};

        if (featured === "true") {
            filter.featured = true;
        }

        const products = await Product.find(filter)
            .sort({ id: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Products API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products.",
            },
            { status: 500 }
        );
    }
}
