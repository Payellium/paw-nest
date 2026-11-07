import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { validateSSLCommerzPayment } from "@/lib/sslcommerz";
import Order from "@/models/Order";

export async function POST(request: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    return NextResponse.json(
      { success: false, message: "Application URL is missing." },
      { status: 500 },
    );
  }

  let orderId: string | null = null;

  try {
    const formData = await request.formData();

    const transactionId = formData.get("tran_id");
    const validationId = formData.get("val_id");

    if (
      typeof transactionId !== "string" ||
      typeof validationId !== "string" ||
      !transactionId ||
      !validationId
    ) {
      return NextResponse.redirect(
        new URL("/checkout?payment=verification_failed", appUrl),
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
        new URL("/checkout?payment=verification_failed", appUrl),
        303,
      );
    }

    orderId = order._id.toString();

    // Prevent duplicate processing of an already paid order.
    if (order.paymentStatus === "paid") {
      return NextResponse.redirect(
        new URL(`/checkout/payment/${orderId}`, appUrl),
        303,
      );
    }

    const validation = await validateSSLCommerzPayment(validationId);

    const validStatuses = ["VALID", "VALIDATED"];

    const isValid =
      validStatuses.includes(validation.status ?? "") &&
      validation.tran_id === transactionId &&
      validation.val_id === validationId &&
      validation.currency === "BDT" &&
      Number.isFinite(Number(validation.amount)) &&
      Math.round(Number(validation.amount) * 100) ===
        Math.round(order.totalAmount * 100);

    if (!isValid) {
      return NextResponse.redirect(
        new URL(
          `/checkout/payment/${orderId}?payment=verification_failed`,
          appUrl,
        ),
        303,
      );
    }

    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.validationId = validation.val_id;
    order.bankTransactionId = validation.bank_tran_id || undefined;

    await order.save();

    return NextResponse.redirect(
      new URL(`/checkout/payment/${orderId}`, appUrl),
      303,
    );
  } catch (error) {
    console.error("SSLCommerz success callback error:", error);

    const destination = orderId
      ? `/checkout/payment/${orderId}?payment=verification_failed`
      : "/checkout?payment=verification_failed";

    return NextResponse.redirect(new URL(destination, appUrl), 303);
  }
}
