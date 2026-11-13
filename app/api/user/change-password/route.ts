
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PATCH(request: Request) {
  try {
    // 1. Verify the logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in first.",
        },
        { status: 401 }
      );
    }

    // 2. Read the submitted passwords
    const body = await request.json();

    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json(
        {
          success: false,
          message: "Please fill in all password fields.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        {
          success: false,
          message: "New password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        {
          success: false,
          message: "New passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return Response.json(
        {
          success: false,
          message: "Your new password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Find only the authenticated user's account
    const user = await User.findById(session.user.id);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    // 5. Verify the current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Your current password is incorrect.",
        },
        { status: 400 }
      );
    }

    // 6. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 7. Save the new password
    user.passwordHash = hashedPassword;
    await user.save();

    return Response.json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while changing your password.",
      },
      { status: 500 }
    );
  }
}
