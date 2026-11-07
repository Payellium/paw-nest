
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const menuItems = [
    {
        label: "Overview",
        href: "/my-account",
        icon: "⌂",
    },
    {
        label: "My Adoption Requests",
        href: "/my-account/my-adoption-requests",
        icon: "♡",
    },
    {
        label: "My Rehoming",
        href: "/my-account/my-rehoming",
        icon: "🐾",
    },
    {
        label: "My Cart",
        href: "/my-account/cart",
        icon: "🛒",
    },
    {
        label: "My Wishlist",
        href: "/my-account/my-wishlist",
        icon: "♥",
    },
    {
        label: "Settings",
        href: "/my-account/settings",
        icon: "⚙",
    },
];

export default function AccountSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <aside className="w-full rounded-2xl border border-purple-100 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:w-72 lg:shrink-0 lg:self-start lg:p-5">

            {/* Mobile Menu Toggle */}
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                aria-controls="account-sidebar-navigation"
                className="flex w-full items-center justify-between rounded-xl bg-[#E9D8FD] px-5 py-4 text-left transition-colors hover:bg-[#DDC7F8] lg:hidden"
            >
                <div>
                    <h2 className="text-xl font-bold text-[#292044]">
                        My Account
                    </h2>
                    <p className="mt-1 text-base text-gray-600">
                        Manage your PawNest activity
                    </p>
                </div>

                <span className="text-2xl font-bold text-[#7C3AED]">
                    {isOpen ? "−" : "+"}
                </span>
            </button>

            {/* Desktop Sidebar Heading */}
            <div className="mb-6 hidden border-b border-purple-100 px-3 pb-5 lg:block">
                <h2 className="text-2xl font-bold text-[#292044]">
                    My Account
                </h2>
                <p className="mt-2 text-base text-gray-600">
                    Manage your PawNest activity
                </p>
            </div>

            {/* Navigation */}
            <nav
                id="account-sidebar-navigation"
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out lg:mt-0 lg:grid-rows-[1fr] lg:opacity-100 ${
                    isOpen
                        ? "mt-4 grid-rows-[1fr] opacity-100"
                        : "mt-0 grid-rows-[0fr] opacity-0 lg:mt-0"
                }`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive =
                                item.href === "/my-account"
                                    ? pathname === item.href
                                    : pathname === item.href ||
                                      pathname.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    tabIndex={isOpen ? 0 : -1}
                                    className={`flex items-center gap-4 rounded-xl px-4 py-4 text-lg font-semibold transition-colors duration-300 ${
                                        isActive
                                            ? "bg-[#E9D8FD] text-[#7C3AED]"
                                            : "text-gray-600 hover:bg-[#F8FAFC] hover:text-[#7C3AED]"
                                    }`}
                                >
                                    <span
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center text-2xl ${
                                            item.label === "My Wishlist"
                                                ? "text-[#EC4899]"
                                                : ""
                                        }`}
                                    >
                                        {item.icon}
                                    </span>

                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}

                        <button
                            type="button"
                            onClick={handleLogout}
                            tabIndex={isOpen ? 0 : -1}
                            className="flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-lg font-semibold text-red-500 transition-colors duration-300 hover:bg-red-50"
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-2xl">
                                ↪
                            </span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
}
