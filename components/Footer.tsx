import Link from "next/link";
import {
  FaPaw,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#0F172A] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-[1810px] px-8 pb-20 pt-16 lg:px-12">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">

          {/* =========================
              BRAND
          ========================= */}
          <div>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-linear-to-br from-[#8B5CF6] to-[#2196F3] shadow-[0_8px_20px_rgba(59,130,246,0.2)]">
                <FaPaw className="text-[25px] text-[#172033]" />
              </div>

              <span className="text-[30px] font-extrabold tracking-tight">
                Paw<span className="text-[#0EA5E9]">Nest</span>
              </span>
            </Link>

            {/* Description */}
            <p className="mt-8 max-w-97.5 text-[19px] font-medium leading-9 text-[#94A6C2]">
              Connecting pets with loving families and providing everything
              they need to live their best lives — since 2018.
            </p>

            {/* Social Icons */}
            <div className="mt-9 flex gap-4">

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1D2A42] text-[21px] text-[#CBD5E1] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7C3AED] hover:text-white"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61596063899189"
                aria-label="Facebook"
                className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1D2A42] text-[20px] text-[#CBD5E1] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7C3AED] hover:text-white"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1D2A42] text-[20px] text-[#CBD5E1] transition-all duration-300 hover:-translate-y-1 hover:bg-[#38BDF8] hover:text-white"
              >
                <FaXTwitter />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#1D2A42] text-[20px] text-[#CBD5E1] transition-all duration-300 hover:-translate-y-1 hover:bg-[#EF4444] hover:text-white"
              >
                <FaYoutube />
              </a>

            </div>

          </div>


          {/* =========================
              QUICK LINKS
          ========================= */}
          <div>

            <h3 className="text-[21px] font-extrabold">
              Quick Links
            </h3>

            <ul className="mt-7 space-y-5">

              <li>
                <Link
                  href="/"
                  className="text-[19px] font-semibold text-[#94A6C2] transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/adopt"
                  className="text-[19px] font-semibold text-[#94A6C2] transition-colors hover:text-white"
                >
                  Adopt
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="text-[19px] font-semibold text-[#94A6C2] transition-colors hover:text-white"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  href="/success-stories"
                  className="text-[19px] font-semibold text-[#94A6C2] transition-colors hover:text-white"
                >
                  Success Stories
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-[19px] font-semibold text-[#94A6C2] transition-colors hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-[19px] font-semibold text-[#94A6C2] transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>

            </ul>

          </div>


          {/* =========================
              ADOPTION RESOURCES
          ========================= */}
          <div>

            <h3 className="text-[21px] font-extrabold">
              Adoption Resources
            </h3>

            <ul className="mt-7 space-y-5">

              <li>
                <Link
                  href="/how-to-adopt"
                  className="text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
                >
                  How to Adopt
                </Link>
              </li>

              <li>
                <Link
                  href="/pet-care"
                  className="text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
                >
                  Pet Care Guide
                </Link>
              </li>

              <li>
                <Link
                  href="/shelter-partners"
                  className="text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
                >
                  Shelter Partners
                </Link>
              </li>

              <li>
                <Link
                  href="/foster"
                  className="text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
                >
                  Foster Program
                </Link>
              </li>

              <li>
                <Link
                  href="/rescue-stories"
                  className="text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
                >
                  Rescue Stories
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
                >
                  Adoption FAQ
                </Link>
              </li>

            </ul>

          </div>


          {/* =========================
              CONTACT
          ========================= */}
          <div>

            <h3 className="text-[21px] font-extrabold">
              Get in Touch
            </h3>

            <div className="mt-7 space-y-6">

              {/* Email */}
              <a
                href="mailto:hello@pawnest.com"
                className="flex items-start gap-5 text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
              >
                <FaEnvelope className="mt-1 shrink-0 text-[19px] text-[#A855F7]" />

                <span>
                  hello@pawnest.com
                </span>
              </a>


              {/* Phone */}
              <a
                href=""
                className="flex items-start gap-5 text-[19px] font-medium text-[#94A6C2] transition-colors hover:text-white"
              >
                <FaPhone className="mt-1 shrink-0 text-[18px] text-[#A855F7]" />
                    90258163
                <span>
                  
                </span>
              </a>


              {/* Address */}
              <div className="flex items-start gap-5 text-[19px] font-medium leading-8 text-[#94A6C2]">

                <FaMapMarkerAlt className="mt-1 shrink-0 text-[20px] text-[#A855F7]" />

                <span>
                  Hossain Tower, Housebuilding
                  <br />
                  Uttara, Dhaka 1230
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* Divider */}
        <div className="mt-20 h-px w-full bg-[#243047]" />


        {/* Bottom Footer */}
        <div className="flex flex-col gap-6 pt-12 md:flex-row md:items-center md:justify-between">

          {/* Copyright */}
          <p className="text-[17px] font-medium text-[#94A6C2]">
            © 2026 PawNest. All rights reserved for Payel & Shela.
          </p>


          {/* Legal Links */}
          <div className="flex flex-wrap gap-8">

            <Link
              href="/privacy"
              className="text-[17px] font-medium text-[#94A6C2] transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-[17px] font-medium text-[#94A6C2] transition-colors hover:text-white"
            >
              Terms of Service
            </Link>

            <Link
              href="/cookies"
              className="text-[17px] font-medium text-[#94A6C2] transition-colors hover:text-white"
            >
              Cookies
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}