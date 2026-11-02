"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdoptionRequestActionsProps {
    requestId: string;
}

export default function AdoptionRequestActions({
    requestId,
}: AdoptionRequestActionsProps) {
    const router = useRouter();

    const [loading, setLoading] = useState<
        "Approved" | "Rejected" | null
    >(null);

    const [error, setError] = useState("");

    const handleReview = async (status: "Approved" | "Rejected") => {
        const confirmed = window.confirm(
            status === "Approved"
                ? "Are you sure you want to approve this adoption request? This will mark the cat as adopted and reject other pending applications for this cat."
                : "Are you sure you want to reject this adoption request?"
        );

        if (!confirmed) return;

        try {
            setLoading(status);
            setError("");

            const response = await fetch(
                `/api/admin/adoption-requests/${requestId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Something went wrong."
                );
            }

            // Refresh the server-rendered adoption requests
            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update the adoption request."
            );
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="border-t border-purple-100 pt-4">
            {error && (
                <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={() => handleReview("Rejected")}
                    disabled={loading !== null}
                    className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading === "Rejected"
                        ? "Rejecting..."
                        : "Reject Request"}
                </button>

                <button
                    type="button"
                    onClick={() => handleReview("Approved")}
                    disabled={loading !== null}
                    className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading === "Approved"
                        ? "Approving..."
                        : "Approve Request"}
                </button>
            </div>
        </div>
    );
}