
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import AdoptionRequest from "@/models/AdoptionRequest";
import Cat from "@/models/Cat";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyAccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDB();

  const userId = session.user.id;

  const [adoptionRequests, rehomingListings] = await Promise.all([
    AdoptionRequest.countDocuments({ userId }),
    Cat.countDocuments({
      ownerId: userId,
      listingType: "User",
    }),
  ]);

  const cards = [
    {
      title: "Adoption Requests",
      count: adoptionRequests,
      description: "Track the cats you've applied to adopt.",
      href: "/my-adoption-requests",
      icon: "♡",
    },
    {
      title: "My Rehoming",
      count: rehomingListings,
      description: "Manage cats you've listed for rehoming.",
      href: "/my-account/my-rehoming",
      icon: "🐾",
    },
    {
      title: "My Cart",
      count: 0,
      description: "Your shopping cart will be available soon.",
      href: "/my-account/cart",
      icon: "🛒",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="text-base font-bold uppercase tracking-wider text-[#7C3AED]">
          PawNest Dashboard
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#292044] sm:text-4xl lg:text-[40px]">
          Welcome, {session.user.name || "Cat Lover"}!
        </h1>

        <p className="mt-3 text-lg leading-8 text-gray-600">
          Manage your adoption requests, rehoming listings, and shopping
          activity in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-2xl border border-purple-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {card.title}
                </p>

                <h2 className="mt-4 text-4xl font-bold text-[#292044] sm:text-[42px]">
                  {card.count}
                </h2>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#E9D8FD] text-3xl text-[#7C3AED]">
                {card.icon}
              </div>
            </div>

            <p className="mt-5 text-lg leading-7 text-gray-600">
              {card.description}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 text-lg font-bold text-[#7C3AED] transition-all group-hover:gap-3">
              View details <span>→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-purple-100 bg-white p-7 sm:p-9">
        <h2 className="text-2xl font-bold text-[#292044] sm:text-[28px]">
          Your PawNest Journey
        </h2>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-gray-600">
          Whether you&apos;re looking for a new furry companion or helping a
          cat find a loving home, PawNest brings your activities together.
          Use the sidebar to manage your account.
        </p>
      </div>
    </div>
  );
}
