
import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "./SessionProvider";
import RootLayoutContent from "@/components/RootLayoutContent";

export const metadata: Metadata = {
    title: "PawNest",
    description: "Find your perfect companion",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthSessionProvider>
                    <RootLayoutContent>
                        {children}
                    </RootLayoutContent>
                </AuthSessionProvider>
            </body>
        </html>
    );
}
