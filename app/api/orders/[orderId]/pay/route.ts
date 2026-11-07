import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json(
        {
            success: false,
            message:
                "Simulated payments are disabled. Please use the secure payment gateway.",
        },
        { status: 410 }
    );
}