
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";
import AdoptionRequest from "@/models/AdoptionRequest";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    // 1. Verify the logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in before submitting an adoption application.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    // 2. Read request data
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid application data." },
        { status: 400 }
      );
    }

    const {
      catId,
      applicantName,
      email,
      phone,
      city,
      livingEnvironment,
      hasPreviousCatExperience,
      reason,
    } = body;

    // 3. Validate required fields and data types
    if (
      typeof catId !== "string" ||
      typeof applicantName !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof city !== "string" ||
      typeof livingEnvironment !== "string" ||
      typeof hasPreviousCatExperience !== "boolean" ||
      typeof reason !== "string" ||
      !applicantName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !reason.trim()
    ) {
      return Response.json(
        {
          success: false,
          message: "Please provide all required information.",
        },
        { status: 400 }
      );
    }

    // 4. Validate field lengths
    if (
      applicantName.trim().length < 2 ||
      applicantName.trim().length > 100 ||
      phone.trim().length < 7 ||
      phone.trim().length > 25 ||
      city.trim().length > 100 ||
      reason.trim().length < 10 ||
      reason.trim().length > 1000
    ) {
      return Response.json(
        {
          success: false,
          message: "Please check the length of your application details.",
        },
        { status: 400 }
      );
    }

    // 5. Validate cat ID
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      return Response.json(
        { success: false, message: "Invalid cat ID." },
        { status: 400 }
      );
    }

    // 6. Validate email
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return Response.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    // 7. Validate living environment
    if (!["Apartment", "House", "Other"].includes(livingEnvironment)) {
      return Response.json(
        {
          success: false,
          message: "Invalid living environment.",
        },
        { status: 400 }
      );
    }

    // 8. Check whether the cat exists
    const cat = await Cat.findById(catId);

    if (!cat) {
      return Response.json(
        { success: false, message: "Cat not found." },
        { status: 404 }
      );
    }

    // 9. Only available cats can receive applications
    if (cat.adoptionStatus?.toLowerCase() !== "available") {
      return Response.json(
        {
          success: false,
          message: "This cat is not currently available for adoption.",
        },
        { status: 409 }
      );
    }

    // 10. Prevent duplicate pending applications from the same account
    const existingRequest = await AdoptionRequest.findOne({
      catId: cat._id,
      userId: session.user.id,
      status: "Pending",
    });

    if (existingRequest) {
      return Response.json(
        {
          success: false,
          message: "You already have a pending application for this cat.",
        },
        { status: 409 }
      );
    }

    // 11. Save the application
    const adoptionRequest = await AdoptionRequest.create({
      catId: cat._id,
      userId: session.user.id,
      applicantName: applicantName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      city: city.trim(),
      livingEnvironment,
      hasPreviousCatExperience,
      reason: reason.trim(),
      status: "Pending",
    });

    return Response.json(
      {
        success: true,
        message: "Your adoption application has been submitted successfully.",
        adoptionRequest: {
          _id: adoptionRequest._id.toString(),
          catId: adoptionRequest.catId.toString(),
          applicantName: adoptionRequest.applicantName,
          status: adoptionRequest.status,
          createdAt: adoptionRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating adoption request:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit the adoption application.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verify that the user is logged in
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

    await connectDB();

    // Retrieve only the logged-in user's applications
    const requests = await AdoptionRequest.find({
      userId: session.user.id,
    })
      .populate("catId", "name breed ageInMonths gender location image")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching your adoption requests:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch your adoption requests.",
      },
      { status: 500 }
    );
  }
}
