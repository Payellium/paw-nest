import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return NextResponse.json(
      { success: false, message: "Application URL is missing." },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const transactionId = formData.get("tran_id");

    if (typeof transactionId !== "string" || !transactionId) {
      return NextResponse.redirect(
        new URL("/checkout?payment=cancelled", appUrl),
        303,
      );
    }

    await connectDB();

    const order = await Order.findOne({
      transactionId,
      paymentMethod: "sslcommerz",
    });

    if (!order) {
      return NextResponse.redirect(
        new URL("/checkout?payment=cancelled", appUrl),
        303,
      );
    }

    const orderId = order._id.toString();

    // Never change an order that has already been paid.
    if (order.paymentStatus === "paid") {
      return NextResponse.redirect(
        new URL(`/checkout/payment/${orderId}`, appUrl),
        303,
      );
    }

    // Keep the order pending so payment can be retried.
    return NextResponse.redirect(
      new URL(`/checkout/payment/${orderId}?payment=cancelled`, appUrl),
      303,
    );
  } catch (error) {
    console.error("Payment cancellation callback error:", error);

    return NextResponse.redirect(
      new URL("/checkout?payment=cancelled", appUrl),
      303,
    );
  }
}
