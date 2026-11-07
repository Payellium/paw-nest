
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaShoppingBag,
    FaTruck,
} from "react-icons/fa";

interface CheckoutForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
}

interface OrderResponse {
    success?: boolean;
    message?: string;
    order?: {
        id: string;
        subtotal: number;
        deliveryCharge: number;
        totalAmount: number;
        paymentStatus: string;
        orderStatus: string;
    };
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cartItems } = useCart();
    const { status } = useSession();

    const [formData, setFormData] = useState<CheckoutForm>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postcode: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Authentication protection
    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace(
                `/login?callbackUrl=${encodeURIComponent("/checkout")}`
            );
        }
    }, [status, router]);

    // Calculate subtotal
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    // Handle form changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit checkout information and create an order
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer: formData,
                    items: cartItems.map((item) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data: OrderResponse = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create your order."
                );
            }

            if (!data.success || !data.order?.id) {
                throw new Error(
                    "The order response was incomplete. Please check your orders before trying again."
                );
            }

            // Redirect to the payment page
            router.push(`/checkout/payment/${data.order.id}`);

        } catch (error) {
            console.error("Checkout submission error:", error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Authentication loading state
    if (status === "loading" || status === "unauthenticated") {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-[#7C3AED]"></span>

                    <p className="mt-4 text-lg font-semibold text-[#292044]">
                        Checking your account...
                    </p>
                </div>
            </main>
        );
    }

    // Empty cart state
    if (cartItems.length === 0) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
                <FaShoppingBag className="mb-6 text-6xl text-[#C4B5FD]" />

                <h1 className="text-3xl font-extrabold text-[#292044]">
                    Your cart is empty
                </h1>

                <p className="mt-3 text-lg text-gray-500">
                    Add some lovely products before checking out.
                </p>

                <button
                    onClick={() => router.push("/shop")}
                    className="mt-7 rounded-xl bg-[#7C3AED] px-8 py-4 font-bold text-white transition hover:bg-[#6D28D9]"
                >
                    Explore Products
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-5xl">

                {/* PAGE HEADER */}
                <div className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 flex items-center gap-2 font-semibold text-[#7C3AED] transition hover:text-[#5B21B6]"
                    >
                        <FaArrowLeft />
                        Back to Cart
                    </button>

                    <h1 className="text-3xl font-extrabold text-[#292044] sm:text-4xl">
                        Complete Your Order
                    </h1>

                    <p className="mt-3 text-base text-gray-500 sm:text-lg">
                        Just a few details and your cat&apos;s goodies will be on their way!
                    </p>
                </div>

                {/* ERROR MESSAGE */}
                {errorMessage && (
                    <div
                        role="alert"
                        className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
                    >
                        <p className="font-semibold">
                            {errorMessage}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* ORDER SUMMARY */}
                    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">

                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DFF4FF] text-xl text-[#7C3AED]">
                                <FaShoppingBag />
                            </div>

                            <div>
                                <h2 className="text-xl font-extrabold text-[#292044] sm:text-2xl">
                                    Your Order
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {cartItems.length} different products
                                </p>
                            </div>
                        </div>

                        {/* PRODUCTS */}
                        <div className="space-y-5">
                            {cartItems.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex gap-4 border-b border-gray-100 pb-5 last:border-0"
                                >
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8FAFC] sm:h-24 sm:w-24">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="h-full w-full object-cover"
                                        />

                                        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#7C3AED] px-1 text-xs font-bold text-white">
                                            {item.quantity}
                                        </span>
                                    </div>

                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-[#8B5CF6]">
                                                {item.product.category}
                                            </p>

                                            <h3 className="mt-1 font-bold text-[#292044]">
                                                {item.product.name}
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-500">
                                                ৳{item.product.price.toLocaleString("en-BD")} × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-base font-extrabold text-[#7C3AED] sm:text-lg">
                                            ৳{(
                                                item.product.price * item.quantity
                                            ).toLocaleString("en-BD")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PRICE DETAILS */}
                        <div className="mt-7 space-y-4 rounded-2xl bg-[#FAFAFF] p-5 sm:p-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>

                                <span className="font-semibold text-[#292044]">
                                    ৳{subtotal.toLocaleString("en-BD")}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Delivery</span>

                                <span className="font-semibold text-[#7C3AED]">
                                    Calculated later
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-5">
                                <span className="text-lg font-extrabold text-[#292044]">
                                    Total
                                </span>

                                <span className="text-2xl font-extrabold text-[#7C3AED]">
                                    ৳{subtotal.toLocaleString("en-BD")}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* DELIVERY INFORMATION */}
                    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">

                        <div className="mb-8 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9D8FD] text-xl text-[#7C3AED]">
                                <FaMapMarkerAlt />
                            </div>

                            <div>
                                <h2 className="text-xl font-extrabold text-[#292044] sm:text-2xl">
                                    Delivery Information
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Where should we deliver your order?
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                            {/* FULL NAME */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block font-bold text-[#292044]"
                                >
                                    Full Name *
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAFF] px-4 py-4 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block font-bold text-[#292044]"
                                >
                                    Email Address *
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAFF] px-4 py-4 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                                />
                            </div>

                            {/* PHONE */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block font-bold text-[#292044]"
                                >
                                    Phone Number *
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    pattern="[0-9+\-\s()]{7,20}"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAFF] px-4 py-4 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                                />
                            </div>

                            {/* ADDRESS */}
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="mb-2 block font-bold text-[#292044]"
                                >
                                    Delivery Address *
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows={4}
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="House number, road, area, and other details"
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-[#FAFAFF] px-4 py-4 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                                />
                            </div>

                            
                            {/* CITY */}
                            <div>
                                <label
                                    htmlFor="city"
                                    className="mb-2 block font-bold text-[#292044]"
                                >
                                    City / District *
                                </label>

                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Dhaka"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAFF] px-4 py-4 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                                />
                            </div>

                            {/* POSTAL CODE */}
                            <div>
                                <label
                                    htmlFor="postcode"
                                    className="mb-2 block font-bold text-[#292044]"
                                >
                                    Postal Code *
                                </label>

                                <input
                                    id="postcode"
                                    name="postcode"
                                    type="text"
                                    required
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={formData.postcode}
                                    onChange={handleChange}
                                    placeholder="e.g. 1700"
                                    className="w-full rounded-xl border border-gray-200 bg-[#FAFAFF] px-4 py-4 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/10"
                                />
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-[#7C20FF] to-[#914DFF] px-6 py-5 text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.28)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Creating Your Order...
                                </>
                            ) : (
                                "Continue to Payment"
                            )}
                        </button>

                        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
                            <FaTruck />
                            <span>Delivery details will be confirmed</span>
                        </div>
                    </section>
                </form>
            </div>
        </main>
    );
}
