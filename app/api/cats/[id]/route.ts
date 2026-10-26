
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate the MongoDB ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid cat ID",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find one cat using its MongoDB ID
    const cat = await Cat.findById(id);

    if (!cat) {
      return Response.json(
        {
          success: false,
          message: "Cat not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      cat,
    });
  } catch (error) {
    console.error("Error fetching cat details:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch cat details",
      },
      { status: 500 }
    );
  }
}
