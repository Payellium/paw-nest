
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    FaCalendarAlt,
    FaCat,
    FaClock,
    FaSyringe,
    FaArrowRight,
    FaClipboardCheck,
} from "react-icons/fa";

interface VaccinationBooking {
    _id: string;
    vaccine: string;
    catName: string;
    breed: string;
    age: string;
    gender: string;
    preferredDate: string;
    status: "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rejected";
    createdAt: string;
}

const statusStyles: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-gray-100 text-gray-600",
    Rejected: "bg-red-100 text-red-700",
};

export default function VaccinationBookingsPage() {
    const [bookings, setBookings] = useState<VaccinationBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/vaccination-bookings");
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Failed to load vaccination bookings."
                    );
                }

                setBookings(data.bookings || []);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong while loading your bookings."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-8">
            {/* Heading */}
            <div>
                <p className="mb-2 text-base font-bold uppercase tracking-wider text-[#7C3AED]">
                    Your Pet&apos;s Healthcare
                </p>

                <h1 className="text-3xl font-extrabold text-[#292044] sm:text-4xl">
                    My Vaccination Bookings
                </h1>

                <p className="mt-3 text-lg leading-8 text-[#716B80]">
                    Keep track of your cat&apos;s vaccination booking requests and their
                    current status.
                </p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex min-h-60 items-center justify-center rounded-3xl bg-white shadow-sm">
                    <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-6 text-base text-red-700"
                >
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && bookings.length === 0 && (
                <div className="rounded-3xl border border-purple-100 bg-white px-6 py-14 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F3ECFF] text-3xl text-[#7C3AED]">
                        <FaSyringe />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-[#292044]">
                        No Vaccination Bookings Yet
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-lg leading-8 text-[#716B80]">
                        You haven&apos;t submitted any vaccination requests. Book a
                        vaccination service to get started.
                    </p>

                    <Link
                        href="/vaccination"
                        className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#7C3AED] px-7 py-4 text-base font-bold text-white transition hover:bg-[#6929D0]"
                    >
                        Explore Vaccination Services
                        <FaArrowRight />
                    </Link>
                </div>
            )}

            {/* Booking List */}
            {!loading && !error && bookings.length > 0 && (
                <>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#292044]">
                                Your Requests
                            </h2>
                            <p className="mt-1 text-base text-[#716B80]">
                                {bookings.length} vaccination{" "}
                                {bookings.length === 1 ? "request" : "requests"}
                            </p>
                        </div>

                        <Link
                            href="/vaccination"
                            className="hidden items-center gap-2 font-bold text-[#7C3AED] transition hover:gap-3 sm:inline-flex"
                        >
                            Book Another <FaArrowRight />
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <article
                                key={booking._id}
                                className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex flex-col gap-5 p-6 sm:p-8">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F3ECFF] text-2xl text-[#7C3AED]">
                                                <FaSyringe />
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold text-[#292044]">
                                                    {booking.vaccine}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Booking ID: {booking._id.slice(-8)}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-bold ${statusStyles[booking.status] ||
                                                "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="grid gap-5 border-t border-purple-50 pt-5 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <FaCat className="shrink-0 text-xl text-[#7C3AED]" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Cat&apos;s Name
                                                </p>
                                                <p className="text-lg font-semibold text-[#292044]">
                                                    {booking.catName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaClipboardCheck className="shrink-0 text-xl text-[#7C3AED]" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Breed & Age
                                                </p>
                                                <p className="text-lg font-semibold text-[#292044]">
                                                    {booking.breed} · {booking.age}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaCalendarAlt className="shrink-0 text-xl text-[#7C3AED]" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Preferred Date
                                                </p>
                                                <p className="text-lg font-semibold text-[#292044]">
                                                    {formatDate(booking.preferredDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaClock className="shrink-0 text-xl text-[#7C3AED]" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Request Submitted
                                                </p>
                                                <p className="text-lg font-semibold text-[#292044]">
                                                    {formatDate(booking.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <Link
                        href="/vaccination"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-4 font-bold text-white transition hover:bg-[#6929D0] sm:hidden"
                    >
                        Book Another Vaccination <FaArrowRight />
                    </Link>
                </>
            )}
        </div>
    );
}
