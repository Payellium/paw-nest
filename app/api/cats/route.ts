import { connectDB } from "@/lib/mongodb";
import Cat from "../../../models/Cat";


export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const cat = await Cat.create(body);

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

export async function GET() {
  try {
    await connectDB();

    const cats = await Cat.find();

    return Response.json({
      success: true,
      cats,
    });
  } catch (error) {
    console.error("Error fetching cats:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch cats",
      },
      { status: 500 }
    );
  }
}