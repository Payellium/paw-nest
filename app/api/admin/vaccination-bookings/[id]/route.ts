
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import VaccinationBooking, {
    type VaccinationStatus,
} from "@/models/VaccinationBooking";
import mongoose from "mongoose";

const allowedTransitions: Record<
    string,
    VaccinationStatus[]
> = {
    Pending: ["Confirmed", "Rejected"],
    Confirmed: ["Completed", "Cancelled"],
};

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
                    message: "You are not authorized to manage vaccination bookings.",
                },
                { status: 403 },
            );
        }

        // 2. Validate the booking ID.
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid booking ID.",
                },
                { status: 400 },
            );
        }

        // 3. Validate the requested status.
        const body = await request.json();

        const validStatuses: VaccinationStatus[] = [
            "Confirmed",
            "Completed",
            "Cancelled",
            "Rejected",
        ];

        if (
            !body ||
            typeof body !== "object" ||
            !validStatuses.includes(body.status)
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Choose a valid booking status.",
                },
                { status: 400 },
            );
        }

        await connectDB();

        // 4. Find the booking.
        const booking = await VaccinationBooking.findById(id);

        if (!booking) {
            return Response.json(
                {
                    success: false,
                    message: "Vaccination booking not found.",
                },
                { status: 404 },
            );
        }

        // 5. Prevent invalid status transitions.
        const allowed = allowedTransitions[booking.status] ?? [];

        if (!allowed.includes(body.status)) {
            return Response.json(
                {
                    success: false,
                    message: `Cannot change booking status from ${booking.status} to ${body.status}.`,
                },
                { status: 400 },
            );
        }

        // 6. Update the booking.
        booking.status = body.status;
        await booking.save();

        return Response.json({
            success: true,
            message: `Vaccination booking ${body.status.toLowerCase()} successfully.`,
            booking: {
                id: booking._id.toString(),
                catName: booking.catName,
                vaccine: booking.vaccine,
                status: booking.status,
            },
        });
    } catch (error) {
        console.error("Error updating vaccination booking:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to update vaccination booking.",
            },
            { status: 500 },
        );
    }
}
