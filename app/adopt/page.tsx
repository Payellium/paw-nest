
"use client";

import React, { useEffect, useState } from "react";
import CatCard from "@/components/CatCard";
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
};

const AdoptPage = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchCats = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const response = await fetch("/api/cats", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load cats.");
        }

        if (!Array.isArray(data.cats)) {
          throw new Error("The server returned an unexpected cat list.");
        }

        if (!cancelled) {
          setCats(data.cats);
        }
      } catch (error) {
        if (!cancelled) {
          setFetchError(
            error instanceof Error
              ? error.message
              : "Unable to load cats. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCats();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasActiveFilters =
    search !== "" ||
    breed !== "" ||
    ageGroup !== "" ||
    gender !== "" ||
    location !== "";

  const clearFilters = () => {
    setSearch("");
    setBreed("");
    setAgeGroup("");
    setGender("");
    setLocation("");
  };

  const filteredCats = cats.filter((cat) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm) ||
      cat.breed.toLowerCase().includes(searchTerm);

    const matchesBreed = breed === "" || cat.breed === breed;

    const ageInMonths = Number(cat.ageInMonths) || 0;

    const matchesGender = gender === "" || cat.gender === gender;

    const matchesLocation = location === "" || cat.location === location;

    const matchesAge =
      ageGroup === "" ||
      (ageGroup === "Kitten" && ageInMonths <= 12) ||
      (ageGroup === "Young" && ageInMonths > 12 && ageInMonths <= 36) ||
      (ageGroup === "Adult" && ageInMonths > 36 && ageInMonths <= 84) ||
      (ageGroup === "Senior" && ageInMonths > 84);

    return (
      matchesSearch &&
      matchesBreed &&
      matchesAge &&
      matchesGender &&
      matchesLocation
    );
  });

  return (
    <main className="min-h-screen px-6 py-20">
      <GlobalPawBackground />

      {/* Hero */}
      <section className="mx-auto max-w-7xl text-center">
        <span className="inline-block rounded-full px-5 py-2 text-sm font-bold text-[#7C3AED]">
          🐾 Give a Cat a Forever Home
        </span>

        <h1 className="mt-6 text-5xl font-extrabold text-[#1E293B] md:text-6xl">
          Meet Your Future{" "}
          <span className="bg-linear-to-r from-[#7C3AED] to-[#2196F3] bg-clip-text text-transparent">
            Best Friend
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#64748B]">
          Browse our loving cats looking for their forever homes. Find a
          companion whose personality, needs, and lifestyle are the right match
          for you.
        </p>
      </section>

      {/* Search & Filters */}
      <section className="mx-auto mt-14 max-w-7xl rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Search cats by name or breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 w-full rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 text-[#1E293B] outline-none transition-all duration-300 placeholder:text-[#94A3B8] focus:border-[#C4B5FD] focus:bg-white focus:ring-4 focus:ring-[#E9D8FD]/50"
          />

          <select
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none"
          >
            <option value="">All Breeds</option>
            <option value="Persian">Persian</option>
            <option value="Siamese">Siamese</option>
            <option value="Bengal">Bengal</option>
            <option value="Domestic Shorthair">Domestic Shorthair</option>
          </select>

          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
            className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none"
          >
            <option value="">All Ages</option>
            <option value="Kitten">Kitten</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
          </select>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-14 w-full rounded-2xl border border-gray-200 px-5 outline-none md:flex-1"
          >
            <option value="">All Locations</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Mymensingh">Mymensingh</option>
          </select>
        </div>
      </section>

      {/* Available Cats */}
      <section className="mx-auto mt-14 max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1E293B]">
              Cats Available for Adoption
            </h2>

            <p className="mt-2 text-[#64748B]">
              {loading
                ? "Finding your furry friends..."
                : fetchError
                  ? "Unable to retrieve cats"
                  : `${filteredCats.length} ${
                      filteredCats.length === 1 ? "cat" : "cats"
                    } found`}
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-fit rounded-xl border border-[#DDD6FE] px-5 py-2.5 text-sm font-bold text-[#7C3AED] transition-all duration-300 hover:bg-[#F5F3FF]"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Cat cards and loading/error/empty states */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <span className="loading loading-spinner loading-lg text-[#7C3AED]" />
              <p className="mt-5 text-lg font-semibold text-[#64748B]">
                Finding your furry friends...
              </p>
            </div>
          ) : fetchError ? (
            <div
              className="col-span-full rounded-3xl bg-white px-6 py-12 text-center shadow-sm"
              role="alert"
            >
              <div className="text-4xl">🐾</div>
              <h3 className="mt-4 text-2xl font-extrabold text-[#1E293B]">
                We couldn&apos;t load the cats
              </h3>
              <p className="mt-3 text-[#64748B]">{fetchError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-2xl bg-linear-to-r from-[#7C20FF] to-[#914DFF] px-7 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1"
              >
                Try Again
              </button>
            </div>
          ) : filteredCats.length > 0 ? (
            filteredCats.map((cat) => <CatCard key={cat._id} cat={cat} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E9D8FD]">
                <span className="text-4xl">🐾</span>
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-[#1E293B]">
                No furry friends found
              </h3>

              <p className="mt-3 max-w-md text-base leading-7 text-[#64748B]">
                We could not find any cats matching your current search and
                filters. Try changing your selection and see if your new
                companion is waiting!
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-7 rounded-2xl bg-linear-to-r from-[#7C20FF] to-[#914DFF] px-7 py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.25)]"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdoptPage;
