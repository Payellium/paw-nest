import { connectDB } from "@/lib/mongodb";
import AdoptionRequest from "@/models/AdoptionRequest";
import Link from "next/link";
import AdoptionRequestActions from "@/components/admin/AdoptionRequestActions";

export const dynamic = "force-dynamic";

type AdoptionRequestItem = {
    _id: string;
    applicantName: string;
    email: string;
    phone: string;
    city: string;
    livingEnvironment: string;
    hasPreviousCatExperience: boolean;
    reason: string;
    status: "Pending" | "Approved" | "Rejected";
    createdAt: string;
    catId: {
        _id: string;
        name: string;
        breed: string;
        ageInMonths: number;
        gender: string;
        location: string;
        image: string;
    } | null;
};

export default async function AdminAdoptionRequestsPage() {
    await connectDB();

    const rawRequests = await AdoptionRequest.find()
        .populate("catId", "name breed ageInMonths gender location image")
        .sort({ createdAt: -1 })
        .lean();

    const requests: AdoptionRequestItem[] = JSON.parse(
        JSON.stringify(rawRequests)
    );

    const pendingCount = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const approvedCount = requests.filter(
        (request) => request.status === "Approved"
    ).length;

    const rejectedCount = requests.filter(
        (request) => request.status === "Rejected"
    ).length;

    return (
        <div className="space-y-8">
            {/* Page heading */}
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">
                    Management
                </p>

                <h1 className="mt-2 text-3xl font-bold text-[#292044] sm:text-4xl">
                    Adoption Requests
                </h1>

                <p className="mt-2 text-gray-500">
                    Review applications and manage the cat adoption process.
                </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Pending Requests
                    </p>
                    <p className="mt-2 text-3xl font-bold text-amber-600">
                        {pendingCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Approved Requests
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-600">
                        {approvedCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Rejected Requests
                    </p>
                    <p className="mt-2 text-3xl font-bold text-red-500">
                        {rejectedCount}
                    </p>
                </div>
            </div>

            {/* Requests list */}
            <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
                <div className="border-b border-purple-100 px-5 py-5 sm:px-6">
                    <h2 className="text-xl font-bold text-[#292044]">
                        All Applications
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {requests.length} application(s) received
                    </p>
                </div>

                {requests.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <div className="text-5xl">🐱</div>
                        <h3 className="mt-4 text-lg font-bold text-[#292044]">
                            No adoption requests yet
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            New applications will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-purple-50">
                        {requests.map((item) => (
                            <div
                                key={item._id}
                                className="space-y-5 p-5 sm:p-6"
                            >
                                {/* Applicant and cat */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#292044]">
                                            {item.applicantName}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Submitted{" "}
                                            {new Date(
                                                item.createdAt
                                            ).toLocaleDateString("en-GB", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                            item.status === "Pending"
                                                ? "bg-amber-100 text-amber-700"
                                                : item.status === "Approved"
                                                  ? "bg-green-100 text-green-700"
                                                  : "bg-red-100 text-red-600"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                {/* Cat information */}
                                {item.catId ? (
                                    <div className="flex items-center gap-4 rounded-xl bg-purple-50/60 p-4">
                                        {item.catId.image ? (
                                            <img
                                                src={item.catId.image}
                                                alt={item.catId.name}
                                                className="h-20 w-20 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-purple-100 text-3xl">
                                                🐱
                                            </div>
                                        )}

                                        <div>
                                            <p className="font-bold text-[#292044]">
                                                {item.catId.name}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {item.catId.breed} ·{" "}
                                                {item.catId.gender}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.catId.location}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                                        The associated cat listing is no longer available.
                                    </p>
                                )}

                                {/* Applicant details */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Email
                                        </p>
                                        <p className="mt-1 break-all text-sm text-gray-700">
                                            {item.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Phone
                                        </p>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {item.phone}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            City
                                        </p>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {item.city}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Living Environment
                                        </p>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {item.livingEnvironment}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Previous Cat Experience
                                        </p>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {item.hasPreviousCatExperience
                                                ? "Yes"
                                                : "No"}
                                        </p>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Why they want to adopt
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                                        {item.reason}
                                    </p>
                                </div>

                                {/* Actions */}
                                {item.status === "Pending" && item.catId && (
                                    <AdoptionRequestActions
                                        requestId={item._id}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-sm text-gray-500">
                <Link
                    href="/admin"
                    className="font-semibold text-purple-600 hover:text-purple-800"
                >
                    ← Back to dashboard
                </Link>
            </div>
        </div>
    );
}