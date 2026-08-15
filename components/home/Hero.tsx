import Link from 'next/link';
import React from 'react';
import { AiOutlineSafetyCertificate } from 'react-icons/ai';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FaArrowRight, FaPaw, FaShoppingBag } from 'react-icons/fa';
import { GrPowerCycle } from 'react-icons/gr';
import { MdOutlineWorkspacePremium } from 'react-icons/md';

const Hero = () => {
    return (
        <section className="relative min-h-[calc(100vh-110px)] overflow-hidden">

            <div className="relative z-10 mx-auto flex min-h-[calc(100vh-110px)] max-w-350 flex-col items-center justify-center px-6 py-16 text-center md:px-10 lg:px-16">

                {/* Top Badge */}
                <div className="mb-10 flex items-center gap-3 rounded-full border border-[#DDD6FE] bg-white px-5 py-3 shadow-[0_4px_15px_rgba(124,58,237,0.12)]">

                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E9D8FD]">
                        <span className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
                    </span>

                    <span className="text-base font-semibold text-[#7C3AED] sm:text-lg">
                        12,400+ pets found their forever homes
                    </span>

                </div>

                {/* Heading */}
                <h1 className="max-w-300 nunito-font text-[45px] font-extrabold leading-[1.05] tracking-[-1.5px] text-[#1E293B] sm:text-[54px] md:text-[60px] lg:text-[64px] xl:text-[78px]">

                    Find Your Perfect{" "}

                    <span className="bg-linear-to-r from-[#7C3AED] via-[#6D5DFB] to-[#2196F3] bg-clip-text text-transparent">
                        Companion
                    </span>

                    {" "} &

                    <br />

                    Everything They Need

                </h1>

                {/* Description */}
                <p className="mt-8 max-w-225 text-base font-medium leading-8 text-[#50607A] sm:text-lg md:text-[23px] md:leading-10">

                    Adopt a loving pet or shop premium supplies. PawNest connects
                    families with shelter animals and provides everything your new
                    companion needs to thrive.

                </p>

                {/* Buttons */}
                <div className="mt-12 flex w-full flex-col items-center justify-center gap-5 sm:flex-row">

                    {/* Adopt Button */}
                    <Link
                        href="/adopt"
                        className="group flex h-25 w-full max-w-85.75 items-center justify-center gap-4 rounded-[25px] bg-linear-to-r from-[#7C20FF] to-[#914DFF] text-xl font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.20)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(124,58,237,0.28)]"
                    >
                        <FaPaw className="text-lg" />

                        <span>Adopt Now</span>

                        <FaArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    {/* Shop Button */}
                    <Link
                        href="/shop"
                        className="flex h-25 w-full max-w-88.25 items-center justify-center gap-4 rounded-[25px] border-[3px] border-[#DDD6FE] bg-white text-xl font-bold text-[#6519D8] transition-all duration-300 hover:-translate-y-1 hover:border-[#C4B5FD] hover:shadow-[0_10px_25px_rgba(124,58,237,0.10)]"
                    >
                        <FaShoppingBag className="text-[#2196F3]" />

                        <span>Shop Products</span>
                    </Link>

                </div>
                <div className='flex gap-5 mt-10'>
                    <div className=' text-gray-700 flex items-center gap-2 p-3 rounded-4xl shadow-2xl bg-white border border-gray-300'>
                        <AiOutlineSafetyCertificate />
                        <p>Safe Adoption</p>
                    </div>
                    <div className=' text-gray-700 flex items-center gap-2 p-3 rounded-4xl shadow-2xl bg-white border border-gray-300'>
                        <CiDeliveryTruck />
                        <p>Free Shipping</p>
                    </div>
                    <div className=' text-gray-700 flex items-center gap-2 p-3 rounded-4xl shadow-2xl bg-white border border-gray-300'>
                        <GrPowerCycle />
                        <p>30-Day Returns</p>
                    </div>
                    <div className=' text-gray-700 flex items-center gap-2 p-3 rounded-4xl shadow-2xl bg-white border border-gray-300'>
                        <MdOutlineWorkspacePremium />
                        <p>Premium Quality</p>
                    </div>
                </div>

            </div>

        </section>
    );
};

export default Hero;