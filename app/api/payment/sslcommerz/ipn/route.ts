import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { validateSSLCommerzPayment } from "@/lib/sslcommerz";
import Order from "@/models/Order";

export async function POST(request: Request) {
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
      return NextResponse.json(
        { success: false, message: "Missing transaction details." },
        { status: 400 },
      );
    }

    await connectDB();

    const order = await Order.findOne({
      transactionId,
      paymentMethod: "sslcommerz",
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    // An already-paid order does not need another update.
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ success: true });
    }

    // Verify the transaction directly with SSLCommerz.
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
      return NextResponse.json(
        { success: false, message: "Payment verification failed." },
        { status: 400 },
      );
    }

    // Update only if another callback has not already paid the order.
    await Order.findOneAndUpdate(
      {
        _id: order._id,
        transactionId,
        paymentStatus: { $ne: "paid" },
      },
      {
        $set: {
          paymentStatus: "paid",
          orderStatus: "processing",
          validationId: validation.val_id,
          bankTransactionId: validation.bank_tran_id || undefined,
        },
      },
      { new: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SSLCommerz IPN error:", error);

    return NextResponse.json(
      { success: false, message: "IPN processing failed." },
      { status: 500 },
    );
  }
}
