"use client";

import Link from "next/link";
import { useState } from "react";

const questions = [
  {
    icon: "🩺",
    title: "Health",
    description: "Understand common health concerns",
  },
  {
    icon: "🐾",
    title: "Behavior",
    description: "Understand your cat's behavior",
  },
  {
    icon: "🍽️",
    title: "Nutrition",
    description: "Get everyday feeding guidance",
  },
  {
    icon: "❤️",
    title: "Care",
    description: "Learn better ways to care",
  },
];

const suggestedQuestions = [
  "Why isn't my cat eating?",
  "Why is my cat hiding?",
  "How can I reduce stress?",
];

export default function PawNestAISection() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="relative overflow-hidden  px-6 py-20 md:py-28">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />

      <div className="pointer-events-none absolute left-[8%] top-16 text-6xl opacity-[0.08]">
        🐾
      </div>

      <div className="pointer-events-none absolute bottom-20 right-[8%] rotate-12 text-7xl opacity-[0.08]">
        🐾
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* =========================
            SECTION INTRO
        ========================== */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xl font-semibold text-sky-600 shadow-sm backdrop-blur">
            <span>✨</span>
            <span>Meet PawNest AI</span>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-800 md:text-5xl lg:text-6xl">
            A smarter way to{" "}
            <span className="bg-linear-to-r from-sky-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              care for your cat
            </span>
            
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Have questions about your cats health, behavior, nutrition, or
            everyday care? PawNest AI gives you helpful general information
            whenever you need it.
          </p>
        </div>

        {/* =========================
            MAIN FEATURE CARD
        ========================== */}
        <div className="grid overflow-hidden rounded-4xl border border-white/80 bg-white/70 shadow-[0_25px_80px_rgba(56,189,248,0.12)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
          {/* =========================
              LEFT SIDE
          ========================== */}
          <div className="relative overflow-hidden bg-linear-to-br from-sky-100 via-sky-50 to-purple-100 p-8 md:p-10 lg:p-12">
            {/* Decorative circle */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/30" />

            <div className="relative">
              {/* AI icon */}
              <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white text-4xl shadow-lg">
                🐱
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                Your cat-care companion
              </p>

              <h3 className="mt-4 text-3xl font-bold leading-tight text-slate-800 md:text-4xl">
                Questions about your cat?
                <br />
                <span className="text-sky-500">Just ask.</span>
              </h3>

              <p className="mt-5 max-w-md leading-7 text-slate-600">
                From unusual behaviors to everyday care questions, PawNest AI
                helps you better understand your furry friend.
              </p>

              {/* Features */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {questions.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/70 bg-white/60 p-4 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="text-2xl">{item.icon}</div>

                    <h4 className="mt-2 font-semibold text-slate-700">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/pawnest-ai"
                className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-sky-400 to-purple-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-sky-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span>Chat with PawNest AI</span>
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>

          {/* =========================
              RIGHT SIDE — CHAT PREVIEW
          ========================== */}
          <div className="relative flex items-center bg-white p-5 md:p-8 lg:p-10">
            <div className="w-full overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-50 shadow-xl">
              {/* Chat header */}
              <div className="flex items-center justify-between bg-linear-to-r from-sky-400 to-purple-400 px-5 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-xl">
                    🐾
                  </div>

                  <div>
                    <h4 className="font-bold">PawNest AI</h4>

                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80">
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      Ready to help
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                  AI Assistant
                </span>
              </div>

              {/* Chat content */}
              <div className="space-y-5 p-5 md:p-6">
                {/* AI message */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100">
                    🐾
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm leading-6 text-slate-600">
                      Hi! 🐱 I am PawNest AI.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      What would you like to know about your cat?
                    </p>
                  </div>
                </div>

                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-linear-to-r from-sky-400 to-sky-500 px-4 py-3 text-sm leading-6 text-white shadow-sm">
                    My cat has been hiding more than usual. What could be
                    causing this?
                  </div>
                </div>

                {/* AI response */}
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                    🐾
                  </div>

                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                    <p className="text-sm leading-6 text-slate-600">
                      Hiding more than usual can sometimes be related to
                      stress, environmental changes, fear, or discomfort.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      If this is sudden or happens with other concerning
                      symptoms, consider contacting a veterinarian.
                    </p>
                  </div>
                </div>

                {/* Suggested questions */}
                <div className="pt-2">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Try asking
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => setIsChatOpen(true)}
                        className="rounded-full border border-sky-100 bg-white px-3 py-2 text-xs font-medium text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fake input */}
              <div className="border-t border-slate-100 bg-white p-4">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                  <span className="flex-1 text-sm text-slate-400">
                    Ask something about your cat...
                  </span>

                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-purple-400 text-white transition hover:scale-105"
                    aria-label="Open PawNest AI"
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            DISCLAIMER
        ========================== */}
        <div className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center">
          <span className="mt-0.5 text-sm">💡</span>

          <p className="text-xs leading-5 text-slate-400">
            PawNest AI provides general pet-care information and is not a
            replacement for professional veterinary advice.
          </p>
        </div>
      </div>

      {/* =========================
          TEMPORARY NOTICE
      ========================== */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-5 z-60 max-w-xs rounded-2xl bg-slate-800 px-5 py-4 text-white shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="text-xl">🐾</span>

            <div>
              <p className="font-semibold">PawNest AI is ready!</p>

              <p className="mt-1 text-xs leading-5 text-slate-300">
                We will connect this section to your actual AI chatbot next.
              </p>

              <button
                onClick={() => setIsChatOpen(false)}
                className="mt-3 text-xs font-semibold text-sky-300 transition hover:text-sky-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}