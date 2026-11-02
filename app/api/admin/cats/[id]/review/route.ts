
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";
import mongoose from "mongoose";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        // 1. Require an authenticated admin.
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json(
                {
                    success: false,
                    message: "Please log in to continue.",
                },
                { status: 401 },
            );
        }

        if (session.user.role !== "admin") {
            return Response.json(
                {
                    success: false,
                    message: "You are not authorized to review listings.",
                },
                { status: 403 },
            );
        }

        // 2. Validate the cat ID.
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid cat ID.",
                },
                { status: 400 },
            );
        }

        // 3. Validate the requested review action.
        const body = await request.json();

        if (
            !body ||
            typeof body !== "object" ||
            !["Approved", "Rejected"].includes(body.reviewStatus)
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Choose a valid review status.",
                },
                { status: 400 },
            );
        }

        await connectDB();

        // 4. Only allow review actions on user-submitted listings.
        const cat = await Cat.findOne({
            _id: id,
            listingType: "User",
        });

        if (!cat) {
            return Response.json(
                {
                    success: false,
                    message: "User-submitted cat listing not found.",
                },
                { status: 404 },
            );
        }

        // 5. Update the review status.
        cat.reviewStatus = body.reviewStatus;
        await cat.save();

        return Response.json({
            success: true,
            message:
                body.reviewStatus === "Approved"
                    ? "Cat listing approved successfully."
                    : "Cat listing rejected successfully.",
            cat: {
                id: cat._id.toString(),
                name: cat.name,
                reviewStatus: cat.reviewStatus,
            },
        });
    } catch (error) {
        console.error("Error reviewing cat listing:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to update cat review status.",
            },
            { status: 500 },
        );
    }
}
