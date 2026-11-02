
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CatReviewActionsProps = {
    catId: string;
    catName: string;
};

export default function CatReviewActions({
    catId,
    catName,
}: CatReviewActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<"Approved" | "Rejected" | null>(
        null,
    );
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    async function handleReview(reviewStatus: "Approved" | "Rejected") {
        const action = reviewStatus === "Approved" ? "approve" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} ${catName}'s listing?`,
            )
        ) {
            return;
        }

        setLoading(reviewStatus);
        setMessage("");
        setError(false);

        try {
            const response = await fetch(
                `/api/admin/cats/${catId}/review`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reviewStatus }),
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to update the listing.",
                );
            }

            setMessage(result.message || "Review status updated.");
            router.refresh();
        } catch (err) {
            setError(true);
            setMessage(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="min-w-[190px] space-y-3">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => handleReview("Approved")}
                    disabled={loading !== null}
                    className="min-h-11 rounded-xl bg-emerald-600 px-4 py-2 text-base font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading === "Approved" ? "Approving..." : "Approve"}
                </button>

                <button
                    type="button"
                    onClick={() => handleReview("Rejected")}
                    disabled={loading !== null}
                    className="min-h-11 rounded-xl bg-red-600 px-4 py-2 text-base font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading === "Rejected" ? "Rejecting..." : "Reject"}
                </button>
            </div>

            {message && (
                <p
                    role="status"
                    aria-live="polite"
                    className={`text-sm font-semibold leading-6 ${
                        error ? "text-red-700" : "text-emerald-700"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
