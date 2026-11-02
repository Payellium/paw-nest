
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const personalityOptions = [
  "Friendly",
  "Playful",
  "Calm",
  "Affectionate",
  "Independent",
  "Energetic",
  "Shy",
  "Good with children",
];

export default function RehomePage() {
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: "",
    breed: "",
    ageInMonths: "",
    gender: "",
    location: "",
    image: "",
    description: "",
    personality: [] as string[],
    vaccinated: true,
    neutered: true,
    specialNeeds: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(
    field: keyof typeof form,
    value: string | boolean | string[]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setMessage("");
  }

  function togglePersonality(trait: string) {
    const updated = form.personality.includes(trait)
      ? form.personality.filter((item) => item !== trait)
      : [...form.personality, trait];

    updateField("personality", updated);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Enter your cat's name.";
    if (!form.breed.trim()) newErrors.breed = "Enter the breed.";
    if (
      form.ageInMonths === "" ||
      !Number.isFinite(Number(form.ageInMonths)) ||
      Number(form.ageInMonths) < 0
    ) {
      newErrors.ageInMonths = "Enter a valid age in months.";
    }
    if (!form.gender) newErrors.gender = "Choose a gender.";
    if (!form.location.trim()) newErrors.location = "Enter the location.";
    if (!form.image.trim()) newErrors.image = "Enter an image URL.";
    if (form.personality.length === 0) {
      newErrors.personality = "Choose at least one personality trait.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          ageInMonths: Number(form.ageInMonths),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.message || "We couldn't submit your listing. Please try again."
        );
        return;
      }

      setMessage(
        "Your cat listing has been submitted! It will appear on Adopt after admin approval."
      );

      setForm({
        name: "",
        breed: "",
        ageInMonths: "",
        gender: "",
        location: "",
        image: "",
        description: "",
        personality: [],
        vaccinated: true,
        neutered: true,
        specialNeeds: false,
      });

      setErrors({});
    } catch {
      setMessage("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
        <p className="text-slate-600">Checking your login...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-20 text-slate-800">
        <div className="mx-auto max-w-xl rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Log in to re-home a cat</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            You need to log in before submitting a cat for adoption.
          </p>
          <Link
            href="/login?callbackUrl=%2Frehome"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  const labelClass = "block text-base font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50/70 via-[#F8FAFC] to-[#F8FAFC] px-4 py-7 text-slate-800 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-[#E9D8FD] via-[#DFF4FF] to-[#D8F3DC] px-6 py-7 shadow-sm sm:px-9 sm:py-9 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-8 select-none text-8xl opacity-15 sm:text-9xl">
            🐾
          </div>
          <div className="relative z-10 max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-sm font-semibold tracking-wide text-violet-700 shadow-sm">
              <span aria-hidden="true">💜</span> PawNest · Cat Re-homing
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[#1E293B] sm:text-5xl lg:text-6xl">
              Help your cat find a loving home
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Tell us about your cat. After an admin reviews and approves your
              listing, it can appear on our adoption page.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-medium text-slate-700">
              <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5">🐱 Share their story</span>
              <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5">🏡 Find a loving home</span>
              <span className="rounded-full border border-white/80 bg-white/65 px-3 py-1.5">✓ Admin-reviewed listings</span>
            </div>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-6 rounded-2xl border border-violet-100 bg-white p-5 shadow-[0_12px_40px_-24px_rgba(124,58,237,0.35)] sm:mt-6 sm:p-7 lg:p-9"
        >
          <section>
            <h2 className="text-xl font-bold sm:text-2xl">Basic information</h2>

            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:gap-x-8">
              <div>
                <label className={labelClass} htmlFor="name">
                  Cat name *
                </label>
                <input
                  id="name"
                  className={inputClass}
                  placeholder="e.g. Luna"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="breed">
                  Breed *
                </label>
                <input
                  id="breed"
                  className={inputClass}
                  placeholder="e.g. Persian"
                  value={form.breed}
                  onChange={(e) => updateField("breed", e.target.value)}
                />
                {errors.breed && (
                  <p className="mt-1 text-sm text-red-600">{errors.breed}</p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="ageInMonths">
                  Age in months *
                </label>
                <input
                  id="ageInMonths"
                  type="number"
                  min="0"
                  step="1"
                  className={inputClass}
                  placeholder="e.g. 8"
                  value={form.ageInMonths}
                  onChange={(e) =>
                    updateField("ageInMonths", e.target.value)
                  }
                />
                {errors.ageInMonths && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ageInMonths}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="gender">
                  Gender *
                </label>
                <select
                  id="gender"
                  className={inputClass}
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="location">
                  Location *
                </label>
                <input
                  id="location"
                  className={inputClass}
                  placeholder="e.g. Uttara, Dhaka"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="image">
                  Cat photo URL *
                </label>
                <input
                  id="image"
                  type="url"
                  className={inputClass}
                  placeholder="https://example.com/cat-photo.jpg"
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use a publicly accessible image URL for now.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Personality</h2>
            <p className="mt-1 text-gray-500 leading-7 font-medium">
              Choose all the traits that describe your cat.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {personalityOptions.map((trait) => {
                const selected = form.personality.includes(trait);

                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => togglePersonality(trait)}
                    aria-pressed={selected}
                    className={`rounded-full border px-4 py-2.5 font-medium transition ${
                      selected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"
                    }`}
                  >
                    {trait}
                  </button>
                );
              })}
            </div>

            {errors.personality && (
              <p className="mt-2  text-red-600">
                {errors.personality}
              </p>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold sm:text-2xl">Health information</h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex items-center gap-3 text-base text-slate-700">
                <input
                  type="checkbox"
                  className="size-4 accent-violet-600"
                  checked={form.vaccinated}
                  onChange={(e) => updateField("vaccinated", e.target.checked)}
                />
                My cat is vaccinated
              </label>

              <label className="flex items-center gap-3 text-base text-slate-700">
                <input
                  type="checkbox"
                  className="size-4 accent-violet-600"
                  checked={form.neutered}
                  onChange={(e) => updateField("neutered", e.target.checked)}
                />
                My cat is neutered or spayed
              </label>

              <label className="flex items-center gap-3 text-base text-slate-700">
                <input
                  type="checkbox"
                  className="size-4 accent-violet-600"
                  checked={form.specialNeeds}
                  onChange={(e) => updateField("specialNeeds", e.target.checked)}
                />
                My cat has special care needs
              </label>
            </div>
          </section>

          <section>
            <label className={labelClass} htmlFor="description">
              Additional details
            </label>
            <textarea
              id="description"
              rows={4}
              maxLength={2000}
              className={inputClass}
              placeholder="Tell potential adopters about your cat..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </section>

          {message && (
            <div
              role="status"
              className="rounded-xl border border-violet-100 bg-violet-50 p-4  leading-6 text-violet-800"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-violet-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-lg"
          >
            {submitting ? "Submitting..." : "Submit cat for review"}
          </button>

          <p className=" leading-6 text-slate-500">
            Your listing will remain pending until it has been reviewed by a
            PawNest administrator.
          </p>
        </form>
      </div>
    </main>
  );
}
