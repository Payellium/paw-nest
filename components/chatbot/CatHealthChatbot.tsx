"use client";

import { useState } from "react";

export default function CatHealthChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-130 w-[calc(100%-2rem)] max-w-95 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:right-6">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-linear-to-r from-sky-400 to-purple-400 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
                🐾
              </div>

              <div>
                <h2 className="font-semibold">PawNest AI</h2>
                <p className="text-xs text-white/80">
                  Cat Health & Behavior Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-xl transition hover:bg-white/20"
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
            
            {/* AI Message */}
            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
                🐾
              </div>

              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-700">
                  Hi! 🐱 I am PawNest AI. I can help you with general cat
                  health, behavior, nutrition, and care questions.
                </p>
              </div>
            </div>

            {/* Example User Message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-sky-400 px-4 py-3 text-white">
                <p className="text-sm">
                  Why is my cat meowing so much?
                </p>
              </div>
            </div>

            {/* Example AI Response */}
            <div className="flex items-start gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100">
                🐾
              </div>

              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                <p className="text-sm text-slate-700">
                  Cats may meow more because of hunger, attention-seeking,
                  stress, boredom, or discomfort. If the behavior is sudden
                  or accompanied by other concerning symptoms, consider
                  contacting a veterinarian.
                </p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about your cat..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <button
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400 text-white transition hover:bg-sky-500"
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-400">
              General information only • Not a veterinary diagnosis
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-400 to-purple-400 text-2xl text-white shadow-lg transition hover:scale-105 hover:shadow-xl sm:right-6"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? "×" : "🐾"}
      </button>
    </>
  );
}