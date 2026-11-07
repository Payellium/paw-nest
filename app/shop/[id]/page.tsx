
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    FaArrowLeft,
    FaArrowRight,
    FaCheck,
    FaHeart,
    FaMinus,
    FaPlus,
    FaShoppingBag,
    FaStar,
} from "react-icons/fa";

import GlobalPawBackground from "@/components/GlobalPawBackground";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";

const formatPrice = (price: number) =>
    `৳${price.toLocaleString("en-BD")}`;

export default function ProductDetailsPage() {
    const params = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { toggleWishlist, isWishlisted } = useWishlist();

    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const productId = Number(params.id);
    const product = products.find((item) => item.id === productId);

    if (!product) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-5">
                <GlobalPawBackground />

                <div className="relative z-10 w-full max-w-[600px] rounded-[28px] border border-[#E9E2F8] bg-white p-8 text-center shadow-lg sm:p-12">
                    <span className="text-7xl">🐱</span>

                    <h1 className="nunito-font mt-6 text-[36px] font-extrabold text-[#1E293B] sm:text-[42px]">
                        Product Not Found
                    </h1>

                    <p className="mt-4 text-[19px] leading-8 text-[#64748B]">
                        Sorry, we couldn&apos;t find the product you&apos;re looking for.
                        It may have been removed or the link may be incorrect.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED] px-8 py-4 text-[18px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        <FaArrowLeft />
                        Back to Shop
                    </Link>
                </div>
            </main>
        );
    }

    const relatedProducts = products
        .filter(
            (item) =>
                item.category === product.category && item.id !== product.id
        )
        .slice(0, 4);

    const handleAddToCart = () => {
        if (product.stock <= 0 || quantity > product.stock) return;

        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.image,
            });
        }

        setIsAdded(true);
        window.setTimeout(() => setIsAdded(false), 1800);
    };

    return (
        <main className="relative min-h-screen w-full overflow-x-hidden bg-[#F8FAFC]">
            <GlobalPawBackground />

            <div className="relative z-10">
                {/* BREADCRUMB */}
                <section className="w-full px-5 pt-8 sm:px-8 lg:px-12">
                    <div className="w-full">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-3 text-[18px] font-bold text-[#7C3AED] transition-all duration-300 hover:-translate-x-1 hover:text-[#5B21B6]"
                        >
                            <FaArrowLeft />
                            Back to Shop
                        </Link>

                        <div className="mt-5 flex flex-wrap items-center gap-2 text-[16px] font-semibold text-[#94A3B8] sm:text-[17px]">
                            <Link href="/" className="transition hover:text-[#7C3AED]">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/shop" className="transition hover:text-[#7C3AED]">
                                Shop
                            </Link>
                            <span>/</span>
                            <span className="text-[#7C3AED]">{product.name}</span>
                        </div>
                    </div>
                </section>

                {/* PRODUCT DETAILS */}
                <section className="w-full px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
                    {/* SHARED PRODUCT CONTAINER */}
                    <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] border border-[#E9E2F8] bg-white shadow-[0_10px_35px_rgba(30,41,59,0.07)] lg:grid-cols-2">

                        {/* PRODUCT IMAGE */}
                        <div className="relative flex items-center justify-center bg-gradient-to-br from-[#F5F0FF] to-[#EFF8FF] p-4 sm:p-6 lg:p-8">
                            <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-white sm:rounded-[28px]">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />

                                {product.badge && (
                                    <span
                                        className={`absolute left-5 top-5 z-10 rounded-full px-5 py-3 text-[17px] font-extrabold shadow-sm ${
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
                            </div>

                            {/* SHARED WISHLIST BUTTON */}
                            <button
                                type="button"
                                onClick={() => toggleWishlist(product.id)}
                                aria-label={
                                    isWishlisted(product.id)
                                        ? `Remove ${product.name} from wishlist`
                                        : `Add ${product.name} to wishlist`
                                }
                                aria-pressed={isWishlisted(product.id)}
                                className={`absolute right-7 top-7 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 sm:right-9 sm:top-9 ${
                                    isWishlisted(product.id)
                                        ? "scale-110 text-[#EF4444]"
                                        : "text-[#94A3B8] hover:text-[#EF4444]"
                                }`}
                            >
                                <FaHeart
                                    className={`text-[23px] transition-transform duration-300 ${
                                        isWishlisted(product.id)
                                            ? "scale-110"
                                            : "scale-100"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* PRODUCT INFORMATION */}
                        <div className="flex flex-col p-6 sm:p-8 lg:p-9 xl:p-10">

                            {/* CATEGORY AND BADGE */}
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-[#F0E9FF] px-4 py-2 text-[16px] font-extrabold uppercase tracking-wide text-[#7C3AED]">
                                    {product.category}
                                </span>

                                {product.badge && (
                                    <span className="rounded-full bg-[#EAF5FF] px-4 py-2 text-[16px] font-bold text-[#3979B8]">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            {/* PRODUCT NAME */}
                            <h1 className="nunito-font mt-5 text-[36px] font-extrabold leading-[1.2] text-[#1E293B] sm:text-[42px] lg:text-[46px]">
                                {product.name}
                            </h1>

                            {/* RATING */}
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[17px] text-[#F59E0B]">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={
                                                index < Math.round(product.rating)
                                                    ? "opacity-100"
                                                    : "opacity-30"
                                            }
                                        />
                                    ))}
                                </div>

                                <span className="text-[18px] font-extrabold text-[#334155]">
                                    {product.rating}
                                </span>

                                <span className="text-[17px] font-medium text-[#94A3B8]">
                                    ({product.reviews} reviews)
                                </span>
                            </div>

                            {/* PRICE */}
                            <div className="mt-7 rounded-2xl bg-gradient-to-r from-[#F5F0FF] to-[#EFF8FF] p-5 sm:p-6">
                                <p className="text-[16px] font-bold uppercase tracking-wider text-[#8B5CF6]">
                                    Our Price
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                    <span className="text-[32px] font-extrabold text-[#7C3AED]">
                                        {formatPrice(product.price)}
                                    </span>

                                    {product.oldPrice && (
                                        <span className="text-[20px] font-bold text-[#94A3B8] line-through">
                                            {formatPrice(product.oldPrice)}
                                        </span>
                                    )}
                                </div>

                                {product.oldPrice && (
                                    <p className="mt-2 text-[16px] font-bold text-[#16A34A]">
                                        You save {formatPrice(product.oldPrice - product.price)}
                                    </p>
                                )}
                            </div>

                            {/* DESCRIPTION */}
                            <div className="mt-7">
                                <h2 className="text-[24px] font-extrabold text-[#1E293B]">
                                    About This Product
                                </h2>

                                <p className="mt-3 text-[19px] font-medium leading-8 text-[#64748B]">
                                    {product.description}
                                </p>
                            </div>

                            {/* STOCK AVAILABILITY */}
                            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[#F1ECF9] py-5">
                                {product.stock > 0 ? (
                                    <>
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                                            <FaCheck />
                                        </span>

                                        <div>
                                            <p className="text-[18px] font-extrabold text-[#16A34A]">
                                                In Stock
                                            </p>
                                            <p className="text-[16px] font-medium text-[#94A3B8]">
                                                {product.stock} items available
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-[18px] font-extrabold text-[#DC2626]">
                                        Currently Out of Stock
                                    </p>
                                )}
                            </div>

                            {/* QUANTITY SELECTOR */}
                            <div className="mt-6">
                                <p className="mb-3 text-[19px] font-extrabold text-[#1E293B]">
                                    Select Quantity
                                </p>

                                <div className="flex h-[60px] w-fit items-center rounded-2xl border border-[#DDD6FE] bg-[#FAF9FF]">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((current) => Math.max(1, current - 1))
                                        }
                                        disabled={quantity <= 1}
                                        aria-label="Decrease quantity"
                                        className="flex h-full w-14 items-center justify-center rounded-l-2xl text-[#7C3AED] transition-all duration-300 hover:bg-[#E9D8FD] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FaMinus />
                                    </button>

                                    <span className="min-w-14 text-center text-[21px] font-extrabold text-[#1E293B]">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity((current) =>
                                                Math.min(product.stock, current + 1)
                                            )
                                        }
                                        disabled={quantity >= product.stock}
                                        aria-label="Increase quantity"
                                        className="flex h-full w-14 items-center justify-center rounded-r-2xl text-[#7C3AED] transition-all duration-300 hover:bg-[#E9D8FD] active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            {/* ADD TO CART */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || quantity > product.stock}
                                className={`mt-5 flex h-[64px] w-full items-center justify-center gap-3 rounded-2xl px-6 text-[19px] font-extrabold text-white shadow-[0_8px_18px_rgba(124,58,237,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.25)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                                    isAdded
                                        ? "bg-gradient-to-r from-[#16A34A] to-[#22C55E]"
                                        : "bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED]"
                                }`}
                            >
                                {isAdded ? (
                                    <>
                                        <FaCheck />
                                        Added to Cart!
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingBag />
                                        Add to Cart
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-center text-[16px] font-medium text-[#94A3B8]">
                                Made with care for your feline friend. 🐾
                            </p>
                        </div>
                    </div>
                </section>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <section className="w-full px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
                        <div className="mb-8">
                            <p className="text-[16px] font-extrabold uppercase tracking-[3px] text-[#8B5CF6]">
                                YOU MAY ALSO LIKE
                            </p>

                            <h2 className="nunito-font mt-2 text-[32px] font-extrabold text-[#1E293B] sm:text-[40px]">
                                More from {product.category}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    href={`/shop/${relatedProduct.id}`}
                                    className="group overflow-hidden rounded-[24px] border border-[#EDF0F5] bg-white shadow-[0_5px_18px_rgba(15,23,42,0.05)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#D8C5FF] hover:shadow-[0_18px_35px_rgba(15,23,42,0.11)]"
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F1F5F9]">
                                        <Image
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-5">
                                        <p className="text-[15px] font-extrabold uppercase tracking-wide text-[#8B5CF6]">
                                            {relatedProduct.category}
                                        </p>

                                        <h3 className="mt-2 text-[20px] font-extrabold leading-7 text-[#1E293B]">
                                            {relatedProduct.name}
                                        </h3>

                                        <p className="mt-3 text-[23px] font-extrabold text-[#7C3AED]">
                                            {formatPrice(relatedProduct.price)}
                                        </p>

                                        <span className="mt-4 inline-flex items-center gap-2 text-[17px] font-extrabold text-[#7C3AED] transition-all duration-300 group-hover:gap-3">
                                            View Product
                                            <FaArrowRight />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
