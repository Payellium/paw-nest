
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AdoptionRequest from "@/models/AdoptionRequest";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Check authentication
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { message: "Please log in to continue." },
                { status: 401 }
            );
        }

        // 2. Check admin permission
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { message: "Admin access required." },
                { status: 403 }
            );
        }

        await connectDB();

        const { id } = await params;

        // 3. Validate application ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid adoption request ID." },
                { status: 400 }
            );
        }

        // 4. Validate request body
        const body = await request.json();

        const { status, rejectionReason } = body;

        if (!["Verified", "Rejected"].includes(status)) {
            return NextResponse.json(
                { message: "Status must be Verified or Rejected." },
                { status: 400 }
            );
        }

        if (
            status === "Rejected" &&
            (typeof rejectionReason !== "string" ||
                !rejectionReason.trim())
        ) {
            return NextResponse.json(
                { message: "Please provide a rejection reason." },
                { status: 400 }
            );
        }

        // 5. Find adoption application
        const adoptionRequest = await AdoptionRequest.findById(id);

        if (!adoptionRequest) {
            return NextResponse.json(
                { message: "Adoption request not found." },
                { status: 404 }
            );
        }

        // 6. Prevent reviewing the same NID twice
        if (adoptionRequest.nidVerification.status !== "Pending") {
            return NextResponse.json(
                { message: "This NID has already been reviewed." },
                { status: 409 }
            );
        }

        // 7. Update NID verification
        adoptionRequest.nidVerification.status = status;

        if (status === "Verified") {
            adoptionRequest.nidVerification.verifiedAt = new Date();
            adoptionRequest.nidVerification.rejectionReason = undefined;
        } else {
            adoptionRequest.nidVerification.verifiedAt = undefined;
            adoptionRequest.nidVerification.rejectionReason =
                rejectionReason.trim();
        }

        await adoptionRequest.save();

        return NextResponse.json({
            success: true,
            message:
                status === "Verified"
                    ? "NID verified successfully."
                    : "NID verification rejected successfully.",
        });
    } catch (error) {
        console.error("NID verification error:", error);

        return NextResponse.json(
            { message: "Failed to update NID verification." },
            { status: 500 }
        );
    }
}
