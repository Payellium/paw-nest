
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import VaccinationBooking from "@/models/VaccinationBooking";
import VaccinationBookingActions from "@/components/admin/VaccinationBookingActions";

export const dynamic = "force-dynamic";

type PageProps = {
    searchParams: Promise<{
        status?: string;
    }>;
};

type BookingStatus =
    | "Pending"
    | "Confirmed"
    | "Completed"
    | "Cancelled"
    | "Rejected";

type VaccinationBookingItem = {
    _id: { toString(): string };
    vaccine: string;
    catName: string;
    breed: string;
    age: string;
    gender: string;
    ownerName: string;
    email: string;
    phone: string;
    location: string;
    preferredDate: Date;
    notes?: string;
    status: BookingStatus;
    createdAt?: Date;
};

const statusOptions = [
    { label: "All Bookings", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Completed", value: "Completed" },
];

function getStatusStyles(status: string) {
    switch (status) {
        case "Confirmed":
            return "bg-emerald-100 text-emerald-700";
        case "Completed":
            return "bg-violet-100 text-violet-700";
        case "Rejected":
            return "bg-red-100 text-red-700";
        case "Cancelled":
            return "bg-slate-100 text-slate-700";
        case "Pending":
            return "bg-amber-100 text-amber-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default async function AdminVaccinationBookingsPage({
    searchParams,
}: PageProps) {
    // 1. Verify admin authentication.
    const session = await auth();

    if (!session?.user) {
        redirect(
            "/login?callbackUrl=%2Fadmin%2Fvaccination-bookings",
        );
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    // 2. Read the selected status filter.
    const params = await searchParams;
    const requestedStatus = params.status ?? "All";

    const validStatuses = [
        "All",
        "Pending",
        "Confirmed",
        "Completed",
    ];

    const selectedStatus = validStatuses.includes(requestedStatus)
        ? requestedStatus
        : "All";

    // 3. Connect to MongoDB.
    await connectDB();

    // 4. Fetch vaccination bookings.
    const filter =
    selectedStatus === "All"
        ? {}
        : {
              status: selectedStatus as BookingStatus,
          };

    const bookings = (await VaccinationBooking.find(filter)
        .sort({ createdAt: -1 })
        .lean()
        .exec()) as unknown as VaccinationBookingItem[];

    // 5. Calculate summary counts.
    const totalCount = await VaccinationBooking.countDocuments({});
    const pendingCount = await VaccinationBooking.countDocuments({
        status: "Pending",
    });
    const confirmedCount = await VaccinationBooking.countDocuments({
        status: "Confirmed",
    });
    const completedCount = await VaccinationBooking.countDocuments({
        status: "Completed",
    });

    const counts: Record<string, number> = {
        All: totalCount,
        Pending: pendingCount,
        Confirmed: confirmedCount,
        Completed: completedCount,
    };

    return (
        <div className="space-y-8">
            {/* Page Introduction */}
            <section className="rounded-3xl bg-linear-to-r from-[#292044] to-violet-800 p-8 text-white shadow-lg sm:p-10 lg:p-12">
                <p className="text-base font-bold uppercase tracking-[0.15em] text-violet-200 sm:text-lg">
                    PawNest Management
                </p>

                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                    Vaccination Bookings
                </h2>

                <p className="mt-4 max-w-3xl text-base leading-8 text-violet-100 sm:text-lg">
                    Manage vaccination requests, review pet and owner
                    information, and keep booking statuses up to date.
                </p>
            </section>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {statusOptions.map((option) => {
                    const active = selectedStatus === option.value;

                    return (
                        <Link
                            key={option.value}
                            href={
                                option.value === "All"
                                    ? "/admin/vaccination-bookings"
                                    : `/admin/vaccination-bookings?status=${option.value}`
                            }
                            aria-current={active ? "page" : undefined}
                            className={`min-h-44 rounded-2xl border-2 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-7 ${active
                                    ? "border-violet-400 bg-violet-50 shadow-md"
                                    : "border-slate-200 bg-white hover:border-violet-200"
                                }`}
                        >
                            <p className="text-base font-semibold leading-7 text-slate-600">
                                {option.label}
                            </p>

                            <p className="mt-4 text-4xl font-extrabold text-[#292044] sm:text-5xl">
                                {counts[option.value]}
                            </p>

                            <p className="mt-4 text-base font-semibold text-violet-700">
                                {active
                                    ? "Currently viewing"
                                    : "View bookings"}{" "}
                                →
                            </p>
                        </Link>
                    );
                })}
            </section>

            {/* Bookings Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {statusOptions.find(
                                (option) =>
                                    option.value === selectedStatus,
                            )?.label ?? "All Bookings"}
                        </h3>

                        <p className="mt-1 text-xl text-slate-500">
                            {bookings.length} booking
                            {bookings.length === 1 ? "" : "s"} found
                        </p>
                    </div>

                    {selectedStatus !== "All" && (
                        <Link
                            href="/admin/vaccination-bookings"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                        >
                            Clear filter
                        </Link>
                    )}
                </div>

                {bookings.length === 0 ? (
                    <div className="px-5 py-16 text-center sm:px-8">
                        <div className="text-5xl" aria-hidden="true">
                            💉
                        </div>

                        <h4 className="mt-4 text-xl font-bold text-slate-800">
                            No bookings found
                        </h4>

                        <p className="mt-2 text-base leading-6 text-slate-500">
                            There are no vaccination bookings in this
                            category yet.
                        </p>

                        {selectedStatus !== "All" && (
                            <Link
                                href="/admin/vaccination-bookings"
                                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
                            >
                                View all bookings
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1250px]">
                            <thead className="bg-slate-50">
                                <tr className="text-left font-bold uppercase tracking-normal text-slate-500">
                                    <th className="px-5 py-4">Cat</th>
                                    <th className="px-5 py-4">Vaccine</th>
                                    <th className="px-5 py-4">Owner Details</th>
                                    <th className="px-5 py-4">Preferred Date</th>
                                    <th className="px-5 py-4">Booking Status</th>
                                    <th className="px-5 py-4">Submitted</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((booking) => (
                                    <tr
                                        key={booking._id.toString()}
                                        className="transition hover:bg-violet-50/40"
                                    >
                                        {/* Cat Details */}
                                        <td className="px-5 py-6">
                                            <p className="text-xl font-bold text-slate-900">
                                                {booking.catName}
                                            </p>

                                            <p className="mt-2 text-base text-slate-600">
                                                {booking.breed}
                                            </p>

                                            <p className="mt-1 text-base text-slate-500">
                                                {booking.age} · {booking.gender}
                                            </p>
                                        </td>

                                        {/* Vaccine */}
                                        <td className="px-5 py-6">
                                            <span className="inline-flex max-w-52 rounded-xl bg-violet-100 px-3 py-2 text-sm font-bold leading-6 text-violet-700">
                                                {booking.vaccine}
                                            </span>
                                        </td>

                                        {/* Owner Details */}
                                        <td className="px-5 py-6">
                                            <p className="text-base font-bold text-slate-800">
                                                {booking.ownerName}
                                            </p>

                                            <a
                                                href={`mailto:${booking.email}`}
                                                className="mt-2 block text-sm text-violet-700 hover:underline"
                                            >
                                                {booking.email}
                                            </a>

                                            <a
                                                href={`tel:${booking.phone}`}
                                                className="mt-1 block text-sm text-slate-600 hover:text-violet-700"
                                            >
                                                {booking.phone}
                                            </a>

                                            <p className="mt-2 max-w-48 text-sm text-slate-500">
                                                {booking.location}
                                            </p>
                                        </td>

                                        {/* Preferred Date */}
                                        <td className="px-5 py-6 text-base font-semibold text-slate-700">
                                            {formatDate(booking.preferredDate)}
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-6">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${getStatusStyles(
                                                    booking.status,
                                                )}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>

                                        {/* Submitted Date */}
                                        <td className="px-5 py-6 text-base text-slate-600">
                                            {booking.createdAt
                                                ? formatDate(booking.createdAt)
                                                : "—"}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-6">
                                            <VaccinationBookingActions
                                                bookingId={booking._id.toString()}
                                                catName={booking.catName}
                                                currentStatus={booking.status}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
