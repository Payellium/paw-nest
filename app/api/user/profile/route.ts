
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET: Fetch the logged-in user's profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Please log in first." },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("name email phone location image")
      .lean();

    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile GET error:", error);

    return Response.json(
      { success: false, message: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

// PATCH: Update the logged-in user's profile
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Please log in first." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { name, phone, location } = body;

    if (!name || !name.trim()) {
      return Response.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          name: name.trim(),
          phone: typeof phone === "string" ? phone.trim() : "",
          location:
            typeof location === "string" ? location.trim() : "",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("name email phone location image")
      .lean();

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);

    return Response.json(
      { success: false, message: "Failed to update profile." },
      { status: 500 }
    );
  }
}
