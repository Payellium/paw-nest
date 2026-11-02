
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  FaPaw,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaTachometerAlt,
} from "react-icons/fa";

import CartDrawer from "./CartDrawer";
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name || "My Account";
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-profile-menu]")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    setProfileOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  // Profile dropdown
  const renderProfileDropdown = (mobile = false) => (
    <div
      className={`absolute right-0 top-full z-[60] mt-3 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-[0_12px_35px_rgba(41,32,68,0.15)] ${
        mobile ? "w-full" : "w-64"
      }`}
    >
      <div className="border-b border-gray-100 bg-[#F8F5FF] px-5 py-4">
        <p className="truncate text-center text-xl font-extrabold text-[#6b52b8]">
          {userName}
        </p>

        <p className="mt-1 text-center text-[#8790A5]">
          Welcome to PawNest!
        </p>
      </div>

      <div className="p-2">
        

        <Link
          href="/my-account/profile"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[20px] font-semibold text-[#50607A] transition hover:bg-[#F3EDFC] hover:text-[#7C3AED]"
        >
          <FaUser className="text-[#7C3AED]" />
          My Profile
        </Link>
        <Link
          href="/my-account"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-[20px] font-semibold text-[#50607A] transition hover:bg-[#F3EDFC] hover:text-[#7C3AED]"
        >
          <IoMdSettings className="text-[#7C3AED]" />
          Settings
        </Link>

        <div className="my-2 border-t border-gray-100" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[20px] font-semibold text-red-500 transition hover:bg-red-50"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );

  // Profile avatar
  const renderProfileAvatar = (mobile = false) => (
    <div className="relative" data-profile-menu>
      <button
        type="button"
        onClick={() => setProfileOpen((previous) => !previous)}
        aria-label="Open profile menu"
        aria-expanded={profileOpen}
        aria-haspopup="true"
        className={`flex items-center gap-2 rounded-full transition hover:opacity-80 ${
          mobile ? "w-full justify-between" : ""
        }`}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#7C3AED] bg-[#E9D8FD] shadow-sm">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-[#7C3AED]">
              {userInitial}
            </span>
          )}
        </div>

        {mobile ? (
          <>
            <span className="flex-1 text-left text-lg font-semibold text-[#50607A]">
              {userName}
            </span>

            <FaChevronDown
              className={`text-sm text-[#7C3AED] transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </>
        ) : (
          <FaChevronDown
            className={`text-xs text-[#7C3AED] transition-transform ${
              profileOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {profileOpen && renderProfileDropdown(mobile)}
    </div>
  );

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
            href="/pawnest-ai"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            PawNest AI
          </Link>

          <Link
            href="/shop"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            Shop
          </Link>

          <Link
            href="/about"
            className="text-[20px] font-semibold text-[#50607A] transition hover:text-[#7C3AED]"
          >
            About
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <CartDrawer />

          {status === "loading" ? (
            <div className="h-11 w-11 animate-pulse rounded-full bg-purple-100" />
          ) : isLoggedIn ? (
            renderProfileAvatar()
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
          onClick={() => {
            setMenuOpen(!menuOpen);
            setProfileOpen(false);
          }}
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
            <Link
              href="/"
              onClick={closeMenu}
              className="text-lg font-semibold text-[#50607A]"
            >
              Home
            </Link>

            <Link
              href="/adopt"
              onClick={closeMenu}
              className="text-lg font-semibold text-[#50607A]"
            >
              Adopt
            </Link>

            <Link
              href="/pawnest-ai"
              onClick={closeMenu}
              className="text-lg font-semibold text-[#50607A]"
            >
              PawNest AI
            </Link>

            <Link
              href="/shop"
              onClick={closeMenu}
              className="text-lg font-semibold text-[#50607A]"
            >
              Shop
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="text-lg font-semibold text-[#50607A]"
            >
              About
            </Link>

            <div className="flex items-center gap-3">
              <CartDrawer />

              <span className="text-lg font-semibold text-[#50607A]">
                Cart
              </span>
            </div>

            {status === "loading" ? (
              <div className="h-12 animate-pulse rounded-[18px] bg-purple-100" />
            ) : isLoggedIn ? (
              renderProfileAvatar(true)
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex h-13 items-center justify-center gap-2 rounded-[18px] bg-linear-to-r from-[#7C3AED] to-[#12A9F4] font-bold text-white"
                >
                  <FaSignInAlt />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
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
