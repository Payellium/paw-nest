
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCat,
    FaCheckCircle,
    FaHeart,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaSyringe,
    FaUser,
} from "react-icons/fa";

const vaccineOptions = [
    "FVRCP Vaccine",
    "Rabies Vaccine",
    "FeLV Vaccine",
    "Vet-Recommended Package",
];

interface BookingFormData {
    vaccine: string;
    catName: string;
    breed: string;
    age: string;
    gender: string;
    ownerName: string;
    email: string;
    phone: string;
    location: string;
    preferredDate: string;
    notes: string;
}

function BookingForm() {
    const router = useRouter();
    const { status } = useSession();
    const searchParams = useSearchParams();
    const selectedVaccine = searchParams.get("vaccine") || "";

    useEffect(() => {
        if (status === "unauthenticated") {
            const currentUrl = searchParams.toString()
                ? `/vaccination/book?${searchParams.toString()}`
                : "/vaccination/book";

            router.replace(
                `/login?callbackUrl=${encodeURIComponent(currentUrl)}`
            );
        }
    }, [status, router, searchParams]);

    const [formData, setFormData] = useState<BookingFormData>({
        vaccine: vaccineOptions.includes(selectedVaccine)
            ? selectedVaccine
            : "",
        catName: "",
        breed: "",
        age: "",
        gender: "",
        ownerName: "",
        email: "",
        phone: "",
        location: "",
        preferredDate: "",
        notes: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.vaccine) {
            setError("Please select a vaccination service.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/vaccination-bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message || "Failed to submit your booking. Please try again."
                );
                return;
            }

            setSuccess(data.message || "Your vaccination booking was submitted successfully.");

            // Reset the form while keeping the selected vaccine
            setFormData({
                vaccine: formData.vaccine,
                catName: "",
                breed: "",
                age: "",
                gender: "",
                ownerName: "",
                email: "",
                phone: "",
                location: "",
                preferredDate: "",
                notes: "",
            });
        } catch (error) {
            console.error("Vaccination booking submission error:", error);

            setError(
                "Something went wrong. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    };


    const inputClass =
        "mt-2 w-full rounded-xl border border-purple-100 bg-[#FCFAFF] px-4 py-3.5 text-base text-[#292044] outline-none transition placeholder:text-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100";

    const labelClass = "text-base font-semibold text-[#40365C]";

    if (status === "loading" || status === "unauthenticated") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
                <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#292044]">
            {/* Hero */}
            <section className="bg-linear-to-br from-[#F2E9FF] via-[#F8F5FF] to-[#E7F5FF] px-5 py-14 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-[#7C3AED] shadow-md">
                        <FaSyringe />
                    </div>

                    <p className="font-bold uppercase tracking-[0.2em] text-[#7C3AED]">
                        PawNest Vaccination Care
                    </p>

                    <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
                        Book a Vaccination
                        <span className="block text-[#7C3AED]">
                            For Your Furry Friend
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#716B80]">
                        Share a few details about your cat and choose your preferred
                        vaccination service. Our team will review your request.
                    </p>
                </div>
            </section>

            {/* Booking Form */}
            <section className="px-4 py-12 sm:px-6 sm:py-16">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href="/vaccination"
                        className="mb-8 inline-flex items-center gap-2 font-semibold text-[#7C3AED] transition hover:gap-3"
                    >
                        <FaArrowLeft />
                        Back to Vaccination Services
                    </Link>

                    <form
                        onSubmit={handleSubmit}
                        className="overflow-hidden rounded-[28px] border border-purple-100 bg-white shadow-lg shadow-purple-100/40"
                    >
                        {/* Form Heading */}
                        <div className="border-b border-purple-100 bg-linear-to-r from-[#F3EDFF] to-[#F0F8FF] px-6 py-7 sm:px-10">
                            <h2 className="text-2xl font-extrabold sm:text-3xl">
                                Vaccination Booking Details
                            </h2>

                            <p className="mt-2 text-base text-[#716B80]">
                                Please provide accurate information so we can process
                                your request.
                            </p>
                        </div>

                        <div className="space-y-10 p-6 sm:p-10">
                            {/* Vaccine Selection */}
                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9D8FD] text-xl text-[#7C3AED]">
                                        <FaSyringe />
                                    </span>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Select Vaccination Service
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Choose the service you want to request.
                                        </p>
                                    </div>
                                </div>

                                <label htmlFor="vaccine" className={labelClass}>
                                    Vaccination Option *
                                </label>

                                <select
                                    id="vaccine"
                                    name="vaccine"
                                    value={formData.vaccine}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">Choose a vaccination service</option>

                                    {vaccineOptions.map((vaccine) => (
                                        <option key={vaccine} value={vaccine}>
                                            {vaccine}
                                        </option>
                                    ))}
                                </select>
                            </section>

                            {/* Cat Information */}
                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DFF4FF] text-xl text-sky-600">
                                        <FaCat />
                                    </span>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Your Cat&apos;s Information
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Tell us a little about your furry companion.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="catName" className={labelClass}>
                                            Cat&apos;s Name *
                                        </label>
                                        <input
                                            id="catName"
                                            name="catName"
                                            value={formData.catName}
                                            onChange={handleChange}
                                            placeholder="e.g. Luna"
                                            required
                                            maxLength={80}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="breed" className={labelClass}>
                                            Breed *
                                        </label>
                                        <input
                                            id="breed"
                                            name="breed"
                                            value={formData.breed}
                                            onChange={handleChange}
                                            placeholder="e.g. Persian"
                                            required
                                            maxLength={80}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="age" className={labelClass}>
                                            Age *
                                        </label>
                                        <input
                                            id="age"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="e.g. 8 months or 2 years"
                                            required
                                            maxLength={40}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className={labelClass}>
                                            Gender *
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Unknown">Not sure</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Owner Information */}
                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D8F3DC] text-xl text-green-700">
                                        <FaUser />
                                    </span>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Owner&apos;s Information
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            How can our team contact you?
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="ownerName" className={labelClass}>
                                            Full Name *
                                        </label>
                                        <input
                                            id="ownerName"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            required
                                            maxLength={100}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={labelClass}>
                                            Email Address *
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            required
                                            maxLength={254}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className={labelClass}>
                                            <span className="inline-flex items-center gap-2">
                                                <FaPhoneAlt className="text-sm text-[#7C3AED]" />
                                                Phone Number *
                                            </span>
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="e.g. 01XXXXXXXXX"
                                            required
                                            maxLength={20}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className={labelClass}>
                                            <span className="inline-flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-sm text-[#7C3AED]" />
                                                Your Location *
                                            </span>
                                        </label>
                                        <input
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City / Area"
                                            required
                                            maxLength={150}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Preferred Date */}
                            <section>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0F7] text-xl text-pink-600">
                                        <FaCalendarAlt />
                                    </span>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Preferred Booking Date
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Select a date that works best for you.
                                        </p>
                                    </div>
                                </div>

                                <label htmlFor="preferredDate" className={labelClass}>
                                    Preferred Date *
                                </label>

                                <input
                                    id="preferredDate"
                                    name="preferredDate"
                                    type="date"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                    min={new Date().toLocaleDateString("en-CA")}
                                    required
                                    className={inputClass}
                                />

                                <p className="mt-2 text-sm text-gray-400">
                                    Your preferred date is a request, not a confirmed
                                    appointment.
                                </p>
                            </section>

                            {/* Additional Notes */}
                            <section>
                                <label htmlFor="notes" className={labelClass}>
                                    Additional Notes (Optional)
                                </label>

                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Previous vaccination history, health concerns, or anything else our team should know..."
                                    className={inputClass}
                                />
                            </section>

                            {/* Information Notice */}
                            <div className="flex gap-3 rounded-2xl border border-purple-100 bg-[#F8F5FF] p-5">
                                <FaHeart className="mt-1 shrink-0 text-xl text-[#7C3AED]" />

                                <div>
                                    <h4 className="font-bold text-[#292044]">
                                        A little note about your booking
                                    </h4>

                                    <p className="mt-1 text-sm leading-7 text-[#716B80]">
                                        Submitting a request does not guarantee an appointment.
                                        Your request will need to be reviewed and confirmed.
                                        A veterinarian should determine which vaccinations
                                        are appropriate for your cat.
                                    </p>
                                </div>
                            </div>

                            {/* Success Message */}
                            {success && (
                                <div
                                    role="status"
                                    className="rounded-xl border border-green-200 bg-green-50 p-5 text-base leading-7 text-green-800"
                                >
                                    <div className="flex items-center gap-2 font-bold">
                                        <FaCheckCircle />
                                        Booking Submitted Successfully!
                                    </div>

                                    <p className="mt-2">{success}</p>
                                    <p className="mt-1 text-sm">
                                        Your booking status is Pending until our team reviews and confirms it.
                                    </p>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#7C3AED] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:bg-[#6929D0] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaCheckCircle />
                                {loading ? "Submitting Booking..." : "Submit Booking Request"}
                            </button>

                            <p className="text-center text-sm text-gray-400">
                                Your booking information will be handled privately.
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default function VaccinationBookingPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
                    <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
                </main>
            }
        >
            <BookingForm />
        </Suspense>
    );
}
