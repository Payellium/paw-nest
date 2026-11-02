
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";
import CatReviewActions from "@/components/admin/CatReviewActions";

export const dynamic = "force-dynamic";

type PageProps = {
    searchParams: Promise<{
        status?: string;
    }>;
};

type CatListing = {
    _id: { toString(): string };
    name: string;
    breed: string;
    ageInMonths: number;
    gender: string;
    location: string;
    image: string;
    adoptionStatus: string;
    reviewStatus?: string;
    listingType?: string;
    createdAt?: Date;
};

const statusOptions = [
    { label: "All Listings", value: "All" },
    { label: "Pending Reviews", value: "Pending" },
    { label: "Approved Listings", value: "Approved" },
    { label: "Rejected Listings", value: "Rejected" },
];

function getStatusStyles(status: string) {
    switch (status) {
        case "Approved":
            return "bg-green-100 text-green-700";
        case "Rejected":
            return "bg-red-100 text-red-700";
        case "Pending":
            return "bg-amber-100 text-amber-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function getAdoptionStyles(status: string) {
    switch (status) {
        case "Available":
            return "bg-emerald-100 text-emerald-700";
        case "Adopted":
            return "bg-purple-100 text-purple-700";
        case "Pending":
            return "bg-amber-100 text-amber-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function formatAge(ageInMonths: number) {
    if (ageInMonths < 12) {
        return `${ageInMonths} month${ageInMonths === 1 ? "" : "s"}`;
    }

    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    if (months === 0) {
        return `${years} year${years === 1 ? "" : "s"}`;
    }

    return `${years}y ${months}m`;
}

export default async function AdminCatsPage({ searchParams }: PageProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=%2Fadmin%2Fcats");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    const params = await searchParams;
    const requestedStatus = params.status ?? "All";

    const selectedStatus = statusOptions.some(
        (option) => option.value === requestedStatus,
    )
        ? requestedStatus
        : "All";

    await connectDB();

    const filter =
        selectedStatus === "All"
            ? {}
            : {
                reviewStatus: selectedStatus as
                    | "Pending"
                    | "Approved"
                    | "Rejected",
            };

    const cats = (await Cat.find(filter)
        .sort({ createdAt: -1 })
        .lean()
        .exec()) as unknown as CatListing[];

    const totalCount = await Cat.countDocuments({});
    const pendingCount = await Cat.countDocuments({
        reviewStatus: "Pending",
    });
    const approvedCount = await Cat.countDocuments({
        $or: [
            { reviewStatus: "Approved" },
            { reviewStatus: { $exists: false } },
            { reviewStatus: null },
        ],
    });
    const rejectedCount = await Cat.countDocuments({
        reviewStatus: "Rejected",
    });

    const counts: Record<string, number> = {
        All: totalCount,
        Pending: pendingCount,
        Approved: approvedCount,
        Rejected: rejectedCount,
    };

    return (
        <div className="space-y-8">
            {/* Page Introduction */}
            <section className="rounded-3xl bg-gradient-to-r from-[#292044] to-violet-800 p-8 text-white shadow-lg sm:p-10 lg:p-12">
                <p className="text-base font-bold uppercase tracking-[0.15em] text-violet-200 sm:text-lg">
                    PawNest Management
                </p>

                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                    Cat Listings
                </h2>

                <p className="mt-4 max-w-3xl text-base leading-8 text-violet-100 sm:text-lg">
                    Manage cat listings, monitor review statuses, and keep adoption
                    information organized in one place.
                </p>
            </section>

            {/* Status filter cards */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {statusOptions.map((option) => {
                    const active = selectedStatus === option.value;

                    return (
                        <Link
                            key={option.value}
                            href={
                                option.value === "All"
                                    ? "/admin/cats"
                                    : `/admin/cats?status=${option.value}`
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
                                {active ? "Currently viewing" : "View listings"} →
                            </p>
                        </Link>
                    );
                })}
            </section>

            {/* Listings table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900">
                            {statusOptions.find(
                                (option) => option.value === selectedStatus,
                            )?.label ?? "All Listings"}
                        </h3>

                        <p className="mt-1 text-xl text-slate-500">
                            {cats.length} listing{cats.length === 1 ? "" : "s"} found
                        </p>
                    </div>

                    {selectedStatus !== "All" && (
                        <Link
                            href="/admin/cats"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
                        >
                            Clear filter
                        </Link>
                    )}
                </div>

                {cats.length === 0 ? (
                    <div className="px-5 py-16 text-center sm:px-8">
                        <div className="text-5xl" aria-hidden="true">
                            🐱
                        </div>

                        <h4 className="mt-4 text-lg font-bold text-slate-800">
                            No listings found
                        </h4>

                        <p className="mt-2 leading-6 text-slate-500">
                            There are no cat listings in this category yet.
                        </p>

                        {selectedStatus !== "All" && (
                            <Link
                                href="/admin/cats"
                                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700"
                            >
                                View all listings
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead className="bg-slate-50">
                                <tr className="font-bold uppercase tracking-normal text-slate-500">
                                    <th className="px-5 py-4">Cat</th>
                                    <th className="px-5 py-4">Details</th>
                                    <th className="px-5 py-4">Listing Type</th>
                                    <th className="px-5 py-4">Review Status</th>
                                    <th className="px-5 py-4">Adoption Status</th>
                                    <th className="px-5 py-4">Date Added</th>
                                    <th className="px-5 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {cats.map((cat) => {
                                    const reviewStatus =
                                        cat.reviewStatus ?? "Approved";

                                    return (
                                        <tr
                                            key={cat._id.toString()}
                                            className="transition hover:bg-violet-50/40"
                                        >
                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-violet-50">
                                                        {cat.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={cat.image}
                                                                alt={cat.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-2xl">
                                                                🐱
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-bold text-[20px] text-slate-900">
                                                            {cat.name}
                                                        </p>
                                                        <p className="mt-2 text-md text-slate-500">
                                                            {cat.breed}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-6">
                                                <p className="font-semibold text-md text-slate-800">
                                                    {formatAge(cat.ageInMonths)}
                                                </p>
                                                <p className="mt-1 text-slate-500">
                                                    {cat.gender}
                                                </p>
                                                <p className="mt-1  text-slate-500">
                                                    {cat.location}
                                                </p>
                                            </td>

                                            <td className="px-6 py-6">
                                                <span className="inline-flex rounded-full bg-violet-100 px-3 py-1.5 text-sm font-semibold text-violet-700">
                                                    {cat.listingType === "User"
                                                        ? "User Submission"
                                                        : "Admin Listing"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-6">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${getStatusStyles(reviewStatus)}`}
                                                >
                                                    {reviewStatus}
                                                </span>
                                            </td>

                                            <td className="px-5 py-6">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${getAdoptionStyles(cat.adoptionStatus)}`}
                                                >
                                                    {cat.adoptionStatus}
                                                </span>
                                            </td>

                                            <td className="px-6 py-6  text-slate-600">
                                                {cat.createdAt
                                                    ? new Date(
                                                        cat.createdAt,
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-6">
                                                {cat.listingType === "User" &&
                                                    reviewStatus === "Pending" ? (
                                                    <CatReviewActions
                                                        catId={cat._id.toString()}
                                                        catName={cat.name}
                                                    />
                                                ) : (
                                                    <span className="text-base text-slate-500">
                                                        {cat.listingType === "User"
                                                            ? "Reviewed"
                                                            : "Admin listing"}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
