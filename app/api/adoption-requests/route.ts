
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";
import AdoptionRequest from "@/models/AdoptionRequest";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

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

    // Validate required fields
    if (
      !catId ||
      !applicantName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !city?.trim() ||
      !livingEnvironment ||
      typeof hasPreviousCatExperience !== "boolean" ||
      !reason?.trim()
    ) {
      return Response.json(
        {
          success: false,
          message: "Please provide all required information.",
        },
        { status: 400 }
      );
    }

    // Validate the cat ID
    if (!mongoose.Types.ObjectId.isValid(catId)) {
      return Response.json(
        {
          success: false,
          message: "Invalid cat ID.",
        },
        { status: 400 }
      );
    }

    // Validate email
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

    // Validate living environment
    if (!["Apartment", "House", "Other"].includes(livingEnvironment)) {
      return Response.json(
        {
          success: false,
          message: "Invalid living environment.",
        },
        { status: 400 }
      );
    }

    // Validate reason length
    if (reason.trim().length > 1000) {
      return Response.json(
        {
          success: false,
          message: "Your reason must be 1000 characters or fewer.",
        },
        { status: 400 }
      );
    }

    // Check whether the cat exists
    const cat = await Cat.findById(catId);

    if (!cat) {
      return Response.json(
        {
          success: false,
          message: "Cat not found.",
        },
        { status: 404 }
      );
    }

    // Only available cats can receive adoption requests
    if (cat.adoptionStatus?.toLowerCase() !== "available") {
      return Response.json(
        {
          success: false,
          message: "This cat is not currently available for adoption.",
        },
        { status: 409 }
      );
    }

    // Prevent another pending request from the same email for this cat
    const existingRequest = await AdoptionRequest.findOne({
      catId,
      email: normalizedEmail,
      status: "Pending",
    });

    if (existingRequest) {
      return Response.json(
        {
          success: false,
          message: "You already have a pending request for this cat.",
        },
        { status: 409 }
      );
    }

    // Save the adoption request
    const adoptionRequest = await AdoptionRequest.create({
      catId,
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
        message: "Your adoption request has been submitted successfully.",
        adoptionRequest: {
          _id: adoptionRequest._id,
          catId: adoptionRequest.catId,
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
        message: "Failed to submit the adoption request.",
      },
      { status: 500 }
    );
  }
}
