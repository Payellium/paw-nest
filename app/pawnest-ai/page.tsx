
"use client";

import GlobalPawBackground from "@/components/GlobalPawBackground";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
};

type SavedConversation = {
    _id: string;
    title: string;
    messages: {
        role: "user" | "assistant";
        content: string;
    }[];
    createdAt: string;
    updatedAt: string;
};

const suggestions = [
    "Why isn't my cat eating?",
    "Why is my cat hiding?",
    "Why is my cat meowing?",
    "How can I reduce stress?",
];

export default function PawNestAIPage() {
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [apiError, setApiError] = useState("");

    const [conversations, setConversations] = useState<SavedConversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [loginRequired, setLoginRequired] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Automatically scroll to the latest message.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, isTyping]);

    // Load the logged-in user's saved conversations.
    useEffect(() => {
        const loadConversations = async () => {
            try {
                const response = await fetch("/api/pawnest-ai/conversations");
                const data = await response.json();

                if (response.status === 401) {
                    setLoginRequired(true);
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.error || "Unable to load chat history.");
                }

                const savedConversations: SavedConversation[] =
                    data.conversations || [];

                setConversations(savedConversations);

                // Restore the most recently updated conversation.
                if (savedConversations.length > 0) {
                    const latestConversation = savedConversations[0];

                    setCurrentConversationId(latestConversation._id);

                    setMessages(
                        latestConversation.messages.map((item, index) => ({
                            ...item,
                            id: Date.now() + index,
                        }))
                    );
                }
            } catch (error) {
                console.error("Unable to load PawNest AI history:", error);

                setApiError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load your chat history."
                );
            } finally {
                setHistoryLoading(false);
            }
        };

        loadConversations();
    }, []);

    // Start a fresh conversation.
    const handleNewChat = () => {
        if (isTyping) return;

        setMessages([]);
        setMessage("");
        setApiError("");
        setCurrentConversationId(null);
        setSidebarOpen(false);
    };


    const handleOpenConversation = (conversation: SavedConversation) => {
        if (isTyping) return;

        setCurrentConversationId(conversation._id);

        setMessages(
            conversation.messages.map((item, index) => ({
                ...item,
                id: Date.now() + index,
            }))
        );

        setMessage("");
        setApiError("");
        setSidebarOpen(false);
    };


    const handleDeleteConversation = async (conversationId: string) => {
        if (isTyping) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this conversation? This cannot be undone."
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `/api/pawnest-ai/conversations/${conversationId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to delete conversation.");
            }

            setConversations((previous) =>
                previous.filter((item) => item._id !== conversationId)
            );

            if (currentConversationId === conversationId) {
                setCurrentConversationId(null);
                setMessages([]);
            }

            setApiError("");
        } catch (error) {
            console.error("Delete conversation error:", error);

            setApiError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete conversation."
            );
        }
    };


    // Send a message to the real PawNest AI API.

    const handleSend = async (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

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
        setApiError("");
        setSidebarOpen(false);

        try {
            const response = await fetch("/api/pawnest-ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: trimmedMessage,
                    conversationId: currentConversationId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong. Please try again."
                );
            }

            if (!data.reply || typeof data.reply !== "string") {
                throw new Error("PawNest AI returned an empty response.");
            }

            const assistantMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.reply,
            };

            setMessages((previous) => [
                ...previous,
                assistantMessage,
            ]);

            // Remember the conversation created or returned by the API.
            setCurrentConversationId(data.conversationId);

            // Refresh the sidebar history.
            const historyResponse = await fetch(
                "/api/pawnest-ai/conversations"
            );

            if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                setConversations(historyData.conversations || []);
            }
        } catch (error) {
            console.error("PawNest AI request failed:", error);

            setApiError(
                error instanceof Error
                    ? error.message
                    : "Unable to connect to PawNest AI. Please try again."
            );

            // Remove the unsaved user message if the request failed.
            setMessages((previous) =>
                previous.filter((item) => item.id !== userMessage.id)
            );
        } finally {
            setIsTyping(false);
        }
    };


    // Reusable message input.
    const chatInput = (placeholder: string) => (
        <form
            onSubmit={handleSend}
            className="
                flex w-full items-center gap-2 sm:gap-3
                rounded-2xl sm:rounded-3xl
                border-2 border-slate-200
                bg-white
                px-3 py-2.5 sm:px-5 sm:py-3
                shadow-[0_8px_30px_rgba(15,23,42,0.08)]
                transition-all
                focus-within:border-sky-300
                focus-within:shadow-[0_10px_35px_rgba(56,189,248,0.15)]
            "
        >
            <span className="hidden text-xl sm:block">✨</span>

            <input
                type="text"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={placeholder}
                maxLength={4000}
                disabled={isTyping}
                aria-label="Ask PawNest AI a question"
                className="
                    min-w-0 flex-1
                    bg-transparent
                    px-1 py-3
                    text-base sm:text-lg md:text-xl
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    disabled:opacity-60
                "
            />

            <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="
                    flex h-11 w-11 sm:h-12 sm:w-12
                    shrink-0 items-center justify-center
                    rounded-xl sm:rounded-2xl
                    bg-linear-to-r from-sky-400 to-purple-400
                    text-xl text-white
                    shadow-sm transition
                    hover:scale-105 hover:shadow-md
                    disabled:cursor-not-allowed disabled:opacity-30
                "
                aria-label="Send message"
            >
                ↑
            </button>
        </form>
    );

    if (loginRequired) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-xl">
                    <div className="mb-5 text-5xl">🐾</div>

                    <h1 className="mb-3 text-3xl font-bold text-[#292044]">
                        Sign in to use PawNest AI
                    </h1>

                    <p className="mb-7 text-lg leading-relaxed text-slate-600">
                        Your conversations are saved privately to your account.
                        Please sign in to access your chat history and continue
                        talking with PawNest AI.
                    </p>

                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-xl bg-[#7C3AED] px-8 py-3 text-lg font-semibold text-white transition hover:bg-purple-700"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="relative flex h-dvh overflow-hidden bg-[#F8FAFC] text-slate-800">
            <GlobalPawBackground />

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
                    aria-label="Close sidebar"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-[min(19rem,85vw)] flex-col
                    border-r border-slate-200
                    bg-white/95 shadow-xl backdrop-blur-xl
                    transition-transform duration-300
                    lg:static lg:z-20 lg:w-72 lg:shrink-0
                    lg:translate-x-0 lg:shadow-none
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo */}
                <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-200 to-purple-200 text-2xl shadow-sm">
                            🐾
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                PawNest AI
                            </h1>
                            <p className="text-sm text-slate-400">
                                Cat Care Assistant
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-500 hover:bg-slate-100 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        ×
                    </button>
                </div>

                {/* New Chat */}
                <div className="p-4">
                    <button
                        onClick={handleNewChat}
                        disabled={isTyping}
                        className="
                            flex w-full items-center justify-center gap-2
                            rounded-2xl
                            bg-linear-to-r from-sky-400 to-purple-400
                            px-5 py-3.5
                            text-lg font-bold text-white
                            shadow-md shadow-sky-200/50
                            transition-all duration-200
                            hover:-translate-y-0.5
                            hover:from-sky-500 hover:to-purple-500
                            hover:shadow-lg
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <span className="text-2xl">＋</span>
                        New Chat
                    </button>
                </div>


                {/* Conversation History */}
                <div className="flex-1 overflow-y-auto px-4">
                    <div className="flex items-center justify-between px-2 py-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Chat History
                        </p>

                        {conversations.length > 0 && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                                {conversations.length}
                            </span>
                        )}
                    </div>

                    {historyLoading ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-slate-400">
                                Loading your conversations...
                            </p>
                        </div>
                    ) : conversations.length > 0 ? (
                        <div className="space-y-2 pb-4">
                            {conversations.map((conversation) => (
                                <div
                                    key={conversation._id}
                                    className={`group flex items-center gap-2 rounded-xl transition ${currentConversationId === conversation._id
                                        ? "bg-sky-50"
                                        : "hover:bg-slate-50"
                                        }`}
                                >
                                    <button
                                        onClick={() => handleOpenConversation(conversation)}
                                        className="flex min-w-0 flex-1 items-start gap-3 px-3 py-3 text-left"
                                    >
                                        <span className="mt-0.5 shrink-0">💬</span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block line-clamp-2 break-words text-sm font-semibold text-slate-700">
                                                {conversation.title}
                                            </span>

                                            <span className="mt-1 block text-xs text-slate-400">
                                                {new Date(
                                                    conversation.updatedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConversation(conversation._id)}
                                        disabled={isTyping}
                                        className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Delete conversation"
                                        title="Delete conversation"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center">
                            <span className="text-2xl">🐱</span>

                            <p className="mt-2 text-base font-medium text-slate-500">
                                No saved conversations yet
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Start chatting to build your history!
                            </p>
                        </div>
                    )}
                </div>


                {/* Sidebar footer */}
                <div className="border-t border-slate-100 p-5">
                    <div className="rounded-2xl bg-[#DFF4FF]/60 p-4">
                        <p className="text-base font-semibold text-sky-800">
                            🐾 A little reminder
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            PawNest AI offers general pet-care information,
                            not a replacement for veterinary advice.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main area */}
            <section className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col">
                {/* Header */}
                <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 bg-white/85 px-3 backdrop-blur-xl sm:px-5 md:px-7">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
                            aria-label="Open sidebar"
                        >
                            ☰
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                                <span className="truncate text-base font-semibold text-slate-600 sm:text-lg">
                                    PawNest AI Assistant
                                </span>
                            </div>
                            <p className="hidden pl-4 text-xs text-slate-400 sm:block">
                                Here to help your furry friend
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleNewChat}
                        disabled={isTyping}
                        className="
                            flex shrink-0 items-center gap-1.5
                            rounded-xl sm:rounded-2xl
                            bg-linear-to-r from-sky-400 to-purple-400
                            px-3 py-2.5 sm:px-5 sm:py-3
                            text-sm font-bold text-white sm:text-base
                            shadow-sm transition
                            hover:from-sky-500 hover:to-purple-500
                            disabled:cursor-not-allowed disabled:opacity-50
                        "
                    >
                        <span className="text-lg sm:text-xl">＋</span>
                        <span>New Chat</span>
                    </button>
                </header>

                {/* Chat content */}
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 sm:px-6 md:px-10">

                        {messages.length === 0 ? (
                            /* Welcome screen */
                            <div className="flex flex-1 flex-col items-center justify-center py-10 sm:py-12">
                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-[#DFF4FF] to-[#E9D8FD] text-4xl shadow-sm sm:mb-7 sm:h-20 sm:w-20">
                                    🐾
                                </div>

                                <h2 className="max-w-2xl text-center text-2xl font-bold tracking-tight text-sky-700 sm:text-3xl md:text-4xl">
                                    How can I help your cat?
                                </h2>

                                <p className="mt-3 max-w-xl text-center text-base leading-7 text-purple-600 sm:text-[16px] md:text-lg">
                                    Ask PawNest AI anything about your cat&apos;s
                                    health, behavior, or everyday care.
                                </p>

                                {/* Welcome input */}
                                <div className="mt-7 w-full max-w-3xl sm:mt-10">
                                    {chatInput("Ask PawNest AI about your cat...")}
                                </div>

                                {/* Suggestions */}
                                <div className="mt-7 flex w-full max-w-3xl flex-wrap justify-center gap-2.5 sm:mt-8">
                                    {suggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setMessage(suggestion)}
                                            className="
                                                rounded-full
                                                border border-slate-200
                                                bg-white/90
                                                px-3.5 py-2.5
                                                text-sm font-medium
                                                text-slate-700 shadow-sm
                                                transition
                                                hover:border-sky-200
                                                hover:bg-[#DFF4FF]
                                                hover:text-sky-700
                                                sm:px-4 sm:text-base
                                            "
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Conversation screen */
                            <div className="flex min-h-0 flex-1 flex-col">
                                <div className="flex-1 space-y-5 py-6 sm:space-y-7 sm:py-8">
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
                                                    max-w-[92%] break-words
                                                    rounded-2xl sm:rounded-3xl
                                                    px-4 py-3.5 sm:px-5 sm:py-4
                                                    text-base leading-7
                                                    sm:max-w-[85%] sm:text-lg
                                                    md:max-w-[78%]
                                                    ${item.role === "user"
                                                        ? "bg-linear-to-r from-sky-400 to-purple-400 text-white shadow-sm"
                                                        : "border border-slate-200 bg-white/95 text-slate-700 shadow-sm"
                                                    }
                                                `}
                                            >
                                                {item.role === "assistant" && (
                                                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-sky-600 sm:text-base">
                                                        <span>🐾</span>
                                                        PawNest AI
                                                    </div>
                                                )}

                                                <p className="whitespace-pre-wrap">
                                                    {item.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:rounded-3xl">
                                                <div className="mb-2 text-sm font-semibold text-sky-600">
                                                    PawNest AI is thinking...
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-400" />
                                                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-purple-400 [animation-delay:150ms]" />
                                                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-sky-300 [animation-delay:300ms]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Follow-up input */}
                                <div className="sticky bottom-0 mt-auto bg-[#F8FAFC]/90 py-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-md sm:py-5">
                                    {apiError && (
                                        <div
                                            role="alert"
                                            className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                                        >
                                            {apiError}
                                        </div>
                                    )}

                                    {chatInput("Ask another question...")}
                                </div>
                            </div>
                        )}

                        {/* Error message on welcome screen */}
                        {messages.length === 0 && apiError && (
                            <div
                                role="alert"
                                className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
                            >
                                {apiError}
                            </div>
                        )}

                        {/* Disclaimer */}
                        <div className="shrink-0 px-2 pb-4 pt-2 text-center sm:pb-5">
                            <p className="text-xs leading-5 text-slate-400 sm:text-sm">
                                PawNest AI provides general pet-care information
                                and is not a substitute for professional
                                veterinary advice.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
