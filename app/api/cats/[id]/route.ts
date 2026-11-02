
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Existing admin-created cats remain public.
    // Approved user listings are also public.
    const isPublic =
      cat.listingType === "Admin" ||
      cat.reviewStatus === "Approved";

    if (!isPublic) {
      const session = await auth();

      const isOwner =
        !!session?.user?.id &&
        cat.ownerId === session.user.id;

      const isAdmin = session?.user?.role === "admin";

      if (!isOwner && !isAdmin) {
        return Response.json(
          {
            success: false,
            message: "Cat listing not found",
          },
          { status: 404 }
        );
      }
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
