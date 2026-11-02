
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in to submit a cat.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        {
          success: false,
          message: "Invalid cat information.",
        },
        { status: 400 }
      );
    }

    const {
      name,
      breed,
      ageInMonths,
      gender,
      location,
      image,
      personality,
    } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof breed !== "string" ||
      !breed.trim() ||
      typeof ageInMonths !== "number" ||
      !Number.isFinite(ageInMonths) ||
      ageInMonths < 0 ||
      !["Male", "Female"].includes(gender) ||
      typeof location !== "string" ||
      !location.trim() ||
      typeof image !== "string" ||
      !image.trim() ||
      !Array.isArray(personality) ||
      !personality.every(
        (item: unknown) => typeof item === "string"
      )
    ) {
      return Response.json(
        {
          success: false,
          message: "Please provide valid cat information.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const cat = await Cat.create({
      name: name.trim(),
      breed: breed.trim(),
      ageInMonths,
      gender,
      location: location.trim(),
      image: image.trim(),
      personality,
      description:
        typeof body.description === "string"
          ? body.description.trim()
          : "",
      vaccinated:
        typeof body.vaccinated === "boolean"
          ? body.vaccinated
          : true,
      neutered:
        typeof body.neutered === "boolean"
          ? body.neutered
          : true,
      specialNeeds:
        typeof body.specialNeeds === "boolean"
          ? body.specialNeeds
          : false,

      // Always set these values on the server.
      ownerId: session.user.id,
      listingType: "User",
      reviewStatus: "Pending",
      adoptionStatus: "Available",
      featured: false,
    });

    return Response.json(
      {
        success: true,
        message: "Your cat listing has been submitted for review.",
        cat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cat listing:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit cat listing.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const cats = await Cat.find({
      $or: [
        // Admin-created records, including older records
        // where listingType hasn't been set.
        { listingType: "Admin" },
        { listingType: { $exists: false } },
        { listingType: null },

        // Only approved user-submitted listings.
        {
          listingType: "User",
          reviewStatus: "Approved",
        },
      ],
    }).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      cats,
    });
  } catch (error) {
    console.error("Error fetching cats:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch cats.",
      },
      { status: 500 }
    );
  }
}
