import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AdoptionRequest from "@/models/AdoptionRequest";

export async function GET() {
  try {
    // Verify admin access
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, message: "Please log in to continue." },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return Response.json(
        { success: false, message: "You are not authorized to access these requests." },
        { status: 403 }
      );
    }

    await connectDB();

    // Retrieve all adoption requests with their cat information
    const requests = await AdoptionRequest.find()
      .populate("catId", "name breed ageInMonths gender location image")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching adoption requests:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch adoption requests.",
      },
      { status: 500 }
    );
  }
}