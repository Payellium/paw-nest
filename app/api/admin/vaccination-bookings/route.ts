
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import VaccinationBooking from "@/models/VaccinationBooking";

export async function GET() {
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
                    message: "You are not authorized to view vaccination bookings.",
                },
                { status: 403 },
            );
        }

        // 2. Connect to MongoDB.
        await connectDB();

        // 3. Retrieve all vaccination bookings.
        const bookings = await VaccinationBooking.find({})
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        // 4. Return the bookings.
        return Response.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Error fetching vaccination bookings:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch vaccination bookings.",
            },
            { status: 500 },
        );
    }
}
