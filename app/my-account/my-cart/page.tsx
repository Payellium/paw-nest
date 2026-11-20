
"use client";

import Image from "next/image";
import Link from "next/link";
import GlobalPawBackground from "@/components/GlobalPawBackground";
import { useCart } from "@/context/CartContext";
import {
    FaArrowRight,
    FaMinus,
    FaPlus,
    FaShoppingBag,
    FaShoppingCart,
    FaTrash,
} from "react-icons/fa";

export default function MyCartPage() {
    const {
        cartItems,
        cartCount,
        isCartLoading,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    const subtotal = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const formatPrice = (price: number) =>
        `৳${price.toLocaleString("en-BD")}`;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
            <GlobalPawBackground />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-2 py-6 sm:px-4 sm:py-8">
                {/* Page Header */}
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E9D8FD] text-xl text-[#7C3AED]">
                                <FaShoppingCart />
                            </span>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
                                Your Shopping Bag
                            </p>
                        </div>

                        <h1 className="text-2xl font-extrabold text-[#202033] sm:text-3xl">
                            My Cart
                        </h1>

                        <p className="mt-2 text-base leading-relaxed text-gray-500 sm:text-lg">
                            Review your selected products before checking out.
                        </p>
                    </div>

                    {cartItems.length > 0 && (
                        <button
                            type="button"
                            onClick={() => void clearCart()}
                            className="flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-base font-semibold text-red-500 transition hover:bg-red-50"
                        >
                            <FaTrash />
                            Clear Cart
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {isCartLoading ? (
                    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#E9D8FD] bg-white/90">
                        <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
                        <p className="mt-3 text-lg font-semibold text-gray-500">
                            Loading your cart...
                        </p>
                    </div>
                ) : cartItems.length === 0 ? (
                    /* Empty Cart */
                    <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-[#E9D8FD] bg-white/90 px-6 py-12 text-center shadow-sm">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E9D8FD] text-4xl text-[#7C3AED]">
                            <FaShoppingBag />
                        </div>

                        <h2 className="text-2xl font-extrabold text-[#202033] sm:text-3xl">
                            Your Cart Is Empty
                        </h2>

                        <p className="mt-3 max-w-md text-base leading-relaxed text-gray-500 sm:text-lg">
                            Looks like you haven&apos;t added anything to your cart
                            yet. Explore our shop and find something lovely for
                            your furry friend!
                        </p>

                        <Link
                            href="/shop"
                            className="mt-8 inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#8B4DFF] to-[#09A9ED] px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:shadow-xl"
                        >
                            Explore Shop
                            <FaArrowRight />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Cart Summary */}
                        <div className="mb-5 rounded-2xl border border-[#E9D8FD] bg-white/90 p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-extrabold text-[#202033] sm:text-2xl">
                                        Shopping Cart
                                    </h2>
                                    <p className="mt-1 text-base text-gray-500">
                                        {cartItems.length}{" "}
                                        {cartItems.length === 1
                                            ? "product"
                                            : "different products"}{" "}
                                        · {cartCount}{" "}
                                        {cartCount === 1 ? "item" : "items"}{" "}
                                        in total
                                    </p>
                                </div>

                                <span className="rounded-full bg-[#E9D8FD] px-4 py-2 text-sm font-bold text-[#7C3AED]">
                                    {cartCount} Items
                                </span>
                            </div>
                        </div>

                        {/* Cart Items + Order Summary */}
                        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
                            {/* Product List */}
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.product.id}
                                        className=" gap-4 rounded-3xl border border-[#E9D8FD] bg-white/95 p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                            {/* Product Image */}
                                            <div className="relative h-16 w-full shrink-0 overflow-hidden rounded-2xl bg-[#F8FAFC] sm:h-20 sm:w-20">
                                                <Image
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 128px"
                                                    className="object-contain p-2"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="min-w-0 flex-1">
                                                <p className="mb-1 text-[12px] font-bold uppercase text-[#8B4DFF]">
                                                    {item.product.category}
                                                </p>

                                                <h3 className="text-lg font-extrabold text-[#202033] sm:text-xl">
                                                    {item.product.name}
                                                </h3>

                                                <p className="mt-2 text-lg font-bold text-[#7C3AED]">
                                                    {formatPrice(item.product.price)}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 rounded-xl border border-[#E9D8FD] bg-[#F8FAFC] p-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void updateQuantity(
                                                                    item.product.id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                            disabled={item.quantity <= 1}
                                                            aria-label="Decrease quantity"
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#7C3AED] shadow-sm transition hover:bg-[#E9D8FD] disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <FaMinus size={12} />
                                                        </button>

                                                        <span className="min-w-7 text-center text-lg font-bold text-[#202033]">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void updateQuantity(
                                                                    item.product.id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                            aria-label="Increase quantity"
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#7C3AED] shadow-sm transition hover:bg-[#E9D8FD]"
                                                        >
                                                            <FaPlus size={12} />
                                                        </button>
                                                    </div>

                                                    {/* Remove Product */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void removeFromCart(
                                                                item.product.id
                                                            )
                                                        }
                                                        className="flex items-center gap-2 text-base font-semibold text-red-500 transition hover:text-red-700"
                                                    >
                                                        <FaTrash size={14} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="border-t border-dashed border-[#E9D8FD] pt-4 sm:min-w-28 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-right">
                                            <p className="text-sm font-medium text-gray-400">
                                                Item Total
                                            </p>
                                            <p className="mt-1 text-xl font-extrabold text-[#202033]">
                                                {formatPrice(
                                                    item.product.price *
                                                    item.quantity
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-2 py-3 text-base font-bold text-[#7C3AED] transition hover:text-[#09A9ED]"
                                >
                                    <FaArrowRight className="rotate-180" />
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Order Summary */}
                            <aside className="rounded-3xl border border-[#E9D8FD] bg-white/95 p-6 shadow-sm lg:sticky lg:top-24">
                                <h2 className="text-2xl font-extrabold text-[#202033]">
                                    Order Summary
                                </h2>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between gap-3 text-base text-gray-500">
                                        <span>Products</span>
                                        <span className="font-semibold text-[#202033]">
                                            {cartCount} items
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-base text-gray-500">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-[#202033]">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 text-base text-gray-500">
                                        <span>Delivery</span>
                                        <span className="font-semibold text-[#7C3AED]">
                                            Calculated later
                                        </span>
                                    </div>

                                    <div className="border-t border-dashed border-[#E9D8FD] pt-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-lg font-bold text-[#202033]">
                                                Total
                                            </span>
                                            <span className="text-2xl font-extrabold text-[#7C3AED]">
                                                {formatPrice(subtotal)}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-400">
                                            Delivery charges will be calculated
                                            during checkout.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#8B4DFF] to-[#09A9ED] px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    Proceed to Checkout
                                    <FaArrowRight />
                                </Link>

                                <div className="mt-5 rounded-2xl bg-[#F0F9FF] p-4 text-center">
                                    <p className="text-sm leading-relaxed text-[#52718A]">
                                        Your cart is saved to your PawNest
                                        account, so you can return to it anytime.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
