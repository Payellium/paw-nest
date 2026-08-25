import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cats";


export async function POST() {
  try {
    await connectDB();

    const cat = await Cat.create({
      name: "Luna",
      breed: "Persian",
      ageInMonths: 8,
      gender: "Female",
      location: "Dhaka",
      image: "/images/cats/luna.jpg",
      personality: ["Calm", "Friendly"],
      adoptionStatus: "Available",
    });

    return Response.json(
      {
        success: true,
        cat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cat:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create cat",
      },
      { status: 500 }
    );
  }
}