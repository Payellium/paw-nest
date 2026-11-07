import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

interface RouteContext {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    // Check whether the user is logged in
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in to view this order." },
        { status: 401 },
      );
    }

    // Validate the logged-in user's ID
    if (!mongoose.isValidObjectId(session.user.id)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 },
      );
    }

    // Get the order ID from the URL
    const { orderId } = await params;

    if (!mongoose.isValidObjectId(orderId)) {
      return NextResponse.json(
        { message: "Invalid order ID." },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Find the order belonging to the logged-in user
    const order = await Order.findOne({
      _id: orderId,
      userId: session.user.id,
    });

    if (!order) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    }

    // Return the order details
    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        customer: {
          fullName: order.customer.fullName,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
          city: order.customer.city,
          postcode: order.customer.postcode,
        },
        items: order.items,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Fetch order error:", error);

    return NextResponse.json(
      { message: "Something went wrong while fetching the order." },
      { status: 500 },
    );
  }
}
