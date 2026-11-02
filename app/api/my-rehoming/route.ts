
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in to view your rehoming listings.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const listings = await Cat.find({
      ownerId: session.user.id,
      listingType: "User",
    })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Error fetching rehoming listings:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch your rehoming listings.",
      },
      { status: 500 }
    );
  }
}
