
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import GlobalPawBackground from "@/components/GlobalPawBackground";
import Footer from "@/components/Footer";
import CatHealthChatbot from "@/components/chatbot/CatHealthChatbot";

export default function RootLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <GlobalPawBackground />

            <div className="relative z-10">
                <Navbar />
                {children}
                <Footer />
            </div>

            <CatHealthChatbot />
        </>
    );
}
