"use client";

import GlobalPawBackground from "@/components/GlobalPawBackground";
import { useState } from "react";

type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
};

const suggestions = [
    "Why isn't my cat eating?",
    "Why is my cat hiding?",
    "Why is my cat meowing?",
    "How can I reduce stress?",
];

const recentChats = [
    "Cat eating problem",
    "Why is my cat hiding?",
    "Kitten behavior",
];

export default function PawNestAIPage() {
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || isTyping) return;

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: trimmedMessage,
        };

        setMessages((previous) => [...previous, userMessage]);
        setMessage("");
        setIsTyping(true);

        setTimeout(() => {
            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content:
                    "I'm here to help with your cat's health and behavior. Tell me a little more about what you're noticing.",
            };

            setMessages((previous) => [...previous, assistantMessage]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <main className="relative flex h-screen overflow-hidden text-slate-800">
            <GlobalPawBackground></GlobalPawBackground>
            {/* =========================
          MOBILE OVERLAY
      ========================== */}
            {sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
                    aria-label="Close menu"
                />
            )}

            {/* =========================
          SIDEBAR
      ========================== */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40
          flex w-70 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}
                <div className="flex h-18 items-center border-b border-slate-100 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-sky-300 to-purple-300 text-xl shadow-sm">
                            🐾
                        </div>
                        <div>


                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">
                                PawNest AI
                            </h1>

                            <p className="text-xs text-slate-400">
                                Cat Care Assistant
                            </p>
                        </div>
                    </div>
                </div>

                {/* New Chat */}
                <div>
                    <button
                        onClick={() => setMessage("")}
                        className="
                        flex w-full items-center justify-center gap-1
                        rounded-2xl
                        bg-linear-to-r from-sky-400 to-purple-400
                        px-5 py-4
                        text-lg font-bold
                         text-white
                        shadow-md shadow-sky-200/50
                        transition-all duration-200
                        hover:-translate-y-0.5
                     hover:from-sky-500
                     hover:to-purple-500
                         hover:shadow-lg hover:shadow-purple-200/50
                        active:translate-y-0">


                        <span className="text-2xl">+</span>
                        New Chat
                    </button>
                </div>

                {/* Recent Chats */}
                <div className="flex-1 overflow-y-auto px-4">
                    <p className="px-2 py-3 font-semibold uppercase tracking-wider text-slate-400">
                        Recent chats
                    </p>

                    <div className="space-y-1">
                        {recentChats.map((chat) => (
                            <button
                                key={chat}
                                className="
                  flex w-full items-center gap-3
                  rounded-xl
                  px-3 py-3
                  text-left
                  
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  hover:text-slate-800
                "
                            >
                                <span className=" text-slate-400">💬</span>

                                <span className="truncate">{chat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="border-t border-slate-100 p-4">
                    <p className="text-center text-xs leading-5 text-slate-400">
                        General pet-care information only.
                    </p>
                </div>
            </aside>

            {/* =========================
          MAIN AREA
      ========================== */}
            <section className="flex min-w-0 flex-1 flex-col">

                {/* Top Bar */}
                <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 md:px-7">

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              text-xl
              text-slate-600
              transition
              hover:bg-slate-100
              lg:hidden
            "
                        aria-label="Open menu"
                    >
                        ☰
                    </button>

                    {/* Desktop Status */}
                    <div className="hidden items-center gap-2 lg:flex">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                        <span className=" font-medium text-slate-500">
                            PawNest AI
                        </span>
                    </div>

                    {/* New Chat */}
                    <button
                        onClick={() => setMessage("")}
                        className="
                        flex items-center justify-center gap-1
                        rounded-2xl
                        bg-linear-to-r from-sky-400 to-purple-400
                        px-5 py-4
                        text-lg font-bold
                         text-white
                        shadow-md shadow-sky-200/50
                        transition-all duration-200
                        hover:-translate-y-0.5
                         hover:from-sky-500
                         hover:to-purple-500
                        hover:shadow-lg hover:shadow-purple-200/50
                        active:translate-y-0">


                        <span className="text-2xl">＋</span>
                        New Chat
                    </button>
                </header>

                {/* =========================
            EMPTY CHAT AREA
        ========================== */}
                <div className="flex flex-1 overflow-y-auto">
                    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 md:px-10">

                        {messages.length === 0 ? (
                            /* =========================
                               WELCOME / EMPTY STATE
                            ========================== */
                            <div className="flex flex-1 flex-col items-center justify-center pb-10">

                                {/* PawNest Icon */}
                                <div className="
                    mb-6
                    flex h-20 w-20
                    items-center justify-center
                    rounded-3xl
                    bg-linear-to-br
                    from-[#DFF4FF]
                    to-[#E9D8FD]
                    text-4xl
                    shadow-sm
                ">
                                    🐾
                                </div>

                                {/* Main Heading */}
                                <h2 className="
                    text-center
                    text-4xl
                    font-bold
                    tracking-tight
                    text-sky-700
                    md:text-5xl
                ">
                                    How can I help your cat?
                                </h2>

                                {/* Subtitle */}
                                <p className="
                    mt-3
                    text-center
                    text-lg
                    font-medium
                    text-purple-600
                    md:text-xl
                ">
                                    Ask PawNest AI anything about your cat.
                                </p>

                                {/* Main Chat Input */}
                                <div className="mt-9 w-full max-w-3xl">

                                    <div className="
                        flex items-center gap-3
                        rounded-3xl
                        border-2
                        border-slate-200
                        bg-white
                        px-5
                        py-3
                        shadow-[0_8px_30px_rgba(15,23,42,0.08)]
                        transition-all
                        focus-within:border-sky-300
                        focus-within:shadow-[0_10px_35px_rgba(56,189,248,0.15)]
                    ">

                                        <span className="hidden text-xl sm:block">
                                            ✨
                                        </span>

                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Ask PawNest AI about your cat..."
                                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                px-1
                                py-3
                                text-xl
                                text-slate-700
                                outline-none
                                placeholder:text-slate-400
                                md:text-2xl
                            "
                                        />

                                        <button
                                            onClick={handleSend}
                                            disabled={!message.trim() || isTyping}
                                            className="
                                flex h-12 w-12
                                shrink-0
                                items-center justify-center
                                rounded-2xl
                                bg-linear-to-r
                                from-sky-400
                                to-purple-400
                                text-xl
                                text-white
                                shadow-sm
                                transition
                                hover:scale-105
                                hover:shadow-md
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                            "
                                            aria-label="Send message"
                                        >
                                            ↑
                                        </button>
                                    </div>
                                </div>

                                {/* Suggestions */}
                                <div className="
                    mt-8
                    flex w-full max-w-3xl
                    flex-wrap
                    justify-center
                    gap-2.5
                ">
                                    {suggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setMessage(suggestion)}
                                            className="
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-base
                                font-medium
                                text-slate-700
                                shadow-sm
                                transition
                                hover:border-sky-200
                                hover:bg-[#DFF4FF]
                                hover:text-sky-700
                            "
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        ) : (

                            /* =========================
                               CHAT / CONVERSATION STATE
                            ========================== */
                            <div className="flex flex-1 flex-col">

                                {/* Messages */}
                                <div className="flex-1 space-y-6 overflow-y-auto py-8">

                                    {messages.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex ${item.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`
                                    max-w-[85%]
                                    rounded-3xl
                                    px-5
                                    py-4
                                    text-base
                                    leading-7
                                    md:max-w-[75%]
                                    md:text-lg
                                    ${item.role === "user"
                                                        ? "bg-linear-to-r from-sky-400 to-purple-400 text-white"
                                                        : "border border-slate-200 bg-white text-slate-700 shadow-sm"
                                                    }
                                `}
                                            >
                                                {item.role === "assistant" && (
                                                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-sky-600">
                                                        <span>🐾</span>
                                                        PawNest AI
                                                    </div>
                                                )}

                                                {item.content}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                py-4
                                shadow-sm
                            ">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="
                                        h-2.5 w-2.5
                                        animate-bounce
                                        rounded-full
                                        bg-sky-400
                                    " />

                                                    <span className="
                                        h-2.5 w-2.5
                                        animate-bounce
                                        rounded-full
                                        bg-purple-400
                                        [animation-delay:150ms]
                                    " />

                                                    <span className="
                                        h-2.5 w-2.5
                                        animate-bounce
                                        rounded-full
                                        bg-sky-300
                                        [animation-delay:300ms]
                                    " />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Chat Input */}
                                <div className="sticky bottom-0 bg-transparent py-5">

                                    <div className="
                        flex items-center gap-3
                        rounded-3xl
                        border-2
                        border-slate-200
                        bg-white
                        px-5
                        py-3
                        shadow-[0_8px_30px_rgba(15,23,42,0.08)]
                        focus-within:border-sky-300
                    ">

                                        <span className="hidden text-xl sm:block">
                                            ✨
                                        </span>

                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Ask another question..."
                                            className="
                                min-w-0
                                flex-1
                                bg-transparent
                                px-1
                                py-3
                                text-lg
                                text-slate-700
                                outline-none
                                placeholder:text-slate-400
                                md:text-xl
                            "
                                        />

                                        <button
                                            onClick={handleSend}
                                            disabled={!message.trim() || isTyping}
                                            className="
                                flex h-12 w-12
                                shrink-0
                                items-center justify-center
                                rounded-2xl
                                bg-linear-to-r
                                from-sky-400
                                to-purple-400
                                text-xl
                                text-white
                                shadow-sm
                                transition
                                hover:scale-105
                                hover:shadow-md
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                            "
                                            aria-label="Send message"
                                        >
                                            ↑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="pb-5 text-center">
                            <p className="text-xs text-slate-400 md:text-sm">
                                PawNest AI provides general pet-care information and is not a
                                substitute for professional veterinary advice.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}