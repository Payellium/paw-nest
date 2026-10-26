
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { message: "Please provide your name, email, and password." },
        { status: 400 }
      );
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate name
    if (normalizedName.length > 100) {
      return NextResponse.json(
        { message: "Name must be 100 characters or fewer." },
        { status: 400 }
      );
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      normalizedEmail.length > 254 ||
      !emailPattern.test(normalizedEmail)
    ) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate password
    if (password.length < 8 || password.length > 72) {
      return NextResponse.json(
        {
          message: "Password must be between 8 and 72 characters.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check whether the email is already registered
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(password, 12);

    // New users always receive the "user" role
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "Your account has been created successfully.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle duplicate email submissions that happen simultaneously
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
