"use client";

import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaArrowRight, FaPaw, FaShoppingBag } from "react-icons/fa";
import { GrPowerCycle } from "react-icons/gr";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-110px)] overflow-hidden">
      <div className="absolute bottom-0 right-0 z-0 h-120 w-120 pointer-events-none animate-cat-float">
        <Image
          src="/images/cats/hero-cat.png"
          alt=""
          fill
          priority
          className="object-contain object-bottom-right"
        />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-110px)] max-w-350 flex-col items-center justify-center px-6 py-16 text-center md:px-10 lg:px-16">

        {/* =========================
            TOP BADGE
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -35,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-10 flex items-center gap-3 rounded-full border border-[#DDD6FE] bg-white px-5 py-3 shadow-[0_4px_15px_rgba(124,58,237,0.12)]"
        >
          <motion.span
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E9D8FD]"
          >
            <span className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
          </motion.span>

          <span className="text-base font-semibold text-[#7C3AED] sm:text-lg">
            12,400+ pets found their forever homes
          </span>
        </motion.div>


        {/* =========================
            HEADING
        ========================= */}

        <motion.h1
          initial={{
            opacity: 0,
            x: -120,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-300 nunito-font text-[45px]  font-extrabold leading-[1.05] tracking-[-1.5px] text-[#1E293B] sm:text-[54px] md:text-[60px] lg:text-[64px] xl:text-[78px]"
        >
          Find Your Perfect{" "}

          <motion.span
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: "easeOut",
            }}
            className="inline-block bg-linear-to-r from-[#7C3AED] via-[#6D5DFB] to-[#2196F3] bg-clip-text text-transparent"
          >
            Companion
          </motion.span>

          {" "} &

          <br />

          Everything They Need
        </motion.h1>


        {/* =========================
            DESCRIPTION
        ========================= */}

        <motion.p
          initial={{
            opacity: 0,
            x: -80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.55,
            ease: "easeOut",
          }}
          className="mt-8 max-w-225 text-base font-medium leading-8 text-[#50607A] sm:text-lg md:text-[23px] md:leading-10"
        >
          Adopt a loving pet or shop premium supplies. PawNest connects
          families with shelter animals and provides everything your new
          companion needs to thrive.
        </motion.p>


        {/* =========================
            BUTTONS
        ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: 120,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 flex w-full flex-col items-center justify-center gap-5 sm:flex-row"
        >

          {/* Adopt Button */}

          <Link
            href="/adopt"
            className="group flex h-25 w-full max-w-85.75 items-center justify-center gap-4 rounded-[25px] bg-linear-to-r from-[#7C20FF] to-[#914DFF] text-2xl font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.20)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_18px_40px_rgba(124,58,237,0.30)]"
          >
            <motion.span
              whileHover={{
                rotate: -12,
                scale: 1.15,
              }}
            >
              <FaPaw className="text-lg" />
            </motion.span>

            <span className="font-extrabold">Adopt Now</span>

            <FaArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-2" />
          </Link>


          {/* Shop Button */}

          <Link
            href="/shop"
            className="group flex h-25 w-full max-w-88.25 items-center justify-center gap-4 rounded-[25px] border-[3px] border-[#DDD6FE] bg-white text-2xl font-extrabold text-[#6519D8] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:border-[#C4B5FD] hover:shadow-[0_15px_35px_rgba(124,58,237,0.14)]"
          >
            <motion.span
              whileHover={{
                rotate: -8,
                scale: 1.12,
              }}
            >
              <FaShoppingBag className="text-[#2196F3]" />
            </motion.span>

            <span>Shop Products</span>
          </Link>

        </motion.div>


        {/* =========================
            FEATURE PILLS
        ========================= */}

        <div className="mt-10 flex flex-wrap  justify-center gap-3 sm:gap-5">

          {/* Safe Adoption */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1,
            }}
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            className="flex items-center gap-2 rounded-4xl border border-gray-300 bg-white p-3 text-gray-700 shadow-2xl"
          >
            <AiOutlineSafetyCertificate />

            <p>Safe Adoption</p>
          </motion.div>


          {/* Free Shipping */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.15,
            }}
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            className="flex items-center gap-2 rounded-4xl border border-gray-300 bg-white p-3 text-gray-700 shadow-2xl"
          >
            <CiDeliveryTruck />

            <p>Free Shipping</p>
          </motion.div>


          {/* 30 Day Returns */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.3,
            }}
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            className="flex items-center gap-2 rounded-4xl border border-gray-300 bg-white p-3 text-gray-700 shadow-2xl"
          >
            <GrPowerCycle />

            <p>30-Day Returns</p>
          </motion.div>


          {/* Premium Quality */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.45,
            }}
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            className="flex items-center gap-2 rounded-4xl border border-gray-300 bg-white p-3 text-gray-700 shadow-2xl"
          >
            <MdOutlineWorkspacePremium />

            <p>Premium Quality</p>
          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default Hero;