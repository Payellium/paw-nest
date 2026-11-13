
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookingStatus = "Confirmed" | "Completed" | "Cancelled" | "Rejected";

type VaccinationBookingActionsProps = {
    bookingId: string;
    catName: string;
    currentStatus: string;
};

export default function VaccinationBookingActions({
    bookingId,
    catName,
    currentStatus,
}: VaccinationBookingActionsProps) {
    const router = useRouter();

    const [loading, setLoading] = useState<BookingStatus | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const actions: {
        status: BookingStatus;
        label: string;
        loadingLabel: string;
        buttonClass: string;
    }[] = [
            {
                status: "Confirmed",
                label: "Confirm",
                loadingLabel: "Confirming...",
                buttonClass:
                    "bg-emerald-600 hover:bg-emerald-700",
            },
            {
                status: "Completed",
                label: "Complete",
                loadingLabel: "Completing...",
                buttonClass:
                    "bg-violet-600 hover:bg-violet-700",
            },
            {
                status: "Rejected",
                label: "Reject",
                loadingLabel: "Rejecting...",
                buttonClass:
                    "bg-red-600 hover:bg-red-700",
            },
            {
                status: "Cancelled",
                label: "Cancel",
                loadingLabel: "Cancelling...",
                buttonClass:
                    "bg-slate-600 hover:bg-slate-700",
            },
        ];

    const availableActions: Record<string, BookingStatus[]> = {
        Pending: ["Confirmed", "Rejected"],
        Confirmed: ["Completed", "Cancelled"],
    };

    async function handleUpdate(status: BookingStatus) {
        const action = status.toLowerCase();

        if (
            !window.confirm(
                `Are you sure you want to ${action} the vaccination booking for ${catName}?`,
            )
        ) {
            return;
        }

        setLoading(status);
        setMessage("");
        setError(false);

        try {
            const response = await fetch(
                `/api/admin/vaccination-bookings/${bookingId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to update the booking.",
                );
            }

            setMessage(result.message || "Booking status updated.");
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

    const currentActions = availableActions[currentStatus] ?? [];

    return (
        <div className="min-w-[170px] space-y-3">
            {currentActions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {actions
                        .filter((action) =>
                            currentActions.includes(action.status),
                        )
                        .map((action) => (
                            <button
                                key={action.status}
                                type="button"
                                onClick={() => handleUpdate(action.status)}
                                disabled={loading !== null}
                                className={`min-h-11 rounded-xl px-4 py-2 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${action.buttonClass}`}
                            >
                                {loading === action.status
                                    ? action.loadingLabel
                                    : action.label}
                            </button>
                        ))}
                </div>
            ) : (
                <span className="text-sm font-semibold text-slate-500">
                    No further actions
                </span>
            )}

            {message && (
                <p
                    role="status"
                    aria-live="polite"
                    className={`text-sm font-semibold leading-6 ${error ? "text-red-700" : "text-emerald-700"
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
