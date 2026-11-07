"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const emptySubscribe = () => () => { };

function getMountedSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    getMountedSnapshot,
    getServerSnapshot
  );

  // Convert "$24.99" into 24.99
  const getPrice = (price: number) => {
    return price;
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <>
      {/* CART BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open shopping cart with ${cartCount} items`}
        className="relative flex h-16 w-16 items-center justify-center rounded-[20px] border border-gray-200 bg-white text-[#7C3AED] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(124,58,237,0.15)]"
      >
        <FaShoppingCart className="text-2xl" />

        {/* CART COUNT */}
        {cartCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#7C3AED] px-1.5 text-sm font-extrabold text-white shadow-md"
          >
            {cartCount}
          </span>
        )}
      </button>

      {/* CART DRAWER */}
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999]">
            {/* BACKDROP */}
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[5px]"
            />

            {/* DRAWER */}
            <aside className="absolute right-0 top-0 flex h-dvh w-full max-w-[590px] flex-col overflow-hidden bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.15)] animate-cart-slide"
            >
              {/* HEADER */}
              <div className="flex h-29 shrink-0 items-center justify-between border-b border-gray-100 px-5 sm:px-8">
                <h2 className="text-[32px] font-extrabold text-[#1E293B]">
                  Your Cart{" "}
                  <span className="text-[#7C3AED]">({cartCount})</span>
                </h2>

                <button
                  type="button"
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
              {cartItems.length === 0 ? (
                <div
                  className="flex flex-1 flex-col items-center justify-center
                             px-6 text-center"
                >
                  <div className="mb-8 text-[82px] text-[#E5E7EB]">
                    <FaShoppingCart />
                  </div>

                  <h3 className="text-[27px] font-extrabold text-[#8FA3C2]">
                    Your cart is empty
                  </h3>

                  <p className="mt-4 text-[22px] text-[#9AAECC]">
                    Add products to get started
                  </p>

                  <button
                    type="button"
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
              ) : (
                <>
                  {/* CART PRODUCTS */}
                  <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-5 rounded-2xl border border-gray-100
                                   bg-[#FAFAFF] p-4"
                      >
                        {/* PRODUCT IMAGE */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white sm:h-28 sm:w-28">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#8B5CF6]">
                              {item.product.category}
                            </p>

                            <h3 className="mt-1 text-lg font-extrabold text-[#1E293B]">
                              {item.product.name}
                            </h3>

                            <p className="mt-1 text-lg font-bold text-[#7C3AED]">
                              ৳{item.product.price.toLocaleString("en-BD")}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            {/* QUANTITY CONTROLS */}
                            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-3 py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="text-sm text-[#7C3AED] transition hover:text-[#4C1D95]"
                              >
                                <FaMinus />
                              </button>

                              <span className="min-w-5 text-center text-base font-bold text-[#1E293B]">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                                className="text-sm text-[#7C3AED] transition hover:text-[#4C1D95]"
                              >
                                <FaPlus />
                              </button>
                            </div>

                            {/* REMOVE PRODUCT */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              aria-label={`Remove ${item.product.name}`}
                              className="text-lg text-red-400 transition hover:scale-110 hover:text-red-600"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CART SUMMARY */}
                  <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-5 sm:px-8 sm:py-6">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-xl font-semibold text-[#64748B]">
                        Subtotal
                      </span>

                      <span className="text-2xl font-extrabold text-[#1E293B]">
                        ৳{subtotal.toLocaleString("en-BD")}
                      </span>
                    </div>

                    <p className="mb-5 text-base text-[#94A3B8]">
                      Shipping and taxes will be calculated at checkout.
                    </p>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        router.push("/checkout");
                      }}
                      type="button"
                      className="w-full rounded-[18px] bg-linear-to-r from-[#7C20FF] to-[#914DFF] py-5 text-xl font-extrabold text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.28)]"
                    >
                      Proceed to Checkout
                    </button>

                    <Link
                      type="button"
                      onClick={() => setIsOpen(false)}
                      href="/shop"
                      className="mt-4 w-full flex items-center justify-center text-lg font-bold
                                 text-[#7C3AED] transition hover:text-[#4C1D95] hover:underline"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </>
              )}
            </aside>
          </div>,
          document.body
        )}
    </>
  );
}