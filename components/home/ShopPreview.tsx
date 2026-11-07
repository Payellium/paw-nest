
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { featuredProducts } from "@/data/products";
import type { ProductCategory } from "@/types/product";

import {
  FaHeart,
  FaStar,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";

type Category = "All" | ProductCategory;

const categories: Category[] = [
  "All",
  "Food",
  "Toys",
  "Beds",
  "Grooming",
  "Accessories",
];

const ShopPreview = () => {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const { addToCart } = useCart();

  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [showCartMessage, setShowCartMessage] = useState(false);

  // Reset the added button after 1.5 seconds
  useEffect(() => {
    if (addedProductId === null) return;

    const timer = setTimeout(() => {
      setAddedProductId(null);
    }, 1500);

    return () => clearTimeout(timer);
  }, [addedProductId]);

  // Hide the success notification after 2 seconds
  useEffect(() => {
    if (!showCartMessage) return;

    const timer = setTimeout(() => {
      setShowCartMessage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showCartMessage]);

  // Show only featured products on the homepage
  const filteredProducts =
    activeCategory === "All"
      ? featuredProducts
      : featuredProducts.filter(
          (product) => product.category === activeCategory
        );

  // Add product to cart
  const handleAddToCart = (product: (typeof featuredProducts)[number]) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });

    setAddedProductId(product.id);
    setShowCartMessage(true);
  };

  return (
    <section
      id="shop"
      className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-12"
    >
      {/* SUCCESS NOTIFICATION */}
      {showCartMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-6 top-32 z-[100] flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-6 py-4 shadow-xl animate-in slide-in-from-right duration-300"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
            ✓
          </span>

          <div>
            <p className="text-lg font-extrabold text-[#1E293B]">
              Added to Cart!
            </p>

            <p className="text-base font-medium text-[#64748B]">
              Product added to your cart successfully.
            </p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-[1810px]">
        {/* ================= HEADER ================= */}
        <div className="text-center">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[4px] text-[#7C3AED] sm:text-base">
            PREMIUM SUPPLIES
          </p>

          <h2 className="nunito-font text-[42px] font-extrabold leading-tight tracking-[-1px] text-[#1E293B] sm:text-[52px] lg:text-[58px]">
            Shop for Your Pet
          </h2>

          <p className="mx-auto mt-6 max-w-[800px] text-[18px] font-medium leading-8 text-[#64748B] sm:text-[22px] sm:leading-10">
            Everything your companion needs, curated with love and backed by
            our quality guarantee.
          </p>
        </div>

        {/* ================= CATEGORIES ================= */}
        <div className="mt-24 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                rounded-full border px-7 py-3.5
                text-[17px] font-extrabold
                transition-all duration-300
                sm:px-8 sm:text-[18px]
                ${
                  activeCategory === category
                    ? "border-transparent bg-gradient-to-r from-[#7C20FF] to-[#09A9ED] text-white shadow-[0_12px_25px_rgba(124,58,237,0.20)] -translate-y-0.5"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:-translate-y-1 hover:border-[#C4B5FD] hover:text-[#7C3AED] hover:shadow-[0_8px_20px_rgba(124,58,237,0.10)]"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="mt-16 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[25px] bg-white shadow-[0_5px_18px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
            >
              {/* ================= IMAGE ================= */}
              <div className="relative h-[270px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* IMAGE OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* PRODUCT BADGE */}
                {product.badge && (
                  <div
                    className={`
                      absolute left-5 top-5 rounded-full px-4 py-2
                      text-sm font-extrabold
                      shadow-sm
                      ${
                        product.badge === "Sale"
                          ? "bg-[#FFE4EF] text-[#DB2777]"
                          : product.badge === "New"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : "bg-[#FFF1C7] text-[#B45309]"
                      }
                    `}
                  >
                    {product.badge}
                  </div>
                )}

                {/* WISHLIST */}
                <button
                  type="button"
                  aria-label={`Add ${product.name} to wishlist`}
                  className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#8BA1BD] shadow-[0_5px_15px_rgba(15,23,42,0.12)] transition-all duration-300 hover:scale-110 hover:bg-[#F3E8FF] hover:text-[#7C3AED]"
                >
                  <FaHeart className="text-[18px]" />
                </button>
              </div>

              {/* ================= CONTENT ================= */}
              <div className="p-6">
                {/* CATEGORY */}
                <p className="text-sm font-bold uppercase tracking-wide text-[#8B5CF6]">
                  {product.category}
                </p>

                {/* PRODUCT NAME */}
                <h3 className="mt-2 min-h-[30px] text-[21px] font-extrabold text-[#1E293B]">
                  {product.name}
                </h3>

                {/* RATING */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[#F59E0B]">
                    <FaStar />

                    <span className="font-bold">
                      {product.rating}
                    </span>
                  </div>

                  <span className="text-sm font-medium text-[#94A3B8]">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* PRICE */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-[24px] font-extrabold text-[#7C3AED]">
                    {`৳${product.price.toLocaleString("en-BD")}`}
                  </span>

                  {product.oldPrice && (
                    <span className="text-base font-semibold text-[#94A3B8] line-through">
                      {`৳${product.oldPrice.toLocaleString("en-BD")}`}
                    </span>
                  )}
                </div>

                {/* ADD TO CART */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={`
                    group/button mt-6 flex h-[54px] w-full
                    items-center justify-center gap-3 rounded-[16px]
                    text-[17px] font-extrabold text-white
                    shadow-[0_8px_18px_rgba(124,58,237,0.18)]
                    transition-all duration-300
                    ${
                      addedProductId === product.id
                        ? "bg-gradient-to-r from-[#16A34A] to-[#22C55E] shadow-[0_8px_18px_rgba(34,197,94,0.25)]"
                        : "bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.28)]"
                    }
                  `}
                >
                  {addedProductId === product.id ? (
                    <>
                      <span className="text-xl">✓</span>
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <FaShoppingBag className="text-[16px]" />
                      <span>Add to Cart</span>
                      <FaArrowRight className="text-sm transition-transform duration-300 group-hover/button:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* ================= VIEW ALL ================= */}
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-3 rounded-full border-2 border-[#DDD6FE] bg-white px-8 py-4 text-[17px] font-extrabold text-[#7C3AED] transition-all duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:bg-[#F5F3FF] hover:shadow-[0_10px_25px_rgba(124,58,237,0.10)]"
          >
            View All Products

            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopPreview;
