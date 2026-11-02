
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const navigation = [
    { label: "Overview", href: "/admin", icon: "▦" },
    { label: "Listing Reviews", href: "/admin/reviews", icon: "✓" },
    { label: "Adoption Requests", href: "/admin/adoption-requests", icon: "💌" },
    { label: "All Cats", href: "/admin/cats", icon: "🐱" },
    { label: "Users", href: "/admin/users", icon: "♙" },
    { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) =>
        href === "/admin"
            ? pathname === "/admin"
            : pathname === href || pathname.startsWith(`${href}/`);

    const currentPage =
        navigation.find((item) => isActive(item.href))?.label ?? "Admin";

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
            <div className="flex min-h-screen">
                {/* Desktop sidebar */}
                <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-[#292044] text-white lg:flex xl:w-90">
                    <div className="border-b border-white/10 px-6 py-7">
                        <Link href="/admin" className="flex items-center gap-3">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-3xl">
                                🐾
                            </span>

                            <span>
                                <span className="block text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
                                    PawNest
                                </span>
                                <span className="mt-1 block text-sm font-bold uppercase tracking-wider text-violet-200">
                                    Admin Panel
                                </span>
                            </span>
                        </Link>
                    </div>

                    <nav
                        aria-label="Main admin navigation"
                        className="flex-1 overflow-y-auto px-4 py-7"
                    >
                        <p className="mb-5 px-3 text-sm font-bold uppercase tracking-wider text-violet-300">
                            Workspace
                        </p>

                        <div className="space-y-3">
                            {navigation.map((item) => {
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={`flex min-h-14 items-center gap-4 rounded-xl px-4 py-3 text-base font-semibold transition-colors duration-200 ${
                                            active
                                                ? "bg-violet-600 text-white shadow-lg shadow-black/10"
                                                : "text-violet-100 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                                            {item.icon}
                                        </span>

                                        <span className="text-xl">{item.label}</span>

                                        {active && (
                                            <span className="ml-auto h-2.5 w-2.5 rounded-full bg-white" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="border-t border-white/10 p-5">
                        <Link
                            href="/"
                            className="flex min-h-14 items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-violet-100 transition hover:bg-white/10 hover:text-white"
                        >
                            <span className="text-2xl">←</span>
                            Back to PawNest
                        </Link>

                        <div className="mt-4 rounded-xl bg-white/5 p-4">
                            <p className="text-base font-semibold text-white">
                                Every cat deserves a home.
                            </p>
                            <p className="mt-2 text-sm leading-6 text-violet-200">
                                Thank you for caring for our feline friends. 💜
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main content area */}
                <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                    {/* Responsive header */}
                    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
                        <div className="flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                            <div className="flex min-w-0 items-center gap-3">
                                {/* Mobile hamburger */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenuOpen((open) => !open)
                                    }
                                    aria-label={
                                        mobileMenuOpen
                                            ? "Close admin menu"
                                            : "Open admin menu"
                                    }
                                    aria-expanded={mobileMenuOpen}
                                    aria-controls="mobile-admin-navigation"
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-3xl text-[#292044] transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 lg:hidden"
                                >
                                    {mobileMenuOpen ? "×" : "☰"}
                                </button>

                                {/* Mobile brand */}
                                <Link
                                    href="/admin"
                                    className="flex min-w-0 items-center gap-2 lg:hidden"
                                >
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-2xl">
                                        🐾
                                    </span>

                                    <span className="truncate text-xl font-extrabold text-[#292044] sm:text-2xl">
                                        PawNest
                                    </span>
                                </Link>

                                {/* Desktop page title */}
                                <div className="hidden min-w-0 lg:block">
                                    <p className="text-sm font-bold uppercase tracking-wider text-violet-600">
                                        PawNest / Administration
                                    </p>
                                    <h1 className="mt-1 truncate text-xl font-bold text-slate-900 xl:text-2xl">
                                        {currentPage}
                                    </h1>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                                <Link
                                    href="/"
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 text-base font-semibold text-violet-700 transition hover:bg-violet-100 sm:px-5"
                                >
                                    <span aria-hidden="true">↗</span>
                                    <span className="hidden sm:inline">
                                        Visit website
                                    </span>
                                    <span className="sm:hidden">Website</span>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile page title */}
                        <div className="border-t border-slate-100 px-5 py-3 sm:px-6 lg:hidden">
                            <p className="text-sm font-semibold text-violet-600">
                                PawNest Administration
                            </p>
                            <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                                {currentPage}
                            </h1>
                        </div>

                        {/* Mobile navigation menu */}
                        {mobileMenuOpen && (
                            <nav
                                id="mobile-admin-navigation"
                                aria-label="Mobile admin navigation"
                                className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg sm:px-6 lg:hidden"
                            >
                                <p className="mb-3 px-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                                    Admin Menu
                                </p>

                                <div className="space-y-2">
                                    {navigation.map((item) => {
                                        const active = isActive(item.href);

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={closeMobileMenu}
                                                aria-current={
                                                    active ? "page" : undefined
                                                }
                                                className={`flex min-h-14 items-center gap-4 rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                                                    active
                                                        ? "bg-violet-100 text-violet-800"
                                                        : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center text-2xl">
                                                    {item.icon}
                                                </span>

                                                <span>{item.label}</span>

                                                {active && (
                                                    <span className="ml-auto text-xl">
                                                        ✓
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}

                                    <Link
                                        href="/"
                                        onClick={closeMobileMenu}
                                        className="flex min-h-14 items-center gap-4 rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-violet-50"
                                    >
                                        <span className="flex h-9 w-9 items-center justify-center text-2xl">
                                            ↗
                                        </span>
                                        Back to PawNest website
                                    </Link>
                                </div>
                            </nav>
                        )}
                    </header>

                    {/* Page content */}
                    <main className="min-w-0 flex-1 px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10 xl:px-10">
                        <div className="mx-auto w-full max-w-[1600px]">
                            {children}
                        </div>
                    </main>

                    {/* Shared footer */}
                    <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center sm:px-6 sm:py-6">
                        <p className="text-sm leading-6 text-slate-600 sm:text-base">
                            © {new Date().getFullYear()} PawNest Admin Panel.
                            {" "}Made with 💜 for cats.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
