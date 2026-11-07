
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: Request) {
    try {
        // 1. Check authentication
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Please log in first." },
                { status: 401 }
            );
        }

        // 2. Read the order ID
        const { orderId } = await request.json();

        if (
            typeof orderId !== "string" ||
            !mongoose.Types.ObjectId.isValid(orderId)
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid order ID." },
                { status: 400 }
            );
        }

        // 3. Check SSLCommerz credentials
        const storeId = process.env.SSLCOMMERZ_STORE_ID;
        const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

        if (!storeId || !storePassword || !appUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment gateway configuration is incomplete.",
                },
                { status: 500 }
            );
        }

        // 4. Connect to MongoDB
        await connectDB();

        // 5. Find the order belonging to this user
        const order = await Order.findOne({
            _id: orderId,
            userId: session.user.id,
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found." },
                { status: 404 }
            );
        }

        if (order.paymentStatus === "paid") {
            return NextResponse.json(
                { success: false, message: "This order is already paid." },
                { status: 400 }
            );
        }

        if (order.paymentMethod !== "sslcommerz") {
            return NextResponse.json(
                { success: false, message: "Invalid payment method." },
                { status: 400 }
            );
        }

        // SSLCommerz requires an amount between 10 and 500,000 BDT.
        if (order.totalAmount < 10 || order.totalAmount > 500000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order amount must be between ৳10 and ৳500,000.",
                },
                { status: 400 }
            );
        }

        // 6. Generate a unique transaction ID (maximum 30 characters)
        const transactionId =
            `PN${Date.now()}${randomBytes(3).toString("hex")}`;

        order.transactionId = transactionId;
        await order.save();

        // 7. Select the correct SSLCommerz environment
        const isSandbox =
            process.env.SSLCOMMERZ_IS_SANDBOX === "true";

        const gatewayUrl = isSandbox
            ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
            : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

        // 8. Prepare payment information
        const paymentData = new URLSearchParams({
            store_id: storeId,
            store_passwd: storePassword,

            total_amount: order.totalAmount.toFixed(2),
            currency: "BDT",
            tran_id: transactionId,

            success_url: `${appUrl}/api/payment/sslcommerz/success`,
            fail_url: `${appUrl}/api/payment/sslcommerz/fail`,
            cancel_url: `${appUrl}/api/payment/sslcommerz/cancel`,
            ipn_url: `${appUrl}/api/payment/sslcommerz/ipn`,

            product_name: "PawNest Cat Products",
            product_category: "Pet Supplies",
            product_profile: "physical-goods",

            cus_name: order.customer.fullName.slice(0, 50),
            cus_email: order.customer.email.slice(0, 50),
            cus_add1: order.customer.address.slice(0, 50),
            cus_city: order.customer.city.slice(0, 50),
            cus_postcode: order.customer.postcode.slice(0, 30),
            cus_country: "Bangladesh",
            cus_phone: order.customer.phone.slice(0, 20),

            shipping_method: "Courier",
            num_of_item: String(
                order.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                )
            ),

            value_a: order._id.toString(),
        });

        // 9. Send the request directly to SSLCommerz
        const gatewayResponse = await fetch(gatewayUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: paymentData.toString(),
            cache: "no-store",
        });

        if (!gatewayResponse.ok) {
            throw new Error("Unable to connect to SSLCommerz.");
        }

        const gatewayData = await gatewayResponse.json();

        // 10. Check SSLCommerz response
        if (
            gatewayData.status !== "SUCCESS" ||
            typeof gatewayData.GatewayPageURL !== "string"
        ) {
            console.error(
                "SSLCommerz initiation failed:",
                gatewayData.failedreason
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        gatewayData.failedreason ||
                        "SSLCommerz could not create a payment session.",
                },
                { status: 502 }
            );
        }

        // Only accept URLs from the official payment gateway domains.
        const paymentUrl = new URL(gatewayData.GatewayPageURL);

        const allowedHosts = [
            "sandbox.sslcommerz.com",
            "securepay.sslcommerz.com",
        ];

        if (
            paymentUrl.protocol !== "https:" ||
            !allowedHosts.includes(paymentUrl.hostname)
        ) {
            throw new Error("Invalid payment gateway URL.");
        }

        // 11. Return the hosted payment URL to PawNest
        return NextResponse.json({
            success: true,
            gatewayUrl: paymentUrl.toString(),
            transactionId,
        });

    } catch (error) {
        console.error("SSLCommerz initiation error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Payment initiation failed.",
            },
            { status: 500 }
        );
    }
}
