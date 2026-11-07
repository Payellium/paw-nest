
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
    FaArrowRight,
    FaHeart,
    FaShoppingBag,
    FaStar,
    FaTrash,
} from "react-icons/fa";

import GlobalPawBackground from "@/components/GlobalPawBackground";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";

const formatPrice = (price: number) =>
    `৳${price.toLocaleString("en-BD")}`;

export default function MyWishlistPage() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();

    const wishlistProducts = useMemo(
        () => products.filter((product) => wishlist.includes(product.id)),
        [wishlist]
    );

    const handleAddToCart = (product: (typeof products)[number]) => {
        addToCart({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
        });
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC]">
            <GlobalPawBackground />

            <div className="relative z-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
                {/* PAGE HEADER */}
                <div className="mb-9">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCE7F3] text-[#EC4899]">
                            <FaHeart className="text-xl" />
                        </span>

                        <div>
                            <p className="text-[15px] font-extrabold uppercase tracking-[2px] text-[#8B5CF6]">
                                YOUR FAVORITES
                            </p>

                            <h1 className="nunito-font text-[32px] font-extrabold text-[#1E293B] sm:text-[38px]">
                                My Wishlist
                            </h1>
                        </div>
                    </div>

                    <p className="mt-4 max-w-[650px] text-[17px] leading-8 text-[#64748B]">
                        Keep all your favorite cat essentials in one place.
                        Revisit your saved products whenever you need them.
                    </p>
                </div>

                {/* WISHLIST SUMMARY */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-[#E9E2F8] bg-white p-5 shadow-[0_5px_20px_rgba(30,41,59,0.04)] sm:p-6">
                    <div>
                        <p className="text-[20px] font-extrabold text-[#1E293B]">
                            Saved Products
                        </p>

                        <p className="mt-1 text-[16px] font-medium text-[#64748B]">
                            {wishlistProducts.length}{" "}
                            {wishlistProducts.length === 1
                                ? "product"
                                : "products"}{" "}
                            in your wishlist
                        </p>
                    </div>

                    {wishlistProducts.length > 0 && (
                        <button
                            type="button"
                            onClick={clearWishlist}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#FECACA] bg-[#FFF1F2] px-5 py-3 text-[16px] font-extrabold text-[#DC2626] transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFE4E6]"
                        >
                            <FaTrash className="text-sm" />
                            Clear Wishlist
                        </button>
                    )}
                </div>

                {/* WISHLIST PRODUCTS */}
                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {wishlistProducts.map((product) => (
                            <article
                                key={product.id}
                                className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-[#E9E2F8] bg-white shadow-[0_5px_18px_rgba(15,23,42,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D8C5FF] hover:shadow-[0_18px_35px_rgba(15,23,42,0.11)]"
                            >
                                {/* PRODUCT IMAGE */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#F1F5F9]">
                                    <Link
                                        href={`/shop/${product.id}`}
                                        className="block h-full w-full"
                                    >
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </Link>

                                    {product.badge && (
                                        <span
                                            className={`absolute left-4 top-4 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm ${
                                                product.badge === "Sale"
                                                    ? "bg-[#FFE4EF] text-[#DB2777]"
                                                    : product.badge === "New"
                                                        ? "bg-[#DCFCE7] text-[#16A34A]"
                                                        : "bg-[#FFF1C7] text-[#B45309]"
                                            }`}
                                        >
                                            {product.badge}
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromWishlist(product.id)
                                        }
                                        aria-label={`Remove ${product.name} from wishlist`}
                                        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#EF4444] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#FFF1F2] active:scale-90"
                                    >
                                        <FaHeart className="text-[18px]" />
                                    </button>
                                </div>

                                {/* PRODUCT INFORMATION */}
                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <p className="text-[14px] font-extrabold uppercase tracking-wide text-[#8B5CF6]">
                                        {product.category}
                                    </p>

                                    <Link
                                        href={`/shop/${product.id}`}
                                        className="mt-2 block text-[21px] font-extrabold leading-7 text-[#1E293B] transition-colors duration-300 hover:text-[#7C3AED]"
                                    >
                                        {product.name}
                                    </Link>

                                    <p className="mt-3 line-clamp-2 text-[16px] font-medium leading-6 text-[#718096]">
                                        {product.description}
                                    </p>

                                    <div className="mt-4 flex items-center gap-2">
                                        <FaStar className="text-[#F59E0B]" />

                                        <span className="text-[16px] font-extrabold text-[#334155]">
                                            {product.rating}
                                        </span>

                                        <span className="text-[14px] font-medium text-[#94A3B8]">
                                            ({product.reviews} reviews)
                                        </span>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center gap-3">
                                        <span className="text-[25px] font-extrabold text-[#7C3AED]">
                                            {formatPrice(product.price)}
                                        </span>

                                        {product.oldPrice && (
                                            <span className="text-[16px] font-semibold text-[#94A3B8] line-through">
                                                {formatPrice(product.oldPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="mt-auto grid grid-cols-[1fr_auto] gap-3 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock <= 0}
                                            className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED] px-3 text-[16px] font-extrabold text-white shadow-[0_8px_18px_rgba(124,58,237,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <FaShoppingBag />
                                            Add to Cart
                                        </button>

                                        <Link
                                            href={`/shop/${product.id}`}
                                            aria-label={`View ${product.name}`}
                                            className="flex h-[52px] w-[52px] items-center justify-center rounded-xl border border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED] transition-all duration-300 hover:-translate-y-1 hover:bg-[#E9D8FD]"
                                        >
                                            <FaArrowRight />
                                        </Link>
                                    </div>

                                    {product.stock <= 0 && (
                                        <p className="mt-3 text-center text-[15px] font-bold text-[#DC2626]">
                                            Currently out of stock
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    /* EMPTY WISHLIST */
                    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[26px] border border-dashed border-[#D8C8F5] bg-white px-6 py-12 text-center">
                        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FCE7F3] text-[#EC4899]">
                            <FaHeart className="text-[42px]" />
                        </span>

                        <h2 className="nunito-font mt-7 text-[27px] font-extrabold text-[#1E293B] sm:text-[32px]">
                            Your Wishlist Is Empty
                        </h2>

                        <p className="mt-3 max-w-[480px] text-[17px] leading-8 text-[#64748B]">
                            You haven&apos;t saved any products yet. Explore
                            our collection and save the things your feline
                            friend might love!
                        </p>

                        <Link
                            href="/shop"
                            className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED] px-8 py-4 text-[17px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <FaShoppingBag />
                            Explore Shop
                            <FaArrowRight />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
