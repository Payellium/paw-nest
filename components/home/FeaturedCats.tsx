"use client";

import { useState } from "react";
import Image from "next/image";
import { FaHeart, FaMapMarkerAlt, FaPaw } from "react-icons/fa";

type Cat = {
  id: number;
  name: string;
  breed: string;
  gender: "Male" | "Female";
  age: string;
  location: string;
  image: string;
};

const cats: Cat[] = [
  {
    id: 1,
    name: "Milo",
    breed: "Persian",
    gender: "Male",
    age: "2 yrs",
    location: "Austin, TX",
    image: "/cats/persian.jpg",
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siamese",
    gender: "Female",
    age: "1 yr",
    location: "Portland, OR",
    image: "/cats/siamese.jpg",
  },
  {
    id: 3,
    name: "Oliver",
    breed: "Maine Coon",
    gender: "Male",
    age: "3 yrs",
    location: "Denver, CO",
    image: "/cats/maine-coon.jpg",
  },
  {
    id: 4,
    name: "Mia",
    breed: "Ragdoll",
    gender: "Female",
    age: "4 yrs",
    location: "Seattle, WA",
    image: "/cats/ragdoll.jpg",
  },
  {
    id: 5,
    name: "Leo",
    breed: "British Shorthair",
    gender: "Male",
    age: "2 yrs",
    location: "Chicago, IL",
    image: "/cats/british-shorthair.jpg",
  },
  {
    id: 6,
    name: "Nala",
    breed: "Bengal",
    gender: "Female",
    age: "1 yr",
    location: "Miami, FL",
    image: "/cats/bengal.jpg",
  },
  {
    id: 7,
    name: "Simba",
    breed: "Scottish Fold",
    gender: "Male",
    age: "3 yrs",
    location: "Boston, MA",
    image: "/cats/scottish-fold.jpg",
  },
  {
    id: 8,
    name: "Cleo",
    breed: "American Shorthair",
    gender: "Female",
    age: "2 yrs",
    location: "Dallas, TX",
    image: "/cats/american-shorthair.jpg",
  },
];

const breeds = [
  "All",
  "Persian",
  "Siamese",
  "Maine Coon",
  "Ragdoll",
  "Bengal",
];

export default function FeaturedPets() {
  const [activeBreed, setActiveBreed] = useState("All");

  const filteredCats =
    activeBreed === "All"
      ? cats
      : cats.filter((cat) => cat.breed === activeBreed);

  return (
    <section className="bg-[#F5F8FC] px-5 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1810px]">

        {/* ================= HEADER ================= */}

        <div className="text-center">

          <p className="text-sm font-extrabold uppercase tracking-[4px] text-[#0795D5]">
            READY TO ADOPT
          </p>

          <h2 className="mt-3 text-[36px] font-extrabold tracking-[-1.5px] text-[#1E293B] sm:text-[48px]">
            Featured <span className="text-purple-500">Cats</span>
          </h2>

          <p className="mx-auto mt-4 max-w-[760px] text-[18px] leading-8 text-[#637A9B] sm:text-[21px]">
            Every cat deserves a loving home. Browse our featured cats and
            find your new best friend today.
          </p>

        </div>

        {/* ================= BREED FILTER ================= */}

        <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">

          {breeds.map((breed) => {
            const isActive = activeBreed === breed;

            return (
              <button
                key={breed}
                onClick={() => setActiveBreed(breed)}
                className={`
                  rounded-full px-7 py-3.5
                  text-[16px] font-extrabold
                  transition-all duration-300
                  sm:px-8 sm:text-[18px]

                  ${
                    isActive
                      ? "bg-[#7C20FF] text-white shadow-[0_10px_25px_rgba(124,32,255,0.25)]"
                      : "border border-[#E4E8F5] bg-white text-[#485A75] hover:-translate-y-1 hover:border-[#CDBBFF] hover:text-[#7C20FF] hover:shadow-md"
                  }
                `}
              >
                {breed}
              </button>
            );
          })}

        </div>

        {/* ================= CARDS ================= */}

        <div className="mt-16 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {filteredCats.map((cat) => (
            <article
              key={cat.id}
              className="
                group
                overflow-hidden
                rounded-[25px]
                bg-white
                shadow-[0_5px_15px_rgba(15,23,42,0.12)]
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-[0_20px_35px_rgba(15,23,42,0.18)]
              "
            >

              {/* ================= IMAGE ================= */}

              <div className="relative h-[325px] overflow-hidden">

                <Image
                  src={cat.image}
                  alt={`${cat.name} - ${cat.breed}`}
                  fill
                  sizes="(max-width: 640px) 100vw,
                         (max-width: 1024px) 50vw,
                         25vw"
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                />

                {/* subtle image overlay */}

                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />

                {/* ================= HEART ================= */}

                <button
                  aria-label={`Favorite ${cat.name}`}
                  className="
                    absolute
                    right-5
                    top-5
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-white/95
                    text-[#8AA0BC]
                    shadow-md
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:text-[#EC4899]
                  "
                >
                  <FaHeart className="text-[20px]" />
                </button>

                {/* ================= BADGES ================= */}

                <div className="absolute bottom-5 left-5 flex items-center gap-2">

                  {/* Gender */}

                  <span
                    className={`
                      rounded-full
                      px-4
                      py-1.5
                      text-[14px]
                      font-extrabold

                      ${
                        cat.gender === "Female"
                          ? "bg-[#FCE7F3] text-[#DB2777]"
                          : "bg-[#E0F2FE] text-[#0284C7]"
                      }
                    `}
                  >
                    {cat.gender}
                  </span>

                  {/* Breed */}

                  <span className="
                    rounded-full
                    bg-white
                    px-4
                    py-1.5
                    text-[14px]
                    font-extrabold
                    text-[#40516B]
                  ">
                    {cat.breed}
                  </span>

                </div>

              </div>

              {/* ================= CONTENT ================= */}

              <div className="px-6 pb-6 pt-5">

                {/* NAME + AGE */}

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h3 className="
                      text-[27px]
                      font-extrabold
                      leading-tight
                      text-[#26354D]
                    ">
                      {cat.name}
                    </h3>

                    <p className="
                      mt-1
                      text-[19px]
                      font-medium
                      text-[#7085A2]
                    ">
                      {cat.breed}
                    </p>

                  </div>

                  {/* AGE */}

                  <span className="
                    mt-1
                    shrink-0
                    rounded-full
                    bg-[#F3EEFF]
                    px-4
                    py-1.5
                    text-[17px]
                    font-extrabold
                    text-[#7C20FF]
                  ">
                    {cat.age}
                  </span>

                </div>

                {/* ================= LOCATION ================= */}

                <div className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-[17px]
                  font-medium
                  text-[#8AA0BC]
                ">
                  <FaMapMarkerAlt className="text-[15px]" />

                  <span>{cat.location}</span>
                </div>

                {/* ================= ADOPT BUTTON ================= */}

                <button className="
                  mt-4
                  flex
                  h-18
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-[18px]
                  bg-linear-to-r
                  from-[#8B4DFF]
                  to-[#08A7E8]
                  text-[18px]
                  font-extrabold
                  text-white
                  shadow-[0_7px_18px_rgba(99,102,241,0.20)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_12px_25px_rgba(99,102,241,0.30)]
                ">
                  <span>Adopt {cat.name}</span>

                  <FaPaw className="text-[13px]" />
                </button>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}