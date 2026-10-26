
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlobalPawBackground from "@/components/GlobalPawBackground";

interface Cat {
  _id: string;
  name: string;
  breed: string;
  age?: number;
  ageInMonths?: number;
  gender: string;
  location: string;
  image: string;
  adoptionStatus: string;
}

const inputClass =
  "mt-2.5 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10 sm:text-lg";

const labelClass =
  "block text-base font-bold text-slate-800 sm:text-lg";

export default function AdoptionApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [cat, setCat] = useState<Cat | null>(null);
  const [loadingCat, setLoadingCat] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    city: "",
    livingEnvironment: "",
    hasPreviousCatExperience: false,
    reason: "",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCat() {
      try {
        setLoadingCat(true);
        setError("");

        const response = await fetch(`/api/cats/${id}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("We couldn't find this cat.");
        }

        const data = await response.json();
        const fetchedCat = data.cat ?? data;

        setCat(fetchedCat);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Failed to load cat information.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCat(false);
        }
      }
    }

    fetchCat();

    return () => controller.abort();
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCheckboxChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setFormData((previous) => ({
      ...previous,
      hasPreviousCatExperience: event.target.checked,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!cat) {
      setError("Cat information is unavailable. Please try again.");
      return;
    }

    if (cat.adoptionStatus !== "Available") {
      setError("Sorry, this cat is no longer available for adoption.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/adoption-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          catId: cat._id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to submit your application. Please try again."
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCat) {
    return (
      <>
        <GlobalPawBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center bg-[#F8FAFC]/70 px-5">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
            <p className="mt-5 text-lg font-semibold text-slate-700 sm:text-xl">
              Getting everything ready for you... 🐾
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!cat) {
    return (
      <>
        <GlobalPawBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center bg-[#F8FAFC]/80 px-5 py-12">
          <div className="w-full max-w-xl rounded-3xl border border-white bg-white/95 p-8 text-center shadow-xl sm:p-12">
            <div className="text-5xl">🐱</div>
            <h1 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Cat Not Found
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              We couldn&apos;t load this cat&apos;s information. Please return to the
              adoption page and try again.
            </p>
            <Link
              href="/adopt"
              className="mt-7 inline-flex rounded-2xl bg-[#7C3AED] px-7 py-4 text-base font-bold text-white transition hover:bg-violet-700 sm:text-lg"
            >
              Explore Available Cats
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (success) {
    return (
      <>
        <GlobalPawBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center bg-[#F8FAFC]/75 px-4 py-12 sm:px-6">
          <section className="w-full max-w-2xl rounded-[2rem] border border-white bg-white/95 p-7 text-center shadow-2xl sm:p-12 lg:p-14">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#D8F3DC] text-5xl">
              🐾
            </div>

            <p className="mt-7 text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C3AED] sm:text-base">
              Application Submitted
            </p>

            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              One Step Closer to{" "}
              <span className="text-[#7C3AED]">Forever Love!</span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              Thank you for opening your heart to {cat.name}. Your adoption
              application has been submitted successfully. We&apos;ll review your
              request and get back to you.
            </p>

            <div className="mt-8 rounded-3xl bg-[#F3E8FF]/70 p-5 sm:p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Your potential new family member
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {cat.name} 🐱
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/adopt")}
              className="mt-8 w-full rounded-2xl bg-[#7C3AED] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto sm:min-w-64"
            >
              Explore More Cats
            </button>

            <p className="mt-5 text-sm text-slate-500 sm:text-base">
              Thank you for choosing PawNest. Every paw deserves a loving home.
            </p>
          </section>
        </main>
      </>
    );
  }

  const isAvailable = cat.adoptionStatus === "Available";

  return (
    <>
      <GlobalPawBackground />

      <main className="relative z-10 min-h-screen bg-[#F8FAFC]/70 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          {/* Back link */}
          <Link
            href={`/adopt/${cat._id}`}
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-base font-bold text-slate-600 transition hover:text-[#7C3AED] sm:text-lg"
          >
            <span aria-hidden="true">←</span>
            Back to {cat.name}&apos;s profile
          </Link>

          {/* Page heading */}
          <header className="mx-auto mb-10 mt-8 max-w-3xl text-center sm:mb-14 sm:mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-2 text-sm font-bold text-[#7C3AED] shadow-sm sm:text-base">
              <span>💜</span>
              <span>Your journey starts here</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Make Room for{" "}
              <span className="text-[#7C3AED]">Love.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-8 lg:text-xl">
              Every great friendship starts with a little connection. Tell us
              about yourself and help us find the perfect forever home for{" "}
              <span className="font-bold text-slate-800">{cat.name}</span>.
            </p>

            {/* Progress indicator */}
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED] text-base font-extrabold text-white shadow-md sm:h-12 sm:w-12 sm:text-lg">
                  1
                </span>
                <span className="text-sm font-bold text-slate-800 sm:text-base">
                  Your details
                </span>
              </div>

              <div className="h-1 w-10 rounded-full bg-purple-200 sm:w-16" />

              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-base font-extrabold text-slate-400 sm:h-12 sm:w-12 sm:text-lg">
                  2
                </span>
                <span className="text-sm font-semibold text-slate-400 sm:text-base">
                  Review
                </span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.7fr] lg:gap-10">
            {/* Selected cat card */}
            <aside className="overflow-hidden rounded-[2rem] border border-white bg-white/95 shadow-xl shadow-slate-200/60">
              <div className="relative">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-sm font-extrabold text-[#7C3AED] shadow-md sm:text-base">
                  Your chosen friend 🐾
                </div>

                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-64 w-full object-cover sm:h-80 lg:h-72"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-[#E9D8FD] text-7xl sm:h-80 lg:h-72">
                    🐱
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5">
                <p className=" font-extrabold uppercase tracking-[0.15em] text-[#7C3AED] sm:text-base">
                  Meet your new best friend
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {cat.name}
                </h2>

                <p className="mt-2 text-lg font-semibold text-slate-500 sm:text-xl">
                  {cat.breed}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[#F3E8FF] p-4">
                    <span className="text-sm font-semibold text-slate-500 sm:text-base">
                      Age
                    </span>
                    <p className="mt-1 text-base font-extrabold text-slate-800 sm:text-lg">
                      {typeof cat.ageInMonths === "number"
                        ? cat.ageInMonths < 12
                          ? `${cat.ageInMonths} months`
                          : `${Math.floor(cat.ageInMonths / 12)} ${
                              Math.floor(cat.ageInMonths / 12) === 1
                                ? "year"
                                : "years"
                            }`
                        : typeof cat.age === "number"
                          ? `${cat.age} ${cat.age === 1 ? "year" : "years"}`
                          : "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#DFF4FF] p-4">
                    <span className="text-sm font-semibold text-slate-500 sm:text-base">
                      Gender
                    </span>
                    <p className="mt-1 text-base font-extrabold text-slate-800 sm:text-lg">
                      {cat.gender}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl bg-[#D8F3DC]/70 p-4">
                  <span className="text-sm font-semibold text-slate-500 sm:text-base">
                    Location
                  </span>
                  <p className="mt-1 text-base font-extrabold text-slate-800 sm:text-lg">
                    📍 {cat.location}
                  </p>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/80 p-4">
                  <span className="text-2xl">💌</span>
                  <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    Adoption is a lifelong commitment. Thank you for considering
                    giving {cat.name} a safe, loving home.
                  </p>
                </div>
              </div>
            </aside>

            {/* Adoption form */}
            <section className="rounded-[2rem] border border-white bg-white/95 p-5 shadow-xl shadow-slate-200/60 sm:p-8 lg:p-10">
              <div className="mb-8">
                <div className="mb-3 inline-flex rounded-full bg-[#E9D8FD] px-4 py-2 text-sm font-extrabold text-[#7C3AED] sm:text-base">
                  ADOPTION APPLICATION
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Tell Us About Yourself
                </h2>

                <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  A few details will help us understand you and the home you can
                  offer.
                </p>
              </div>

              {!isAvailable && (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-base font-semibold leading-7 text-amber-800 sm:text-lg">
                  This cat is currently marked as {cat.adoptionStatus}. New
                  applications cannot be submitted at this time.
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-base font-semibold leading-7 text-red-700 sm:text-lg"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="applicantName" className={labelClass}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="applicantName"
                    name="applicantName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.applicantName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    minLength={2}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Your contact number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className={labelClass}>
                    City / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Which city do you live in?"
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="livingEnvironment" className={labelClass}>
                    What type of home do you live in?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="livingEnvironment"
                    name="livingEnvironment"
                    value={formData.livingEnvironment}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none`}
                    required
                  >
                    <option value="" disabled>
                      Select your living environment
                    </option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-5 sm:p-6">
                  <label className="flex cursor-pointer items-start gap-4">
                    <input
                      type="checkbox"
                      name="hasPreviousCatExperience"
                      checked={formData.hasPreviousCatExperience}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#7C3AED]"
                    />
                    <span>
                      <span className="block text-base font-bold text-slate-800 sm:text-lg">
                        Have you cared for a cat before?
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
                        Let us know if you have previous experience with cats.
                      </span>
                    </span>
                  </label>
                </div>

                <div>
                  <label htmlFor="reason" className={labelClass}>
                    Why would you like to adopt {cat.name}?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={5}
                    placeholder="Tell us about the loving home you hope to provide..."
                    value={formData.reason}
                    onChange={handleChange}
                    className={`${inputClass} min-h-36 resize-y`}
                    required
                    minLength={10}
                  />
                  <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                    Share a little about your motivation and how you&apos;ll care for
                    your new companion.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
                  <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    <span className="font-extrabold text-slate-800">
                      Before you submit:
                    </span>{" "}
                    Please make sure your contact information is correct and
                    that you&apos;re ready for the responsibility of caring for a
                    cat.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !isAvailable}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#7C3AED] px-6 py-4 text-lg font-extrabold text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:py-5 sm:text-xl"
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Submitting Application...
                    </>
                  ) : (
                    <>Submit Adoption Application 🐾</>
                  )}
                </button>

                <p className="text-center text-sm leading-6 text-slate-500 sm:text-base">
                  By submitting, you confirm that the information provided is
                  accurate.
                </p>
              </form>
            </section>
          </div>

          {/* Footer note */}
          <div className="mx-auto mt-10 max-w-3xl pb-4 text-center sm:mt-14">
            <p className="text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
              A little paw can leave a big footprint on your heart.{" "}
              <span className="font-extrabold text-[#7C3AED]">
                Thank you for choosing PawNest. 💜
              </span>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
