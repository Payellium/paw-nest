import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GlobalPawBackground from "@/components/GlobalPawBackground";
import Footer from "@/components/Footer";
import CatHealthChatbot from "@/components/chatbot/CatHealthChatbot";
import AuthSessionProvider from "./SessionProvider";

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
            <GlobalPawBackground />

        <div className="relative z-10">
          <Navbar />

          {children}

          <Footer></Footer>
        </div>
        <CatHealthChatbot></CatHealthChatbot>
        </AuthSessionProvider>
      </body>
    </html>
  );
}