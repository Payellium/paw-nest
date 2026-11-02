
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  FaArrowRight,
  FaChevronDown,
  FaFilter,
  FaHeart,
  FaSearch,
  FaShoppingBag,
  FaStar,
  FaTimes,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import type { ProductCategory } from "@/types/product";
import GlobalPawBackground from "@/components/GlobalPawBackground";

type CategoryFilter = "All" | ProductCategory;
type SortOption = "featured" | "price-low" | "price-high" | "rating" | "name";

const categories: CategoryFilter[] = [
  "All",
  "Food",
  "Toys",
  "Beds",
  "Grooming",
  "Accessories",
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured products" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name: A to Z" },
];

const formatPrice = (price: number) =>
  `৳${price.toLocaleString("en-BD")}`;

export default function ShopPage() {
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const categoryCounts = useMemo(() => {
    return categories.reduce((counts, category) => {
      counts[category] =
        category === "All"
          ? products.length
          : products.filter((product) => product.category === category).length;

      return counts;
    }, {} as Record<CategoryFilter, number>);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter(
        (product) => product.category === activeCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: (typeof products)[number]) => {
    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: formatPrice(product.price),
      image: product.image,
    });

    setAddedProductId(product.id);

    window.setTimeout(() => {
      setAddedProductId((current) =>
        current === product.id ? null : current
      );
    }, 1500);
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setSortBy("featured");
  };

  const categoryFilters = (
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => {
            setActiveCategory(category);
            setShowMobileFilters(false);
          }}
          className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-[17px] font-bold transition-all duration-200 ${
            activeCategory === category
              ? "bg-[#F0E9FF] text-[#7C3AED]"
              : "text-[#526078] hover:bg-[#F8F5FF] hover:text-[#7C3AED]"
          }`}
        >
          <span>{category}</span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-extrabold ${
              activeCategory === category
                ? "bg-white text-[#7C3AED]"
                : "bg-[#F1F5F9] text-[#718096]"
            }`}
          >
            {categoryCounts[category]}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC]">
      <GlobalPawBackground />
      <div className="relative z-10">
        {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F1EAFE] via-[#EAF5FF] to-[#E5F8F0] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 2xl:px-16">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#D8C5FF]/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-[#BDEBFF]/50 blur-3xl" />

        <div className="relative w-full">
          <div className="max-w-[900px]">
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[4px] text-[#7C3AED] sm:text-base">
              THE PAWNEST COLLECTION
            </p>

            <h1 className="nunito-font text-[40px] font-extrabold leading-tight tracking-tight text-[#1E293B] sm:text-[52px] lg:text-[62px]">
              Everything Your Cat{" "}
              <span className="text-[#7C3AED]">Deserves</span>
            </h1>

            <p className="mt-5 max-w-[760px] text-[18px] font-medium leading-8 text-[#64748B] sm:text-[21px] sm:leading-9">
              Discover carefully selected food, toys, cozy beds, and everyday
              essentials to keep your feline companion happy and healthy.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-[16px] font-bold text-[#526078] sm:text-[17px]">
              <span className="rounded-full border border-white/80 bg-white/70 px-5 py-3">
                🐾 Cat-friendly essentials
              </span>
              <span className="rounded-full border border-white/80 bg-white/70 px-5 py-3">
                💜 Selected with care
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP CONTENT */}
      <section className="w-full px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16 2xl:px-14">
        <div className="w-full">
          {/* SECTION HEADING */}
          <div className="mb-9">
            <p className="text-sm font-extrabold uppercase tracking-[3px] text-[#8B5CF6] sm:text-base">
              FIND THEIR FAVORITES
            </p>
            <h2 className="nunito-font mt-2 text-[32px] font-extrabold text-[#1E293B] sm:text-[38px]">
              Explore Our Shop
            </h2>
          </div>

          {/* SEARCH AND FILTER CONTROLS */}
          <div className="mb-9 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[600px]">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-[#94A3B8]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search food, toys, beds..."
                className="h-[60px] w-full rounded-2xl border border-[#E2E8F0] bg-white pl-14 pr-5 text-[17px] font-medium text-[#334155] outline-none transition focus:border-[#A78BFA] focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setShowMobileFilters((current) => !current)
                }
                className="flex h-[56px] items-center justify-center gap-3 rounded-2xl border border-[#DDD6FE] bg-white px-6 text-[17px] font-extrabold text-[#7C3AED] transition hover:bg-[#F5F3FF] lg:hidden"
                aria-expanded={showMobileFilters}
              >
                <FaFilter />
                Filters
                <FaChevronDown
                  className={`text-sm transition-transform ${
                    showMobileFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div className="flex h-[56px] items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-4">
                <label
                  htmlFor="shop-sort"
                  className="whitespace-nowrap text-[15px] font-bold text-[#64748B] sm:text-[16px]"
                >
                  Sort by
                </label>
                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="min-w-0 flex-1 bg-transparent text-[16px] font-bold text-[#334155] outline-none sm:min-w-[190px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* MOBILE FILTER PANEL */}
          <div
            className={`mb-8 overflow-hidden rounded-2xl border border-[#E9DFFF] bg-white transition-all duration-300 lg:hidden ${
              showMobileFilters
                ? "max-h-[600px] p-5 opacity-100"
                : "max-h-0 border-transparent p-0 opacity-0"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[20px] font-extrabold text-[#1E293B]">
                Categories
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F3FF] text-[#7C3AED]"
              >
                <FaTimes />
              </button>
            </div>
            {categoryFilters}
          </div>

          {/* SIDEBAR + PRODUCTS */}
          <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[350px_minmax(0,1fr)] 2xl:gap-10">
            {/* DESKTOP SIDEBAR */}
            <aside className="sticky top-28 hidden rounded-[24px] border border-[#E9E2F8] bg-white p-6 shadow-[0_5px_20px_rgba(30,41,59,0.04)] lg:block">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[22px] font-extrabold text-[#1E293B]">
                  Categories
                </h3>
                <FaFilter className="text-lg text-[#8B5CF6]" />
              </div>

              <div className="mb-6 h-px bg-[#F1ECF9]" />

              {categoryFilters}

              <div className="mt-7 rounded-2xl bg-gradient-to-br from-[#F1EAFE] to-[#EAF5FF] p-5">
                <p className="text-[19px] font-extrabold text-[#5B35A5]">
                  Made for little paws
                </p>
                <p className="mt-2 text-[15px] font-medium leading-6 text-[#64748B]">
                  Find something special for your feline friend.
                </p>
                <span className="mt-3 block text-3xl">🐱</span>
              </div>
            </aside>

            {/* PRODUCT AREA */}
            <div className="min-w-0 w-full">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[17px] font-semibold text-[#64748B]">
                  Showing{" "}
                  <span className="font-extrabold text-[#1E293B]">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>

                {(activeCategory !== "All" ||
                  searchQuery ||
                  sortBy !== "featured") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-[16px] font-extrabold text-[#7C3AED] transition hover:text-[#5B21B6]"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 2xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group flex min-w-0 h-full flex-col overflow-hidden rounded-[26px] border border-[#EDF0F5] bg-white shadow-[0_5px_18px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_35px_rgba(15,23,42,0.11)]"
                    >
                      {/* PRODUCT IMAGE */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1F5F9]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1536px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {product.badge && (
                          <span
                            className={`absolute left-4 top-4 z-10 rounded-full px-4 py-2 text-sm font-extrabold shadow-sm ${
                              product.badge === "Sale"
                                ? "bg-[#FFE4EF] text-[#DB2777]"
                                : product.badge === "New"
                                  ? "bg-[#DCFCE7] text-[#16A34A]"
                                  : "bg-[#FFF1C7] text-[#B45309]"
                            }`}
                          >
                            {product.badge}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={
                            wishlist.includes(product.id)
                              ? `Remove ${product.name} from wishlist`
                              : `Add ${product.name} to wishlist`
                          }
                          className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 ${
                            wishlist.includes(product.id)
                              ? "text-[#EF4444]"
                              : "text-[#94A3B8] hover:text-[#EF4444]"
                          }`}
                        >
                          <FaHeart className="text-[18px]" />
                        </button>
                      </div>

                      {/* PRODUCT DETAILS */}
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <p className="text-sm font-extrabold uppercase tracking-wide text-[#8B5CF6]">
                          {product.category}
                        </p>

                        <h3 className="mt-2 min-h-[56px] text-[20px] font-extrabold leading-7 text-[#1E293B]">
                          {product.name}
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-[48px] text-[16px] font-medium leading-6 text-[#718096]">
                          {product.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <FaStar className="text-[#F59E0B]" />
                          <span className="text-[16px] font-extrabold text-[#334155]">
                            {product.rating}
                          </span>
                          <span className="text-[14px] font-medium text-[#94A3B8]">
                            ({product.reviews} reviews)
                          </span>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <span className="text-[24px] font-extrabold text-[#7C3AED]">
                            {formatPrice(product.price)}
                          </span>

                          {product.oldPrice && (
                            <span className="text-[16px] font-semibold text-[#94A3B8] line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto pt-5">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className={`flex h-[54px] w-full items-center justify-center gap-3 rounded-[15px] text-[16px] font-extrabold text-white shadow-[0_8px_18px_rgba(124,58,237,0.16)] transition-all duration-300 ${
                              addedProductId === product.id
                                ? "bg-gradient-to-r from-[#16A34A] to-[#22C55E]"
                                : "bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(124,58,237,0.25)]"
                            }`}
                          >
                            {addedProductId === product.id ? (
                              <>
                                <span className="text-xl">✓</span>
                                Added to Cart!
                              </>
                            ) : (
                              <>
                                <FaShoppingBag />
                                Add to Cart
                                <FaArrowRight className="text-sm" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#D8C8F5] bg-white px-6 text-center">
                  <span className="text-6xl">🐱</span>
                  <h3 className="mt-5 text-[25px] font-extrabold text-[#1E293B]">
                    No products found
                  </h3>
                  <p className="mt-2 max-w-[430px] text-[17px] leading-7 text-[#64748B]">
                    We couldn&apos;t find products matching your search. Try
                    another keyword or category.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-gradient-to-r from-[#8B4DFF] to-[#09A9ED] px-7 py-3.5 text-[16px] font-extrabold text-white transition hover:-translate-y-1"
                  >
                    Show All Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
