
"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { featuredProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

const BestSellers = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  /*
   * Move carousel when arrow/cue is clicked
   */
  const scrollProducts = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const amount = 390;

    sliderRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  /*
   * Mouse drag functionality
   */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;

    sliderRef.current.classList.add("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;

    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDragging = () => {
    isDragging.current = false;

    if (sliderRef.current) {
      sliderRef.current.classList.remove("cursor-grabbing");
    }
  };

  return (
    <section className="relative overflow-hidden py-20">

      {/* ================= HEADER ================= */}
      <div className="px-6 sm:px-10 lg:px-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-3 flex items-center gap-3 text-[17px] font-extrabold uppercase tracking-[4px] text-[#F59E0B]">
              <span>🏆</span>
              Top Picks
            </p>

            <h2 className="nunito-font text-[44px] font-extrabold leading-none tracking-[-1px] text-[#1E293B] sm:text-[48px]">
              Best <span className="text-purple-500">Sellers</span>
            </h2>
          </div>

          {/* ================= DRAG CONTROL ================= */}
          <button
            type="button"
            onClick={() => scrollProducts("right")}
            className="group hidden items-center gap-2 text-[20px] font-medium text-[#8BA1BD] transition-colors duration-300 hover:text-[#7C3AED] md:flex"
          >
            <span>← Drag to explore →</span>
          </button>
        </div>
      </div>

      {/* ================= PRODUCT SLIDER ================= */}
      <div
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="mt-14 flex cursor-grab gap-6 overflow-x-auto px-6 pb-4 select-none scrollbar-hide sm:px-10 lg:px-12"
      >
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className="w-81.25 min-w-81.25 overflow-hidden rounded-[25px] bg-linear-to-b from-white to-[#F8FBFF] shadow-[0_4px_12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_30px_rgba(15,23,42,0.15)] sm:w-81.25 sm:min-w-81.25"
          >
            {/* ================= IMAGE ================= */}
            <div className="relative h-50 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="325px"
                draggable={false}
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* ================= PRODUCT INFO ================= */}
            <div className="px-6 py-5">
              {/* Product name */}
              <h3 className="min-h-13 text-[21px] font-extrabold leading-[1.35] text-[#26344D]">
                {product.name}
              </h3>

              {/* Stars and rating */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 text-[#FFB000]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-[16px]" />
                  ))}
                </div>

                <span className="text-[15px] font-semibold text-[#8BA1BD]">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              {/* Price + Add */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[24px] font-extrabold text-[#731EFF]">
                  ৳{product.price.toLocaleString("en-BD")}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      price: product.price,
                      image: product.image,
                    })
                  }
                  disabled={product.stock <= 0}
                  className="rounded-full bg-[#7C20FF] px-5 py-2 text-[17px] font-extrabold text-white transition-all duration-300 hover:scale-105 hover:bg-[#6916E8] hover:shadow-[0_8px_18px_rgba(124,32,255,0.3)] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {product.stock <= 0 ? "Sold Out" : "Add"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ================= MOBILE DRAG HINT ================= */}
      <div className="mt-2 flex justify-center md:hidden">
        <button
          type="button"
          onClick={() => scrollProducts("right")}
          className="flex items-center gap-2 text-sm font-semibold text-[#8BA1BD]"
        >
          <FaArrowLeft />
          Drag to explore
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default BestSellers;
