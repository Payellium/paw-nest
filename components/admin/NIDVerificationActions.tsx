
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface NIDVerificationActionsProps {
    requestId: string;
    status: "Pending" | "Verified" | "Rejected";
    rejectionReason?: string;
}

export default function NIDVerificationActions({
    requestId,
    status,
    rejectionReason,
}: NIDVerificationActionsProps) {
    const router = useRouter();

    const [preview, setPreview] = useState<"front" | "back" | null>(null);
    const [loading, setLoading] = useState<
        "Verified" | "Rejected" | null
    >(null);
    const [error, setError] = useState("");

    const statusStyles = {
        Pending: "bg-amber-100 text-amber-700",
        Verified: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-600",
    };

    const handleVerification = async (
        newStatus: "Verified" | "Rejected"
    ) => {
        let reason = "";

        if (newStatus === "Rejected") {
            const input = window.prompt(
                "Please provide a reason for rejecting this NID:"
            );

            if (input === null) return;

            reason = input.trim();

            if (!reason) {
                setError("A rejection reason is required.");
                return;
            }
        }

        const confirmed = window.confirm(
            newStatus === "Verified"
                ? "Are you sure these NID documents are valid and you want to verify them?"
                : "Are you sure you want to reject these NID documents?"
        );

        if (!confirmed) return;

        try {
            setLoading(newStatus);
            setError("");

            const response = await fetch(
                `/api/admin/adoption-requests/${requestId}/nid-verification`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        ...(newStatus === "Rejected" && {
                            rejectionReason: reason,
                        }),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update NID verification."
                );
            }

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="rounded-2xl border border-purple-100 bg-white p-5 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h4 className="text-lg font-bold text-[#292044]">
                        NID Verification
                    </h4>

                    <p className="mt-1 text-sm text-gray-500">
                        Review the applicant&apos;s identity documents.
                    </p>
                </div>

                <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${statusStyles[status]}`}
                >
                    {status}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => setPreview("front")}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-base font-semibold text-purple-700 transition hover:bg-purple-100"
                >
                    View Front Document
                </button>

                <button
                    type="button"
                    onClick={() => setPreview("back")}
                    className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-base font-semibold text-purple-700 transition hover:bg-purple-100"
                >
                    View Back Document
                </button>
            </div>

            {rejectionReason && (
                <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-700">
                        Rejection Reason
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        {rejectionReason}
                    </p>
                </div>
            )}

            {status === "Pending" && (
                <div className="space-y-3 border-t border-purple-100 pt-4">
                    {error && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => handleVerification("Rejected")}
                            disabled={loading !== null}
                            className="rounded-lg border border-red-200 px-4 py-2 text-base font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                            {loading === "Rejected"
                                ? "Rejecting..."
                                : "Reject NID"}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleVerification("Verified")}
                            disabled={loading !== null}
                            className="rounded-lg bg-green-600 px-4 py-2 text-base font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                            {loading === "Verified"
                                ? "Verifying..."
                                : "Verify NID"}
                        </button>
                    </div>
                </div>
            )}

            {preview && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
                    <div className="relative w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#292044]">
                                NID {preview === "front" ? "Front" : "Back"}
                            </h3>

                            <button
                                type="button"
                                onClick={() => setPreview(null)}
                                className="rounded-lg px-3 py-2 text-xl font-bold text-gray-500 hover:bg-gray-100"
                                aria-label="Close document preview"
                            >
                                ×
                            </button>
                        </div>

                        <img
                            src={`/api/admin/adoption-requests/${requestId}/nid-document/${preview}`}
                            alt={`NID ${preview} document`}
                            className="mx-auto max-h-[70vh] w-full rounded-xl object-contain"
                        />

                        <p className="mt-3 text-center text-xs text-gray-400">
                            Confidential identity document — authorized admin access only.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
