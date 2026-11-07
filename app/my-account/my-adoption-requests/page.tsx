
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Cat {
  _id: string;
  name: string;
  breed: string;
  ageInMonths: number;
  gender: string;
  location: string;
  image: string;
}

interface AdoptionRequest {
  _id: string;
  catId: Cat | null;
  applicantName: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export default function MyAdoptionRequestsPage() {
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/adoption-requests");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load your adoption requests."
          );
        }

        setRequests(data.requests);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getAge = (ageInMonths: number) => {
    if (ageInMonths < 12) {
      return `${ageInMonths} months old`;
    }

    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    return months > 0
      ? `${years} years ${months} months old`
      : `${years} years old`;
  };

  const getStatusStyle = (status: AdoptionRequest["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-20">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-2 font-semibold text-[#7C3AED]">
            YOUR PAWNEST ACCOUNT
          </p>

          <h1 className="text-3xl font-bold text-[#292044] sm:text-4xl">
            My Adoption Requests
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Keep track of your cat adoption applications and stay updated on
            their progress.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && requests.length === 0 && (
          <div className="rounded-2xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-5 text-5xl">🐱</div>

            <h2 className="text-2xl font-bold text-[#292044]">
              No adoption requests yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You haven&apost applied to adopt a cat yet. Explore our available
              cats and find your new companion!
            </p>

            <Link
              href="/adopt"
              className="btn mt-7 rounded-full border-0 bg-[#7C3AED] px-7 text-white hover:bg-[#6929D4]"
            >
              Explore Cats
            </Link>
          </div>
        )}

        {/* Adoption request cards */}
        {requests.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#292044]">
                Your Applications
              </h2>

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-[#7C3AED]">
                {requests.length}{" "}
                {requests.length === 1 ? "Application" : "Applications"}
              </span>
            </div>

            <div className="space-y-6">
              {requests.map((request) => (
                <article
                  key={request._id}
                  className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[220px_1fr]">
                    {/* Cat image */}
                    <div className="relative h-56 overflow-hidden rounded-xl bg-purple-50 md:h-full md:min-h-[200px]">
                      {request.catId?.image ? (
                        <Image
                          src={request.catId.image}
                          alt={request.catId.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 220px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          🐱
                        </div>
                      )}
                    </div>

                    {/* Request information */}
                    <div className="flex flex-col justify-between gap-5">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>

                          <span className="text-sm text-gray-400">
                            Applied on{" "}
                            {new Date(request.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-[#292044]">
                          {request.catId?.name || "Cat information unavailable"}
                        </h3>

                        {request.catId && (
                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                            <span>{request.catId.breed}</span>
                            <span>{getAge(request.catId.ageInMonths)}</span>
                            <span>{request.catId.gender}</span>
                            <span>{request.catId.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl bg-[#F8FAFC] p-4">
                        <p className="text-sm font-semibold text-[#292044]">
                          {request.status === "Pending"
                            ? "Your application is under review."
                            : request.status === "Approved"
                              ? "Your adoption application has been approved!"
                              : "Your adoption application was not approved."}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Application ID: {request._id}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
