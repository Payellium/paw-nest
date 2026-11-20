
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=%2Fadmin");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
