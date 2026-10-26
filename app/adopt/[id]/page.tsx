
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import GlobalPawBackground from "@/components/GlobalPawBackground";

type Cat = {
  _id: string;
  name: string;
  breed: string;
  ageInMonths: number;
  gender: string;
  location: string;
  image: string;
  personality: string[];
  adoptionStatus: string;
  description?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  specialNeeds?: string;
};

const formatAge = (months: number) => {
  if (months < 12) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"
    }`;
};

export default function CatDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;

    const fetchCat = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/cats/${params.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load cat details.");
        }

        setCat(data.cat);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading this cat."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCat();
  }, [params.id]);

  const goBack = () => {
    router.push("/adopt");
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden px-6 py-20">
        <GlobalPawBackground />

        <div className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center text-center">
          <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
          <p className="mt-5 text-lg font-semibold text-[#64748B]">
            Finding your furry friend...
          </p>
        </div>
      </main>
    );
  }

  if (error || !cat) {
    return (
      <main className="relative min-h-screen overflow-hidden px-6 py-20">
        <GlobalPawBackground />

        <section className="relative z-10 mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E9D8FD] text-4xl">
            🐾
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-[#1E293B]">
            Cat Not Found
          </h1>

          <p className="mt-3 leading-7 text-[#64748B]">
            {error || "We couldn't find this cat. It may no longer be available."}
          </p>

          <button
            onClick={goBack}
            className="mt-7 rounded-2xl bg-linear-to-r from-[#7C3AED] to-[#2196F3] px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1"
          >
            Back to Adoption
          </button>
        </section>
      </main>
    );
  }

  const isAvailable =
    cat.adoptionStatus?.toLowerCase() === "available";

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-12 md:px-8 md:py-20">
      <GlobalPawBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-[#DDD6FE] bg-white px-5 py-3 font-semibold text-[#7C3AED] shadow-sm transition-all duration-300 hover:-translate-x-1 hover:bg-[#F5F3FF]"
        >
          <span aria-hidden="true">←</span>
          Back to Adoption
        </button>

        {/* Cat Details */}
        <section className="grid overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] lg:grid-cols-2">
          {/* Cat Image */}
          <div className="relative flex min-h-[320px] items-center justify-center bg-linear-to-br from-[#E9D8FD] via-[#DFF4FF] to-[#D8F3DC] p-5 sm:min-h-[480px] lg:min-h-[600px]">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full max-h-[600px] min-h-[300px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl bg-white/60">
                <span className="text-7xl">🐱</span>
                <p className="mt-4 font-semibold text-[#64748B]">
                  Photo coming soon
                </p>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#E9D8FD] px-4 py-2 text-sm font-bold text-[#7C3AED]">
                🐾 {cat.breed}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${isAvailable
                    ? "bg-[#D8F3DC] text-[#166534]"
                    : "bg-amber-100 text-amber-800"
                  }`}
              >
                {cat.adoptionStatus || "Status unavailable"}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold text-[#1E293B] sm:text-5xl">
              Meet {cat.name}
            </h1>

            <p className="mt-4 leading-8 text-[#64748B]">
              {cat.description ||
                `Meet ${cat.name}, a lovely ${cat.breed} looking for the right home. Learn more about this cat and see whether you could be a good match.`}
            </p>

            {/* Basic Information */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#64748B]">
                  Age
                </p>
                <p className="mt-2 text-lg font-bold text-[#1E293B]">
                  {formatAge(cat.ageInMonths)}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#64748B]">
                  Gender
                </p>
                <p className="mt-2 text-lg font-bold text-[#1E293B]">
                  {cat.gender}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#64748B]">
                  Breed
                </p>
                <p className="mt-2 text-lg font-bold text-[#1E293B]">
                  {cat.breed}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAFC] p-5">
                <p className="text-sm font-medium text-[#64748B]">
                  Location
                </p>
                <p className="mt-2 text-lg font-bold text-[#1E293B]">
                  📍 {cat.location}
                </p>
              </div>
            </div>

            {/* Personality */}
            {cat.personality?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-extrabold text-[#1E293B]">
                  Personality
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.personality.map((trait) => (
                    <span
                      key={trait}
                      className="rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-4 py-2 text-sm font-semibold text-[#7C3AED]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Health Information */}
            <div className="mt-8">
              <h2 className="text-xl font-extrabold text-[#1E293B]">
                Health Information
              </h2>

              <div className="mt-4 space-y-3 text-[#475569]">
                {typeof cat.vaccinated === "boolean" && (
                  <p>
                    <span className="mr-2">
                      {cat.vaccinated ? "✓" : "○"}
                    </span>
                    Vaccinated: {cat.vaccinated ? "Yes" : "No"}
                  </p>
                )}

                {typeof cat.neutered === "boolean" && (
                  <p>
                    <span className="mr-2">
                      {cat.neutered ? "✓" : "○"}
                    </span>
                    Neutered: {cat.neutered ? "Yes" : "No"}
                  </p>
                )}

                {cat.specialNeeds && (
                  <p>
                    <span className="mr-2">ℹ</span>
                    Special needs: {cat.specialNeeds}
                  </p>
                )}

                {typeof cat.vaccinated !== "boolean" &&
                  typeof cat.neutered !== "boolean" &&
                  !cat.specialNeeds && (
                    <p className="text-sm leading-7 text-[#64748B]">
                      Health information has not been provided yet.
                      Please ask for further details before adoption.
                    </p>
                  )}
              </div>
            </div>

           
            {/* Adoption Action */}
            <div className="mt-10">
              <button
                type="button"
                disabled={!isAvailable}
                onClick={() => {
                  router.push(`/adopt/${cat._id}/apply`);
                }}
                className="w-full rounded-2xl bg-linear-to-r from-[#7C3AED] to-[#2196F3] px-7 py-4 font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.25)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isAvailable
                  ? "Adopt This Cat 🐾"
                  : "Currently Unavailable"}
              </button>

              <p className="mt-4 text-center text-sm leading-6 text-[#64748B]">
                Every cat deserves a loving and responsible forever home.
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
