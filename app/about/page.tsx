
import Link from "next/link";
import {
    FaArrowRight,
    FaCat,
    FaHeart,
    FaPaw,
    FaShieldAlt,
    FaStethoscope,
    FaShoppingBag,
    FaHome,
    FaRobot,
    FaCode,
    FaDatabase,
    FaLaptopCode,
} from "react-icons/fa";

const features = [
    {
        icon: <FaCat />,
        title: "Cat Adoption",
        description:
            "Explore cats looking for loving homes and submit adoption requests through a simple process.",
        color: "bg-[#E9D8FD] text-[#7C3AED]",
    },
    {
        icon: <FaHome />,
        title: "Responsible Rehoming",
        description:
            "Help cats find new families by submitting rehoming listings for review and approval.",
        color: "bg-[#DFF4FF] text-sky-600",
    },
    {
        icon: <FaShoppingBag />,
        title: "Cat Essentials Shop",
        description:
            "Discover carefully selected products and essentials to support everyday cat care.",
        color: "bg-[#D8F3DC] text-green-700",
    },
    {
        icon: <FaStethoscope />,
        title: "Vaccination Booking",
        description:
            "Explore vaccination services and submit booking requests for your furry companion.",
        color: "bg-[#FCE7F3] text-pink-600",
    },
    {
        icon: <FaRobot />,
        title: "PawNest AI",
        description:
            "Get introductory information about common cat health concerns, behavior, and everyday care.",
        color: "bg-[#E9D8FD] text-[#7C3AED]",
    },
    {
        icon: <FaShieldAlt />,
        title: "A Safer Experience",
        description:
            "User accounts and administrative review help organize adoption and rehoming activities.",
        color: "bg-[#DFF4FF] text-sky-600",
    },
];

const technologies = [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "DaisyUI",
    "MongoDB",
    "Mongoose",
    "Auth.js",
    "Cloudinary",
    "SSLCommerz",
];

export default function AboutPage() {
    return (
        <main className="relative z-10 overflow-hidden bg-[#F8FAFC] text-[#292044]">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#F2E9FF] via-[#F8F5FF] to-[#E7F5FF]">
                <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
                <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:px-10 lg:grid-cols-2 lg:py-28">

                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-5 py-2.5 text-sm font-bold text-[#7C3AED] shadow-sm">
                            <FaPaw />
                            ABOUT PAWNEST
                        </span>

                        <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[58px]">
                            A Little Care,
                            <br />
                            A Lot of{" "}
                            <span className="text-[#7C3AED]">
                                Love.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-lg leading-8 text-[#625B75]">
                            PawNest is a cat-focused digital platform
                            designed to bring adoption, responsible
                            rehoming, essential products, and everyday
                            cat-care information together in one place.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="/adopt"
                                className="inline-flex items-center gap-3 rounded-2xl bg-[#7C3AED] px-7 py-4 text-base font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:bg-[#6929D0]"
                            >
                                Meet Our Cats
                                <FaArrowRight />
                            </Link>

                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-3 rounded-2xl border-2 border-purple-200 bg-white px-7 py-4 text-base font-bold text-[#7C3AED] transition hover:border-[#7C3AED] hover:bg-purple-50"
                            >
                                Explore Shop
                            </Link>
                        </div>
                    </div>

                    {/* Hero Illustration */}
                    <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center">
                        <div className="absolute h-[330px] w-[330px] rounded-full bg-[#E9D8FD] blur-[2px] sm:h-[420px] sm:w-[420px]" />

                        <div className="relative flex aspect-square w-full items-center justify-center rounded-[48px] border border-white/80 bg-white/60 shadow-xl shadow-purple-100/60 backdrop-blur-sm">
                            <div className="absolute left-10 top-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-[#7C3AED] shadow-lg">
                                <FaHeart />
                            </div>

                            <div className="absolute bottom-12 right-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-green-600 shadow-lg">
                                <FaPaw />
                            </div>

                            <div className="text-center">
                                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[#E9D8FD] to-[#DFF4FF] text-8xl text-[#7C3AED] shadow-inner sm:h-52 sm:w-52 sm:text-9xl">
                                    <FaCat />
                                </div>

                                <h2 className="mt-7 text-3xl font-extrabold text-[#292044]">
                                    Welcome to PawNest
                                </h2>
                                <p className="mt-2 text-lg text-[#716B80]">
                                    Where every paw matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Project */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

                    <div>
                        <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C3AED]">
                            Our Story
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                            More Than a Website,
                            <br />
                            A Place for Every Paw.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-[#716B80]">
                            Finding a loving home, accessing the right
                            products, and understanding a cat&apos;s
                            everyday needs should feel easier. PawNest
                            was created with this idea at its heart.
                        </p>

                        <p className="mt-5 text-lg leading-8 text-[#716B80]">
                            Developed as a final-year Computer Science
                            and Engineering project, PawNest brings
                            several cat-focused services together
                            through a single, user-friendly platform.
                            It combines practical web development
                            concepts with a meaningful purpose:
                            encouraging responsible cat ownership
                            and better care.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="rounded-[28px] bg-[#E9D8FD] p-7">
                            <FaHeart className="text-3xl text-[#7C3AED]" />
                            <h3 className="mt-5 text-xl font-extrabold">
                                Compassion
                            </h3>
                            <p className="mt-3 text-base leading-7 text-[#625B75]">
                                Putting the well-being of cats at the heart
                                of every feature.
                            </p>
                        </div>

                        <div className="mt-10 rounded-[28px] bg-[#DFF4FF] p-7">
                            <FaShieldAlt className="text-3xl text-sky-600" />
                            <h3 className="mt-5 text-xl font-extrabold">
                                Responsibility
                            </h3>
                            <p className="mt-3 text-base leading-7 text-[#625B75]">
                                Encouraging thoughtful decisions and
                                responsible pet care.
                            </p>
                        </div>

                        <div className="rounded-[28px] bg-[#D8F3DC] p-7">
                            <FaPaw className="text-3xl text-green-700" />
                            <h3 className="mt-5 text-xl font-extrabold">
                                Community
                            </h3>
                            <p className="mt-3 text-base leading-7 text-[#625B75]">
                                Connecting people who want to make
                                a difference in cats&apos; lives.
                            </p>
                        </div>

                        <div className="mt-10 rounded-[28px] bg-[#FCE7F3] p-7">
                            <FaLaptopCode className="text-3xl text-pink-600" />
                            <h3 className="mt-5 text-xl font-extrabold">
                                Innovation
                            </h3>
                            <p className="mt-3 text-base leading-7 text-[#625B75]">
                                Using technology to make cat care
                                more accessible.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="bg-white py-20">
                <div className="mx-auto max-w-4xl px-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9D8FD] text-3xl text-[#7C3AED]">
                        <FaHeart />
                    </div>

                    <span className="mt-7 block text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C3AED]">
                        Our Mission
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                        Making the World a Little Kinder,
                        One Cat at a Time.
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-[#716B80]">
                        Our mission is to create a convenient digital
                        space where people can discover adoption
                        opportunities, support responsible rehoming,
                        access cat essentials, and find helpful
                        introductory care information.
                    </p>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C3AED]">
                        What We Offer
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                        Everything for a Better Cat-Care Journey
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-[#716B80]">
                        PawNest brings useful cat-focused services
                        together to make everyday experiences easier
                        for cat lovers and owners.
                    </p>
                </div>

                <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="rounded-[28px] border border-purple-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${feature.color}`}
                            >
                                {feature.icon}
                            </div>

                            <h3 className="mt-6 text-xl font-extrabold">
                                {feature.title}
                            </h3>

                            <p className="mt-4 text-lg leading-8 text-[#716B80]">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Technology Stack */}
            <section className="bg-gradient-to-br from-[#F2E9FF] to-[#E7F5FF] py-20">
                <div className="mx-auto max-w-6xl px-6 text-center md:px-10">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl text-[#7C3AED] shadow-sm">
                        <FaCode />
                    </div>

                    <span className="mt-7 block text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C3AED]">
                        Behind the Project
                    </span>

                    <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                        Built with Modern Technology
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#716B80]">
                        PawNest uses modern web technologies to deliver
                        a responsive interface, organized data
                        management, and interactive user experiences.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        {technologies.map((technology) => (
                            <span
                                key={technology}
                                className="rounded-xl border border-white bg-white/80 px-6 py-3 text-base font-bold text-[#55456F] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>

                    <p className="mx-auto mt-9 flex items-center justify-center gap-2 text-base font-semibold text-[#625B75]">
                        <FaDatabase className="text-[#7C3AED]" />
                        Powered by a modern full-stack architecture.
                    </p>
                </div>
            </section>

            {/* Vision */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
                <div className="overflow-hidden rounded-[36px] bg-white p-8 shadow-sm sm:p-12 lg:p-16">
                    <div className="grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#7C3AED]">
                                Looking Ahead
                            </span>

                            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                                A Better Future for
                                Every Furry Friend.
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-[#716B80]">
                                PawNest represents our vision of a
                                connected cat-care community. We hope
                                this platform encourages more people
                                to consider adoption, care responsibly,
                                and give cats the loving attention
                                they deserve.
                            </p>
                        </div>

                        <div className="rounded-[30px] bg-gradient-to-br from-[#E9D8FD] to-[#DFF4FF] p-10 text-center">
                            <FaCat className="mx-auto text-8xl text-[#7C3AED]" />
                            <h3 className="mt-7 text-2xl font-extrabold">
                                Every Paw Has a Place.
                            </h3>
                            <p className="mt-3 text-lg text-[#625B75]">
                                Together, we can make that place a
                                loving home.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-6 pb-20 md:px-10">
                <div className="mx-auto max-w-7xl rounded-[36px] bg-gradient-to-r from-[#7C3AED] to-[#9B70EA] px-7 py-14 text-center text-white shadow-xl shadow-purple-200 sm:px-12 sm:py-16">
                    <FaPaw className="mx-auto text-5xl" />

                    <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
                        Be Part of the PawNest Journey.
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-purple-100">
                        Explore the platform, discover our services,
                        and take a step towards making life better
                        for cats.
                    </p>

                    <Link
                        href="/adopt"
                        className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[#7C3AED] shadow-lg transition hover:-translate-y-1 hover:bg-purple-50"
                    >
                        Explore PawNest
                        <FaArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
}
