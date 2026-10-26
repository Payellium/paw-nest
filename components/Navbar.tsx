
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  FaPaw,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name || "My Account";

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/50 backdrop-blur-md">
      <div className="mx-auto flex h-27.5 w-full max-w-[1920px] items-center justify-between px-6 md:px-10 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-15.5 w-15.5 items-center justify-center rounded-3xl bg-linear-to-br from-[#8B5CF6] to-[#29B6F6] shadow-[0_5px_12px_rgba(99,102,241,0.25)]">
            <FaPaw className="text-[27px] text-[#28345D]" />
          </div>

          <span className="bg-[#7C3AED] bg-clip-text text-[36px] font-extrabold tracking-[-1.5px] text-transparent">
            Paw<span className="text-[#00A9F4]">Nest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-12 lg:flex">
          <Link href="/" className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]">
            Home
          </Link>

          <Link href="/adopt" className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]">
            Adopt
          </Link>

          <Link href="/pawnest-ai" className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]">
            PawNest AI
          </Link>

          <Link href="/shop" className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]">
            Shop
          </Link>

          <Link href="/about" className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]">
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <CartDrawer />

          {status === "loading" ? (
            <div className="h-13 w-35 animate-pulse rounded-[22px] bg-purple-100" />
          ) : isLoggedIn ? (
            <>
              <span className="max-w-35 truncate text-sm font-semibold text-[#50607A]">
                Hi, {userName}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex h-15.5 items-center justify-center gap-3 rounded-[22px] border border-[#7C3AED] px-5 text-[17px] font-bold text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex h-15.5 w-35 items-center justify-center gap-3 rounded-[22px] bg-linear-to-r from-[#7C3AED] to-[#12A9F4] text-[20px] font-bold text-white shadow-[0_5px_14px_rgba(124,58,237,0.2)] transition hover:scale-[1.02]"
              >
                <FaSignInAlt className="text-[21px]" />
                Login
              </Link>

              <Link
                href="/register"
                className="flex h-15.5 items-center justify-center gap-2 rounded-[22px] border border-[#7C3AED] px-5 text-[17px] font-bold text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
              >
                <FaUserPlus />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 text-[#50607A] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
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
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-[#50607A]">
              Home
            </Link>

            <Link href="/adopt" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-[#50607A]">
              Adopt
            </Link>

            <Link href="/pawnest-ai" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-[#50607A]">
              PawNest AI
            </Link>

            <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-[#50607A]">
              Shop
            </Link>

            <Link href="/about" onClick={() => setMenuOpen(false)} className="text-lg font-semibold text-[#50607A]">
              About
            </Link>

            <div className="flex items-center gap-3">
              <CartDrawer />
              <span className="text-lg font-semibold text-[#50607A]">Cart</span>
            </div>

            {status === "loading" ? (
              <div className="h-12 animate-pulse rounded-[18px] bg-purple-100" />
            ) : isLoggedIn ? (
              <>
                <p className="text-sm font-semibold text-[#50607A]">
                  Signed in as {userName}
                </p>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-[18px] border border-[#7C3AED] font-bold text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-13 items-center justify-center gap-2 rounded-[18px] bg-linear-to-r from-[#7C3AED] to-[#12A9F4] font-bold text-white"
                >
                  <FaSignInAlt />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-13 items-center justify-center gap-2 rounded-[18px] border border-[#7C3AED] font-bold text-[#7C3AED] transition hover:bg-[#7C3AED] hover:text-white"
                >
                  <FaUserPlus />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
