
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    // 1. Verify the logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in to continue.",
        },
        { status: 401 }
      );
    }

    // 2. Verify admin access
    if (session.user.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "You are not authorized to view users.",
        },
        { status: 403 }
      );
    }

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Retrieve users without exposing password hashes
    const users = await User.find({})
      .select("-passwordHash -__v")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // 5. Return users
    return Response.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch users.",
      },
      { status: 500 }
    );
  }
}
