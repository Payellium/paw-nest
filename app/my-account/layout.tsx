
import type { ReactNode } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function MyAccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <AccountSidebar />

        <section className="min-w-0 flex-1">
          {children}
        </section>
      </div>
    </main>
  );
}
