
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { products } from "@/data/products";

export async function POST(request: Request) {
    try {
        // 1. Verify the logged-in user
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Please log in to place an order." },
                { status: 401 }
            );
        }

        if (!mongoose.isValidObjectId(session.user.id)) {
            return NextResponse.json(
                { message: "Invalid user account." },
                { status: 400 }
            );
        }

        // 2. Read the checkout information
        const body = await request.json();
        const { customer, items } = body;

        if (!customer || typeof customer !== "object") {
            return NextResponse.json(
                { message: "Customer information is required." },
                { status: 400 }
            );
        }

        const requiredFields = [
            "fullName",
            "email",
            "phone",
            "address",
            "city",
            "postcode",
        ] as const;

        for (const field of requiredFields) {
            if (
                typeof customer[field] !== "string" ||
                !customer[field].trim()
            ) {
                return NextResponse.json(
                    { message: `${field} is required.` },
                    { status: 400 }
                );
            }
        }

        const email = customer.email.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { message: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        if (
            !/^[+\d\s()-]{7,20}$/.test(customer.phone.trim())
        ) {
            return NextResponse.json(
                { message: "Please provide a valid phone number." },
                { status: 400 }
            );
        }

        // 3. Validate cart items
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { message: "Your cart is empty." },
                { status: 400 }
            );
        }

        // Combine duplicate product IDs
        const requestedQuantities = new Map<number, number>();

        for (const item of items) {
            if (
                !Number.isInteger(item?.productId) ||
                !Number.isInteger(item?.quantity) ||
                item.quantity < 1
            ) {
                return NextResponse.json(
                    { message: "Invalid product information." },
                    { status: 400 }
                );
            }

            const currentQuantity =
                requestedQuantities.get(item.productId) || 0;

            requestedQuantities.set(
                item.productId,
                currentQuantity + item.quantity
            );
        }

        // 4. Get trusted product information from our catalog
        const orderItems = [];

        for (const [productId, quantity] of requestedQuantities) {
            const product = products.find(
                (item) => item.id === productId
            );

            if (!product) {
                return NextResponse.json(
                    { message: `Product ${productId} was not found.` },
                    { status: 404 }
                );
            }

            if (quantity > product.stock) {
                return NextResponse.json(
                    {
                        message: `${product.name} has only ${product.stock} items available.`,
                    },
                    { status: 400 }
                );
            }

            orderItems.push({
                productId: product.id,
                name: product.name,
                category: product.category,
                image: product.image,
                price: product.price,
                quantity,
            });
        }

        // 5. Calculate the order total on the server
        const subtotal = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Temporary: delivery charge is zero
        const deliveryCharge = 0;

        const totalAmount = subtotal + deliveryCharge;

        // 6. Connect to MongoDB
        await connectDB();

        // 7. Save the order
        const order = await Order.create({
            userId: new mongoose.Types.ObjectId(session.user.id),

            customer: {
                fullName: customer.fullName.trim(),
                email: email.toLowerCase(),
                phone: customer.phone.trim(),
                address: customer.address.trim(),
                city: customer.city.trim(),
                postcode: customer.postcode.trim(),
            },

            items: orderItems,
            subtotal,
            deliveryCharge,
            totalAmount,

            paymentMethod: "sslcommerz",
            paymentStatus: "pending",
            orderStatus: "pending",
        });

        // 8. Return the created order information
        return NextResponse.json(
            {
                success: true,
                message: "Your order has been created successfully.",
                order: {
                    id: order._id.toString(),
                    subtotal: order.subtotal,
                    deliveryCharge: order.deliveryCharge,
                    totalAmount: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: order.paymentStatus,
                    orderStatus: order.orderStatus,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Order creation error:", error);

        return NextResponse.json(
            { message: "Something went wrong while creating your order." },
            { status: 500 }
        );
    }
}
