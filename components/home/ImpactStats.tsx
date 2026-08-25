"use client";

import { useEffect, useRef, useState } from "react";
import { FaPaw } from "react-icons/fa";

const stats = [
  {
    number: 120,
    label: "Pets Adopted",
    icon: "🐾",
    suffix: "+",
  },
  {
    number: 98,
    label: "Happy Families",
    icon: "🏠",
    suffix: "+",
  },
  {
    number: 450,
    label: "Products Sold",
    icon: "🛍️",
    suffix: "+",
  },
  {
    number: 12,
    label: "Partner Shelters",
    icon: "🤝",
    suffix: "",
  },
];

export default function ImpactStats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCounts(
        stats.map((stat) =>
          Math.floor(stat.number * easedProgress)
        )
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Make sure final values are exact
        setCounts(stats.map((stat) => stat.number));
      }
    };

    requestAnimationFrame(animate);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-hidden bg-linear-to-r from-[#7637EE] via-[#4869E8] to-[#08A7E8] px-6 py-20 sm:px-10 lg:px-12"
    >
      {/* Background Decorations */}

      <FaPaw className="absolute left-[10%] top-[42%] rotate-12 text-[75px] text-white/10" />

      <FaPaw className="absolute bottom-[10%] right-[9%] -rotate-12 text-[65px] text-white/10" />

      <div className="absolute left-[3%] top-[20%] h-31.25 w-31.25 rounded-full bg-white/10" />

      <div className="absolute left-[10%] top-[7%] h-22.5 w-22.5 rounded-full bg-white/10" />

      <div className="absolute left-[17%] top-[20%] h-28.75 w-28.75 rounded-full bg-white/10" />

      <div className="absolute right-[38%] top-[30%] h-30 w-30 rounded-full bg-white/10" />

      <div className="absolute bottom-[12%] right-[43%] h-42.5 w-42.5 rounded-full bg-white/10" />

      <div className="absolute bottom-[7%] right-[4%] h-27.5 w-27.5 rounded-full bg-white/10" />

      <div className="absolute right-[1%] top-[58%] h-18.75 w-18.75 rounded-full bg-white/10" />

      {/* Content */}

      <div className="relative mx-auto max-w-[1810px]">

        {/* Heading */}

        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[54px]">
            Our Impact in Numbers
          </h2>

          <p className="mt-5 text-base font-medium text-white/65 sm:text-lg lg:text-[25px]">
            Every number represents a life changed by love and care.
          </p>
        </div>

        {/* Statistics */}

        <div className="mt-20 grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}

              <div className="mb-4 text-[48px] transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
              </div>

              {/* Animated Number */}

              <h3 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-[72px]">
                {counts[index].toLocaleString()}
                {stat.suffix}
              </h3>

              {/* Label */}

              <p className="mt-3 text-lg font-bold text-white/70 sm:text-xl">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}