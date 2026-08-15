import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlobalPawBackground from "@/components/GlobalPawBackground";

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

        <GlobalPawBackground />

        <div className="relative z-10">
          <Navbar />

          {children}
        </div>

      </body>
    </html>
  );
}