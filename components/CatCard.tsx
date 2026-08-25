import React from "react";
import { FaHeart, FaMapMarkerAlt, FaPaw } from "react-icons/fa";

interface Cat {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: "Male" | "Female";
  location: string;
  image: string;
  personality: string[];
  adoptionStatus: "Available" | "Pending" | "Adopted";
}

interface CatCardProps {
  cat: Cat;
}

const CatCard = ({ cat }: CatCardProps) => {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(124,58,237,0.15)]">

      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={cat.image}
          alt={cat.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Adoption Status */}
        <span className="absolute left-4 top-4 rounded-full bg-[#D8F3DC] px-4 py-2 text-sm font-bold text-[#166534]">
          {cat.adoptionStatus}
        </span>

        {/* Favorite */}
        <button
          aria-label={`Add ${cat.name} to favorites`}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#94A3B8] shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:text-[#EF4444]"
        >
          <FaHeart />
        </button>
      </div>

      {/* Information */}
      <div className="p-6">

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-extrabold text-[#1E293B]">
              {cat.name}
            </h3>

            <p className="mt-1 text-base font-medium text-[#64748B]">
              {cat.breed}
            </p>
          </div>

          <FaPaw className="mt-1 text-xl text-[#8B5CF6]" />
        </div>

        {/* Basic information */}
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#F1F5F9] px-3 py-2 text-sm font-medium text-[#475569]">
            {cat.age}
          </span>

          <span className="rounded-full bg-[#E9D8FD] px-3 py-2 text-sm font-medium text-[#6D28D9]">
            {cat.gender}
          </span>
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#64748B]">
          <FaMapMarkerAlt className="text-[#2196F3]" />
          <span>{cat.location}</span>
        </div>

        {/* Personality */}
        <div className="mt-5 flex flex-wrap gap-2">
          {cat.personality.map((trait) => (
            <span
              key={trait}
              className="rounded-full bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#64748B]"
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Details Button */}
        <button
          className="mt-6 w-full rounded-2xl bg-linear-to-r from-[#7C20FF] to-[#914DFF] py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.25)]"
        >
          View Details →
        </button>

      </div>
    </article>
  );
};

export default CatCard;