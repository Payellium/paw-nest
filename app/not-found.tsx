import Link from "next/link";
import { FaPaw } from "react-icons/fa";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
            <div className="text-center">

                {/* Paw Icon */}
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#E9D8FD]">
                    <FaPaw className="text-5xl text-[#7C3AED]" />
                </div>

                {/* Error Code */}
                <h1 className="text-[100px] font-extrabold leading-none text-[#7C3AED]">
                    404
                </h1>

                {/* Heading */}
                <h2 className="mt-5 text-3xl font-extrabold text-[#1E293B]">
                    Oops! This page wandered off 🐾
                </h2>

                {/* Description */}
                <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-[#64748B]">
                    Looks like this page could not be found. Maybe our little
                    companion took it somewhere else!
                </p>

                {/* Button */}
                <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-3 rounded-full
                     bg-linear-to-r from-[#7C20FF] to-[#914DFF]
                     px-8 py-4 text-lg font-bold text-white
                     shadow-[0_10px_25px_rgba(124,58,237,0.20)]
                     transition-all duration-300
                     hover:-translate-y-1
                     hover:shadow-[0_14px_30px_rgba(124,58,237,0.30)]"
                >
                    <FaPaw />
                    Back to PawNest
                </Link>

            </div>
        </main>
    );
}