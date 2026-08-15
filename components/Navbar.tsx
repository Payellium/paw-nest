"use client";

import Link from "next/link";
import { FaPaw, FaShoppingCart, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/50 backdrop-blur-md">
      <div className="mx-auto flex h-[110px] w-full max-w-[1920px] items-center justify-between px-6 md:px-10 lg:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">

          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-3xl bg-linear-to-br from-[#8B5CF6] to-[#29B6F6] shadow-[0_5px_12px_rgba(99,102,241,0.25)]">
            <FaPaw className="text-[27px] text-[#28345D]" />
            
          </div>

          <span className="bg-gradient-to-r from-[#7C3AED] to-[#00A9F4] bg-clip-text text-[36px] font-extrabold tracking-[-1.5px] text-transparent">
            PawNest
          </span>

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-12 lg:flex">

          <Link
            href="/"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            Home
          </Link>

          <Link
            href="/adopt"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            Adopt
          </Link>

          <Link
            href="/shop"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            Shop
          </Link>

          <Link
            href="/success-stories"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            Success Stories
          </Link>

          <Link
            href="/about"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            Contact
          </Link>

        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">

          {/* Cart */}
          <Link
            href="/cart"
            className="flex h-[62px] w-[62px] items-center justify-center rounded-[22px] border border-[#E8EAF2] bg-white shadow-[0_2px_8px_rgba(30,41,59,0.08)] transition hover:shadow-md"
          >
            <FaShoppingCart className="text-[27px] text-[#7C3AED]" />
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="flex h-[62px] w-[140px] items-center justify-center gap-3 rounded-[22px] bg-gradient-to-r from-[#7C3AED] to-[#12A9F4] text-[20px] font-bold text-white shadow-[0_5px_14px_rgba(124,58,237,0.2)] transition hover:scale-[1.02]"
          >
            <FaSignInAlt className="text-[21px]" />
            Login
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-xl border border-gray-200 text-[#50607A] md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <FaTimes className="text-xl" />
          ) : (
            <FaBars className="text-xl" />
          )}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-6 md:hidden">

          <div className="flex flex-col gap-5">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-[#50607A]"
            >
              Home
            </Link>

            <Link
              href="/adopt"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-[#50607A]"
            >
              Adopt
            </Link>

            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-[#50607A]"
            >
              Shop
            </Link>

            <Link
              href="/success-stories"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-[#50607A]"
            >
              Success Stories
            </Link>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-[#50607A]"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-[#50607A]"
            >
              Contact
            </Link>

            <div className="mt-2 flex gap-3">

              <Link
                href="/cart"
                className="flex h-[52px] w-[52px] items-center justify-center rounded-[18px] border border-[#E8EAF2] text-[#7C3AED]"
              >
                <FaShoppingCart />
              </Link>

              <Link
                href="/login"
                className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[18px] bg-gradient-to-r from-[#7C3AED] to-[#12A9F4] font-bold text-white"
              >
                <FaSignInAlt />
                Login
              </Link>

            </div>

          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;