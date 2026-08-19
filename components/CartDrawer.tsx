"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

 
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* CART BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open shopping cart"
        className="flex h-16 w-16 items-center justify-center rounded-[20px]
                   border border-gray-200 bg-white text-[#7C3AED]
                   shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                   transition-all duration-300
                   hover:-translate-y-1
                   hover:shadow-[0_8px_20px_rgba(124,58,237,0.15)]"
      >
        <FaShoppingCart className="text-2xl" />
      </button>

      
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-99999">

            {/* BACKDROP */}
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[5px]"
            />

            {/* DRAWER */}
            <aside
              className="absolute right-0 top-0 h-screen w-full max-w-147.5
                         bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.15)]
                         animate-cart-slide"
            >

              {/* HEADER */}
              <div
                className="flex h-29 items-center
                           justify-between border-b border-gray-100 px-8"
              >
                <h2 className="text-[32px] font-extrabold text-[#1E293B]">
                  Your Cart{" "}
                  <span className="text-[#7C3AED]">(0)</span>
                </h2>

                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close cart"
                  className="text-[34px] text-[#1E293B]
                             transition-all duration-200
                             hover:rotate-90 hover:text-[#7C3AED]"
                >
                  <IoClose />
                </button>
              </div>

              {/* EMPTY CART */}
              <div
                className="flex h-[calc(100vh-116px)]
                           flex-col items-center justify-center
                           px-6 text-center"
              >
                {/* CART ICON */}
                <div className="mb-8 text-[82px] text-[#E5E7EB]">
                  <FaShoppingCart />
                </div>

                <h3 className="text-[27px] font-extrabold text-[#8FA3C2]">
                  Your cart is empty
                </h3>

                <p className="mt-4 text-[22px] text-[#9AAECC]">
                  Add products to get started
                </p>

                {/* BROWSE SHOP */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-9 rounded-[20px]
                             bg-linear-to-r from-[#7C20FF] to-[#914DFF]
                             px-10 py-5 text-[20px] font-extrabold text-white
                             shadow-[0_8px_20px_rgba(124,58,237,0.18)]
                             transition-all duration-300
                             hover:-translate-y-1
                             hover:shadow-[0_12px_25px_rgba(124,58,237,0.28)]"
                >
                  Browse Shop
                </button>
              </div>

            </aside>
          </div>,

          document.body
        )}
    </>
  );
}