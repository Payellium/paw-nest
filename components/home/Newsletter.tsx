"use client";

import { useState } from "react";
import type { SubmitEventHandler } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!email) return;

    console.log("Subscribed:", email);

    setEmail("");
  };


  return (
    <section className="relative z-10 px-6 py-20 sm:px-8 lg:py-24">

      <div className="mx-auto flex max-w-300 flex-col items-center text-center">

        {/* Mailbox Icon */}
        <div className="flex h-25.5 w-25.5 items-center justify-center rounded-3xl bg-[#F7F5FF] shadow-[0_4px_10px_rgba(15,23,42,0.08)]">
          <span className="text-[48px]">
            📬
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-10 text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl">
          Stay in the Loop
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-262.5 text-base font-medium leading-8 text-[#647894] sm:text-lg md:text-[25px] md:leading-[1.65]">
          Get new pet listings, exclusive deals on supplies, and heartwarming
          adoption stories
          <br className="hidden md:block" />
          delivered to your inbox every week.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-14 flex w-full max-w-175 flex-col gap-4 sm:flex-row sm:items-center"
        >
          {/* Email */}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="h-22 flex-1 rounded-3xl border-[3px] border-[#E9E3FF] bg-[#FCFBFF] px-8 text-lg font-medium text-[#1E293B] outline-none transition-all duration-300 placeholder:text-[#91A4C2] focus:border-[#A78BFA] focus:bg-white focus:shadow-[0_5px_20px_rgba(124,58,237,0.08)] sm:text-[24px]"
          />

          {/* Subscribe Button */}
          <button
            type="submit"
            className="h-22 rounded-3xl bg-linear-to-r from-[#7C2CF5] via-[#665CF5] to-[#00AEEF] px-10 text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(99,60,240,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(99,60,240,0.25)] active:translate-y-0 sm:min-w-51.75 sm:text-[24px]"
          >
            Subscribe
          </button>
        </form>

        {/* Disclaimer */}
        <p className="mt-7 text-sm font-medium text-[#91A4C2] sm:text-[18px]">
          No spam, ever. Unsubscribe anytime with one click.
        </p>

      </div>

    </section>
  );
}