
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CatListing {
  _id: string;
  name: string;
  breed: string;
  ageInMonths: number;
  gender: string;
  location: string;
  image: string;
  reviewStatus: "Pending" | "Approved" | "Rejected";
  adoptionStatus: "Available" | "Pending" | "Adopted";
  createdAt: string;
}

export default function MyRehomingPage() {
  const [listings, setListings] = useState<CatListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/my-rehoming");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load your listings.");
        }

        setListings(data.listings || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading your listings."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const formatAge = (months: number) => {
    if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return remainingMonths
      ? `${years} yr ${remainingMonths} mo`
      : `${years} ${years === 1 ? "year" : "years"}`;
  };

  const getStatusStyle = (status: CatListing["reviewStatus"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-bold uppercase tracking-wider text-[#7C3AED]">
            Your Listings
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#292044] sm:text-4xl lg:text-[40px]">
            My Rehoming
          </h1>

          <p className="mt-3 text-lg leading-8 text-gray-600">
            Manage your cat listings and keep track of their review status.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-2xl border border-purple-100 bg-white p-10 text-center">
          <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
          <p className="mt-4 text-lg text-gray-600">
            Loading your listings...
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-lg font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && listings.length === 0 && (
        <div className="rounded-2xl border border-purple-100 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E9D8FD] text-4xl">
            🐾
          </div>

          <h2 className="mt-6 text-2xl font-bold text-[#292044] sm:text-3xl">
            No Rehoming Listings Yet
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-gray-600">
            You haven&apos;t submitted any cats for rehoming yet. Your submitted
            listings will appear here.
          </p>
        </div>
      )}

      {/* Listings */}
      {!loading && !error && listings.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#292044] sm:text-2xl">
              Your Listings ({listings.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {listings.map((cat) => (
              <article
                key={cat._id}
                className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-64 w-full shrink-0 bg-[#F8FAFC] sm:h-auto sm:w-52">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 208px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-48 items-center justify-center text-5xl">
                        🐱
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-bold text-[#292044]">
                          {cat.name}
                        </h3>

                        <p className="mt-1 text-lg text-gray-600">
                          {cat.breed}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-base font-bold ${getStatusStyle(
                          cat.reviewStatus
                        )}`}
                      >
                        {cat.reviewStatus}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-base">
                      <p className="text-gray-600">
                        <span className="font-semibold text-[#292044]">
                          Age:
                        </span>{" "}
                        {formatAge(cat.ageInMonths)}
                      </p>

                      <p className="text-gray-600">
                        <span className="font-semibold text-[#292044]">
                          Gender:
                        </span>{" "}
                        {cat.gender}
                      </p>

                      <p className="col-span-2 text-gray-600">
                        <span className="font-semibold text-[#292044]">
                          Location:
                        </span>{" "}
                        {cat.location}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-purple-100 pt-4">
                      <p className="text-base text-gray-500">
                        Submitted on{" "}
                        {new Date(cat.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      {cat.reviewStatus === "Pending" && (
                        <p className="mt-3 text-base leading-7 text-amber-700">
                          Your listing is waiting for admin review.
                        </p>
                      )}

                      {cat.reviewStatus === "Approved" && (
                        <p className="mt-3 text-base leading-7 text-green-700">
                          Your listing has been approved.
                        </p>
                      )}

                      {cat.reviewStatus === "Rejected" && (
                        <p className="mt-3 text-base leading-7 text-red-700">
                          Your listing was not approved.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
