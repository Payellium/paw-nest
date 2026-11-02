import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AdoptionRequest from "@/models/AdoptionRequest";
import Cat from "@/models/Cat";
import mongoose from "mongoose";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        {
          success: false,
          message: "Please log in to continue.",
        },
        { status: 401 },
      );
    }

    // Check admin permission
    if (session.user.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "You are not authorized to perform this action.",
        },
        { status: 403 },
      );
    }

    await connectDB();

    const { id } = await params;

    // Validate request ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid adoption request ID.",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["Approved", "Rejected"].includes(status)) {
      return Response.json(
        {
          success: false,
          message: "Status must be Approved or Rejected.",
        },
        { status: 400 },
      );
    }

    const adoptionRequest = await AdoptionRequest.findById(id);

    if (!adoptionRequest) {
      return Response.json(
        {
          success: false,
          message: "Adoption request not found.",
        },
        { status: 404 },
      );
    }

    // Only pending requests can be reviewed
    if (adoptionRequest.status !== "Pending") {
      return Response.json(
        {
          success: false,
          message: "This adoption request has already been reviewed.",
        },
        { status: 409 },
      );
    }

    const cat = await Cat.findById(adoptionRequest.catId);

    if (!cat) {
      return Response.json(
        {
          success: false,
          message: "The associated cat could not be found.",
        },
        { status: 404 },
      );
    }

    // Approve adoption
    if (status === "Approved") {
      if (cat.adoptionStatus !== "Available") {
        return Response.json(
          {
            success: false,
            message: "This cat is no longer available for adoption.",
          },
          { status: 409 },
        );
      }

      // Mark the selected request as approved
      adoptionRequest.status = "Approved";
      await adoptionRequest.save();

      // Mark the cat as adopted
      cat.adoptionStatus = "Adopted";
      await cat.save();

      // Reject all other pending applications for this cat
      await AdoptionRequest.updateMany(
        {
          catId: cat._id,
          _id: { $ne: adoptionRequest._id },
          status: "Pending",
        },
        {
          $set: { status: "Rejected" },
        },
      );
    } else {
      // Reject adoption without validating unrelated required fields
      const updatedRequest = await AdoptionRequest.findOneAndUpdate(
        {
          _id: id,
          status: "Pending",
        },
        {
          $set: { status: "Rejected" },
        },
        {
          new: true,
        },
      );

      if (!updatedRequest) {
        return Response.json(
          {
            success: false,
            message: "This adoption request has already been reviewed.",
          },
          { status: 409 },
        );
      }
    }

    return Response.json({
      success: true,
      message:
        status === "Approved"
          ? "Adoption request approved successfully. The cat is now marked as adopted."
          : "Adoption request rejected successfully.",
    });
  } catch (error) {
    console.error("Adoption request review error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to review adoption request.",
      },
      { status: 500 },
    );
  }
}
