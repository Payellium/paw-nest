import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaPaw } from 'react-icons/fa';

const CatCategories = () => {
    const categories = [
        {
            name: "Kittens",
            available: "24 available",
            image: "/images/categories/kitten1.jpg",
            icon: "🐱",
        },
        {
            name: "Young Cats",
            available: "35 available",
            image: "/images/categories/young-cat1.jpg",
            icon: "🐈",
        },
        {
            name: "Adult Cats",
            available: "42 available",
            image: "/images/categories/adult-cat1.jpg",
            icon: "😺",
        },
        {
            name: "Senior Cats",
            available: "18 available",
            image: "/images/categories/senior-cats.webp",
            icon: "🐾",
        },
        {
            name: "Special Needs",
            available: "12 available",
            image: "/images/categories/handicapped-pets-3.jpg",
            icon: "💜",
        },
    ];
    return (
        <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-8">

            {/* Heading */}
            <div className="mx-auto max-w-225 text-center">

                <p className="mb-4 text-sm font-bold uppercase tracking-[4px] text-[#7C3AED] sm:text-base">
                    Find Your Match
                </p>

                <h2 className="text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-4xl lg:text-[48px]">
                    Browse by Category
                </h2>

                <p className="mx-auto mt-4 max-w-190 text-base leading-7 text-[#607492] sm:text-lg sm:leading-9">
                    Thousands of cats are looking for a loving home.
                    Explore by type to find your perfect companion.
                </p>

            </div>

            {/* Categories */}
            <div className="mx-auto mt-10 grid max-w-[1810px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                {categories.map((category) => (
                    <Link
                        href={`/adopt?category=${encodeURIComponent(category.name)}`}
                        key={category.name}
                        className="group relative h-70 overflow-hidden rounded-[30px] shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(124,58,237,0.18)]"
                    >

                        {/* Image */}
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Category icon */}
                        <div className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur-md">
                            {category.icon}
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-6 left-0 right-0 text-center text-white">

                            <h3 className="text-2xl font-extrabold drop-shadow-md">
                                {category.name}
                            </h3>

                            <p className="mt-1 text-base font-semibold text-white/90">
                                {category.available}
                            </p>

                        </div>

                    </Link>
                ))}

            </div>

            {/* View all */}
            <div className="mt-12 flex justify-center">
                <Link
                    href="/adopt"
                    className="group flex items-center gap-3 rounded-full bg-linear-to-r from-[#7C3AED] to-[#2196F3] px-7 py-3.5 text-base font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(124,58,237,0.3)]"
                >
                    <FaPaw />

                    View All Cats

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                    </span>
                </Link>
            </div>

        </section>
    );
};

export default CatCategories;