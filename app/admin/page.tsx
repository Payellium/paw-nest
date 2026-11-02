
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Cat from "@/models/Cat";

export const dynamic = "force-dynamic";

const summaryCards = [
    {
        title: "Total Listings",
        description: "All cat listings",
        icon: "🐱",
        color: "bg-violet-50",
        iconColor: "text-violet-700",
        valueColor: "text-violet-700",
    },
    {
        title: "Pending Reviews",
        description: "Awaiting your decision",
        icon: "⏳",
        color: "bg-amber-50",
        iconColor: "text-amber-700",
        valueColor: "text-amber-700",
    },
    {
        title: "Approved Listings",
        description: "Approved for publication",
        icon: "✅",
        color: "bg-green-50",
        iconColor: "text-green-700",
        valueColor: "text-green-700",
    },
    {
        title: "Rejected Listings",
        description: "Not approved for publication",
        icon: "📋",
        color: "bg-rose-50",
        iconColor: "text-rose-700",
        valueColor: "text-rose-700",
    },
];

const quickActions = [
    {
        title: "Review Submissions",
        description: "Check submitted cats and make approval decisions.",
        icon: "📋",
        href: "/admin/reviews",
        color: "bg-violet-100",
    },
    {
        title: "Manage Cat Listings",
        description: "View and manage cat profiles on PawNest.",
        icon: "🐈",
        href: "/admin/cats",
        color: "bg-sky-100",
    },
    {
        title: "Manage Users",
        description: "View registered PawNest users.",
        icon: "👥",
        href: "/admin/users",
        color: "bg-green-100",
    },
];

function formatDate(date: Date | string | null | undefined) {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getStatusStyles(status: string) {
    switch (status) {
        case "Approved":
            return "bg-green-100 text-green-800";
        case "Rejected":
            return "bg-rose-100 text-rose-800";
        case "Pending":
        default:
            return "bg-amber-100 text-amber-800";
    }
}

export default async function AdminDashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=%2Fadmin");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    await connectDB();

    const approvedFilter = {
        $or: [
            { reviewStatus: "Approved" as const },
            { reviewStatus: { $exists: false } },
            { reviewStatus: null },
        ],
    };

    const [
        totalListings,
        pendingReviews,
        approvedListings,
        rejectedListings,
        recentCats,
    ] = await Promise.all([
        Cat.countDocuments({}),
        Cat.countDocuments({ reviewStatus: "Pending" }),
        Cat.countDocuments(approvedFilter),
        Cat.countDocuments({ reviewStatus: "Rejected" }),
        Cat.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name breed location image reviewStatus listingType createdAt")
            .lean(),
    ]);

    const statistics = [
        totalListings,
        pendingReviews,
        approvedListings,
        rejectedListings,
    ];

    return (
        <div className="space-y-10 text-slate-800 sm:space-y-12">
            {/* Dashboard heading */}
            {/* <header>
                <p className="mb-3 text-base font-extrabold uppercase tracking-[0.16em] text-violet-600 sm:text-lg">
                    PawNest Administration
                </p>

                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    Admin Dashboard 
                </h1>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                    Manage cat listings, review rehoming submissions, and help
                    cats find safe, loving homes.
                </p>
            </header> */}

            {/* Welcome panel */}
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#E9D8FD] via-[#DFF4FF] to-[#D8F3DC] p-6 shadow-sm sm:p-9 lg:p-10">
                <p className="text-base font-bold uppercase tracking-wider text-violet-700 sm:text-lg">
                    Welcome Back
                </p>

                <h2 className="mt-3 break-words text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                    Hello, {session.user.name || "Admin"}! 🐾
                </h2>

                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
                    Your work helps cats find safe, loving homes. Review
                    submitted listings and make sure every cat profile is
                    ready for adoption.
                </p>
            </section>

            {/* Statistics */}
            <section>
                <div className="mb-7">
                    <h2 className="text-3xl font-extrabold sm:text-4xl">
                        Dashboard Overview
                    </h2>

                    <p className="mt-3 text-lg leading-8 text-slate-600 sm:text-xl">
                        An overview of cat listings and their current review status.
                    </p>
                </div>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4">
                    {summaryCards.map((card, index) => {
                        const filters = [
                            "",
                            "?status=Pending",
                            "?status=Approved",
                            "?status=Rejected",
                        ];

                        return (
                            <Link
                                key={card.title}
                                href={`/admin/cats${filters[index]}`}
                                className="group block rounded-3xl border border-violet-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-200 sm:p-7"
                            >
                                <div
                                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${card.color} text-3xl`}
                                    aria-hidden="true"
                                >
                                    {card.icon}
                                </div>

                                <p className="text-lg font-semibold leading-7 text-slate-600 sm:text-xl">
                                    {card.title}
                                </p>

                                <p className={`mt-4 text-4xl font-extrabold sm:text-5xl ${card.valueColor}`}>
                                    {statistics[index].toLocaleString()}
                                </p>

                                

                                <span className="mt-5 inline-flex items-center text-base font-bold text-violet-700 sm:text-lg">
                                    View listings
                                    <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">
                                        →
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

            </section>

            {/* Recent submissions */}
            <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold sm:text-4xl">
                            Recent Listings
                        </h2>

                        <p className="mt-3 text-lg leading-8 text-slate-600 sm:text-xl">
                            The five most recently added cat profiles.
                        </p>
                    </div>

                    <Link
                        href="/admin/cats"
                        className="inline-flex min-h-12 w-fit items-center justify-center rounded-xl bg-violet-100 px-6 py-3 text-base font-bold text-violet-800 transition hover:bg-violet-200 sm:text-lg"
                    >
                        View All Listings
                        <span className="ml-2" aria-hidden="true">→</span>
                    </Link>
                </div>

                {recentCats.length === 0 ? (
                    <div className="mt-8 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-5 py-12 text-center sm:py-16">
                        <p className="text-5xl" aria-hidden="true">🐈</p>

                        <h3 className="mt-5 text-2xl font-extrabold sm:text-3xl">
                            No Cat Listings Yet
                        </h3>

                        <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-600">
                            Cat profiles will appear here when they are added to
                            the PawNest database.
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-4">
                        {recentCats.map((cat) => {
                            const status = cat.reviewStatus || "Approved";

                            return (
                                <article
                                    key={String(cat._id)}
                                    className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-violet-200 hover:bg-violet-50/30 sm:flex-row sm:items-center sm:p-5"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-4">
                                        {cat.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={cat.image}
                                                alt={cat.name}
                                                className="h-20 w-20 shrink-0 rounded-2xl border border-slate-100 object-cover sm:h-24 sm:w-24"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-4xl sm:h-24 sm:w-24">
                                                🐱
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h3 className="break-words text-xl font-extrabold sm:text-2xl">
                                                {cat.name}
                                            </h3>

                                            <p className="mt-1 text-base text-slate-600 sm:text-lg">
                                                {cat.breed}
                                            </p>

                                            <p className="mt-1 text-base text-slate-500">
                                                📍 {cat.location || "Location unavailable"}
                                            </p>

                                            <p className="mt-2 text-sm text-slate-500 sm:text-base">
                                                Added {formatDate(cat.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-bold sm:text-base ${getStatusStyles(status)}`}
                                        >
                                            {status}
                                        </span>

                                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 sm:text-base">
                                            {cat.listingType === "User"
                                                ? "User submission"
                                                : "Admin listing"}
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Quick actions */}
            <section>
                <div className="mb-7">
                    <h2 className="text-3xl font-extrabold sm:text-4xl">
                        Quick Actions
                    </h2>

                    <p className="mt-3 text-lg leading-8 text-slate-600 sm:text-xl">
                        Jump directly to the tools you use most.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group flex h-full flex-col rounded-3xl border border-violet-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg sm:p-7"
                        >
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${action.color} text-3xl`}>
                                {action.icon}
                            </div>

                            <h3 className="mt-6 text-2xl font-extrabold sm:text-3xl">
                                {action.title}
                            </h3>

                            <p className="mt-3 flex-1 text-lg leading-8 text-slate-600">
                                {action.description}
                            </p>

                            <span className="mt-6 inline-flex items-center text-lg font-bold text-violet-700 transition group-hover:gap-3">
                                Open section
                                <span className="ml-2" aria-hidden="true">→</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
