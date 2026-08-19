"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Nutrition Dog Mix",
    price: "$34.99",
    image:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "Interactive Cat Toy Bundle",
    price: "$19.99",
    image:
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Ortho Memory Foam Pet Bed",
    price: "$79.99",
    image:
      "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Professional Grooming Kit",
    price: "$29.99",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Grain-Free Cat Cuisine",
    price: "$24.99",
    image:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "Braided Rope Toy",
    price: "$14.99",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Premium Cat Scratcher",
    price: "$39.99",
    image:
      "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Natural Pet Shampoo",
    price: "$18.99",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80",
  },
];

const BestSellers = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

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

            {/* Small heading */}
            <p className="mb-3 flex items-center gap-3 text-[17px] font-extrabold uppercase tracking-[4px] text-[#F59E0B]">
              <span>🏆</span>
              Top Picks
            </p>

            {/* Main heading */}
            <h2 className="nunito-font text-[44px] font-extrabold leading-none tracking-[-1px] text-[#1E293B] sm:text-[48px]">
              Best Sellers
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

        {products.map((product) => (
          <article
            key={product.id}
            className="w-81.25 min-w-81.25 overflow-hidden rounded-[25px] bg-linear-to-b from-white to-[#F8FBFF] shadow-[0_4px_12px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_30px_rgba(15,23,42,0.15)] sm:w-81.25 sm:min-w-81.25"
          >

            {/* ================= IMAGE ================= */}
            <div className="h-50 overflow-hidden">

              <img
                src={product.image}
                alt={product.name}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />

            </div>

            {/* ================= PRODUCT INFO ================= */}
            <div className="px-6 py-5">

              {/* Product name */}
              <h3 className="min-h-13 text-[21px] font-extrabold leading-[1.35] text-[#26344D]">
                {product.name}
              </h3>

              {/* Stars */}
              <div className="mt-2 flex gap-1 text-[#FFB000]">

                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className="text-[16px]"
                  />
                ))}

              </div>

              {/* Price + Add */}
              <div className="mt-4 flex items-center justify-between">

                <span className="text-[27px] font-extrabold text-[#731EFF]">
                  {product.price}
                </span>

                <button
                  type="button"
                  className="rounded-full bg-[#7C20FF] px-5 py-2.5 text-[17px] font-extrabold text-white transition-all duration-300 hover:scale-105 hover:bg-[#6916E8] hover:shadow-[0_8px_18px_rgba(124,32,255,0.3)]"
                >
                  Add
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