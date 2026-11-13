import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import VaccinationBooking from "@/models/VaccinationBooking";

const allowedVaccines = [
  "FVRCP Vaccine",
  "Rabies Vaccine",
  "FeLV Vaccine",
  "Vet-Recommended Package",
];

const allowedGenders = ["Male", "Female", "Unknown"];

export async function POST(request: Request) {
  try {
    // 1. Verify the logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in before booking a vaccination.",
        },
        { status: 401 },
      );
    }

    await connectDB();

    // 2. Read request data
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json(
        { success: false, message: "Invalid booking data." },
        { status: 400 },
      );
    }

    const {
      vaccine,
      catName,
      breed,
      age,
      gender,
      ownerName,
      email,
      phone,
      location,
      preferredDate,
      notes,
    } = body;

    // 3. Validate required fields and data types
    if (
      typeof vaccine !== "string" ||
      typeof catName !== "string" ||
      typeof breed !== "string" ||
      typeof age !== "string" ||
      typeof gender !== "string" ||
      typeof ownerName !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof location !== "string" ||
      typeof preferredDate !== "string" ||
      (notes !== undefined && typeof notes !== "string") ||
      !vaccine.trim() ||
      !catName.trim() ||
      !breed.trim() ||
      !age.trim() ||
      !ownerName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !location.trim() ||
      !preferredDate.trim()
    ) {
      return Response.json(
        {
          success: false,
          message: "Please provide all required booking information.",
        },
        { status: 400 },
      );
    }

    // 4. Validate vaccine and gender
    if (!allowedVaccines.includes(vaccine)) {
      return Response.json(
        { success: false, message: "Invalid vaccine selection." },
        { status: 400 },
      );
    }

    if (gender !== "Male" && gender !== "Female" && gender !== "Unknown") {
      return Response.json(
        { success: false, message: "Invalid cat gender." },
        { status: 400 },
      );
    }

    // 5. Validate field lengths
    if (
      catName.trim().length > 80 ||
      breed.trim().length > 80 ||
      age.trim().length > 40 ||
      ownerName.trim().length < 2 ||
      ownerName.trim().length > 100 ||
      email.trim().length > 254 ||
      phone.trim().length < 7 ||
      phone.trim().length > 20 ||
      location.trim().length > 150 ||
      (notes && notes.trim().length > 1000)
    ) {
      return Response.json(
        {
          success: false,
          message: "Please check the length of your booking details.",
        },
        { status: 400 },
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
        { status: 400 },
      );
    }

    // 7. Validate preferred date (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return Response.json(
        { success: false, message: "Please select a valid date." },
        { status: 400 },
      );
    }

    const selectedDate = new Date(`${preferredDate}T12:00:00.000Z`);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.toISOString().slice(0, 10) !== preferredDate
    ) {
      return Response.json(
        { success: false, message: "Please select a valid date." },
        { status: 400 },
      );
    }

    const todayInDhaka = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    if (preferredDate < todayInDhaka) {
      return Response.json(
        {
          success: false,
          message: "Please select today or a future date.",
        },
        { status: 400 },
      );
    }

    // 8. Save the booking
    const booking = await VaccinationBooking.create({
      userId: session.user.id,
      vaccine,
      catName: catName.trim(),
      breed: breed.trim(),
      age: age.trim(),
      gender,
      ownerName: ownerName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      location: location.trim(),
      preferredDate: selectedDate,
      notes: notes?.trim() || "",
      status: "Pending",
    });

    return Response.json(
      {
        success: true,
        message:
          "Your vaccination booking request has been submitted successfully. We will review it and contact you for confirmation.",
        booking: {
          _id: booking._id.toString(),
          vaccine: booking.vaccine,
          catName: booking.catName,
          preferredDate: booking.preferredDate,
          status: booking.status,
          createdAt: booking.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating vaccination booking:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to submit your vaccination booking.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // 1. Verify the logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: "Please log in to view your vaccination bookings.",
        },
        { status: 401 },
      );
    }

    await connectDB();

    // 2. Retrieve only this user's bookings
    const bookings = await VaccinationBooking.find({
      userId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching vaccination bookings:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch your vaccination bookings.",
      },
      { status: 500 },
    );
  }
}
