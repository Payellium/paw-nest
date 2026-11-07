
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import {
    FaArrowLeft,
    FaCheckCircle,
    FaCreditCard,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaShoppingBag,
    FaSpinner,
    FaTruck,
} from "react-icons/fa";
import Image from "next/image";

interface OrderItem {
    productId: number;
    name: string;
    category: string;
    image: string;
    price: number;
    quantity: number;
}


interface OrderData {
    id: string;
    customer: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postcode: string;
    };
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    totalAmount: number;
    paymentMethod: "sslcommerz";
    paymentStatus: "pending" | "paid" | "failed";
    orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
}


interface OrderResponse {
    success?: boolean;
    message?: string;
    order?: OrderData;
}

export default function PaymentPage() {
    const params = useParams<{ orderId: string }>();
    const router = useRouter();
    const { status } = useSession();
    const { clearCart } = useCart();

    const orderId = params.orderId;

    const [order, setOrder] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    // Fetch the order details from MongoDB
    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.replace(
                `/login?callbackUrl=${encodeURIComponent(
                    `/checkout/payment/${orderId}`
                )}`
            );
            return;
        }

        const fetchOrder = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `/api/orders/${orderId}`
                );

                const data: OrderResponse = await response.json();

                if (!response.ok || !data.order) {
                    throw new Error(
                        data.message || "Unable to load your order."
                    );
                }

                setOrder(data.order);

                // Clear the cart only when MongoDB confirms payment is verified.
                if (data.order.paymentStatus === "paid") {
                    clearCart();
                }
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [status, orderId, router, clearCart]);

    // Process simulated payment

    const handlePayment = async () => {
        if (!order || isPaying) return;

        try {
            setIsPaying(true);
            setErrorMessage("");

            const response = await fetch(
                "/api/payment/sslcommerz/initiate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderId: order.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success || !data.gatewayUrl) {
                throw new Error(
                    data.message ||
                    "Unable to connect to SSLCommerz. Please try again."
                );
            }

            // Redirect the customer to the official SSLCommerz payment page.
            window.location.assign(data.gatewayUrl);

        } catch (error) {
            console.error("SSLCommerz payment error:", error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Payment initiation failed. Please try again."
            );

            setIsPaying(false);
        }
    };


    const formatPrice = (price: number) =>
        `৳${price.toLocaleString("en-BD")}`;

    // Loading screen
    if (isLoading || status === "loading") {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <FaSpinner className="mx-auto animate-spin text-4xl text-[#7C3AED]" />
                    <p className="mt-5 text-lg font-medium text-[#292044]">
                        Loading your order...
                    </p>
                </div>
            </div>
        );
    }

    // Error screen
    if (errorMessage && !order) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC] px-5">
                <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-lg">
                    <p className="text-xl font-semibold text-red-500">
                        {errorMessage}
                    </p>

                    <button
                        onClick={() => router.push("/shop")}
                        className="mt-6 rounded-xl bg-[#7C3AED] px-7 py-3 font-semibold text-white transition hover:bg-[#6528D4]"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    if (!order) return null;

    // Payment success screen
    if (order.paymentStatus === "paid") {
        return (
            <section className="min-h-screen bg-[#F8FAFC] px-5 py-16">
                <div className="mx-auto max-w-2xl rounded-3xl bg-white px-6 py-12 text-center shadow-lg sm:px-12">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#D8F3DC]">
                        <FaCheckCircle className="text-5xl text-green-600" />
                    </div>

                    <h1 className="mt-7 text-3xl font-bold text-[#292044] sm:text-4xl">
                        Payment Successful!
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-gray-600">
                        Thank you for shopping with PawNest.
                        Your payment has been completed and your order
                        is now being processed.
                    </p>

                    <div className="mt-8 rounded-2xl bg-[#F8FAFC] p-6 text-left">
                        <p className="text-sm text-gray-500">
                            Order ID
                        </p>

                        <p className="mt-1 break-all font-semibold text-[#292044]">
                            {order.id}
                        </p>

                        <div className="mt-5 flex items-center justify-between">
                            <span className="text-gray-600">
                                Total Paid
                            </span>

                            <span className="text-2xl font-bold text-[#7C3AED]">
                                {formatPrice(order.totalAmount)}
                            </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-gray-600">
                                Order Status
                            </span>

                            <span className="rounded-full bg-[#D8F3DC] px-4 py-1 text-sm font-semibold capitalize text-green-700">
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/shop")}
                        className="mt-8 w-full rounded-xl bg-[#7C3AED] px-7 py-4 text-lg font-semibold text-white transition hover:bg-[#6528D4]"
                    >
                        Continue Shopping
                    </button>
                </div>
            </section>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-5 py-10 sm:py-14">
            <div className="mx-auto max-w-6xl">

                {/* Back Button */}
                <button
                    onClick={() => router.push("/checkout")}
                    className="mb-8 flex items-center gap-3 text-lg font-medium text-[#7C3AED] transition hover:gap-4"
                >
                    <FaArrowLeft />
                    Back to Checkout
                </button>

                {/* Page Heading */}
                <div className="mb-10">
                    <span className="rounded-full bg-[#E9D8FD] px-4 py-2 text-sm font-semibold text-[#7C3AED]">
                        PawNest Secure Checkout
                    </span>

                    <h1 className="mt-5 text-3xl font-bold text-[#292044] sm:text-4xl">
                        Complete Your Payment
                    </h1>

                    <p className="mt-3 text-lg text-gray-500">
                        Review your order and complete the payment.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.9fr]">

                    {/* Left Column */}
                    <div className="space-y-7">

                        {/* Customer Information */}
                        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DFF4FF] text-xl text-[#7C3AED]">
                                    <FaMapMarkerAlt />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-[#292044]">
                                        Delivery Information
                                    </h2>
                                    <p className="text-gray-500">
                                        Your order will be delivered to
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-lg text-gray-600">
                                <p>
                                    <span className="font-semibold text-[#292044]">
                                        {order.customer.fullName}
                                    </span>
                                </p>

                                <p>{order.customer.email}</p>
                                <p>{order.customer.phone}</p>
                                <p>
                                    {order.customer.address}, {order.customer.city}, {order.customer.postcode}
                                </p>
                            </div>
                        </section>

                        {/* Ordered Products */}
                        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-7 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E9D8FD] text-xl text-[#7C3AED]">
                                    <FaShoppingBag />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-[#292044]">
                                        Your Order
                                    </h2>
                                    <p className="text-gray-500">
                                        {order.items.length} product types
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {order.items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex items-center gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                                    >
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8FAFC]">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="80px"
                                                className="object-contain p-2"
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-semibold text-[#292044]">
                                                {item.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {item.category} · Qty: {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-lg font-bold text-[#7C3AED]">
                                            {formatPrice(
                                                item.price * item.quantity
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>


                        {/* Payment Method */}
                        <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D8F3DC] text-xl text-green-700">
                                    <FaCreditCard />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-[#292044]">
                                        Payment Method
                                    </h2>
                                    <p className="text-gray-500">
                                        Secure and convenient online payment
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-2xl border-2 border-[#7C3AED] bg-[#F8F5FF] p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl text-[#7C3AED]">
                                        <FaCreditCard />
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-lg font-bold text-[#292044]">
                                            Secure Online Payment
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Complete your payment using an available card,
                                            mobile banking, or internet banking option.
                                        </p>
                                    </div>

                                    <FaCheckCircle className="text-xl text-[#7C3AED]" />
                                </div>
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#DFF4FF] p-4">
                                <FaShieldAlt className="mt-1 shrink-0 text-[#7C3AED]" />

                                <p className="text-sm leading-6 text-gray-600">
                                    Your payment will be processed through a secure payment
                                    gateway. Your order will be confirmed only after successful
                                    payment verification.
                                </p>
                            </div>
                        </section>

                    </div>

                    {/* Right Column - Order Summary */}
                    <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-28">
                        <h2 className="text-2xl font-bold text-[#292044]">
                            Order Summary
                        </h2>

                        <p className="mt-2 break-all text-sm text-gray-400">
                            Order ID: {order.id}
                        </p>

                        <div className="mt-8 space-y-5 text-lg">
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span className="font-semibold text-[#292044]">
                                    {formatPrice(order.subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between gap-3">
                                <span className="flex items-center gap-2 text-gray-500">
                                    <FaTruck />
                                    Delivery
                                </span>

                                <span className="font-semibold text-[#292044]">
                                    {order.deliveryCharge === 0
                                        ? "Free"
                                        : formatPrice(order.deliveryCharge)}
                                </span>
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-5">
                                <div className="flex justify-between gap-3">
                                    <span className="font-bold text-[#292044]">
                                        Total Amount
                                    </span>

                                    <span className="text-2xl font-bold text-[#7C3AED]">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            onClick={handlePayment}
                            disabled={isPaying}
                            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-[#7C3AED] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-[#6528D4] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPaying ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt />
                                    Pay {formatPrice(order.totalAmount)}
                                </>
                            )}
                        </button>

                        <p className="mt-5 text-center text-sm leading-6 text-gray-400">
                            Your order will be processed after successful
                            payment.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}
