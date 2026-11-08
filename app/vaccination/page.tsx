
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaCalendarCheck,
    FaCheckCircle,
    FaHeart,
    FaHeartbeat,
    FaShieldAlt,
    FaSyringe,
    FaStethoscope,
    FaStar,
} from "react-icons/fa";

const vaccines = [
    {
        name: "FVRCP Vaccine",
        shortName: "CORE VACCINE",
        description:
            "Helps protect cats against feline viral rhinotracheitis, calicivirus, and panleukopenia.",
        icon: <FaShieldAlt />,
        color: "bg-[#F3ECFF]",
        iconColor: "text-[#7C3AED]",
        badgeColor: "bg-[#E9D8FD] text-[#6D35C5]",
        buttonColor: "bg-[#7C3AED] hover:bg-[#6929D0]",
    },
    {
        name: "Rabies Vaccine",
        shortName: "ESSENTIAL PROTECTION",
        description:
            "Helps protect your cat against rabies, a serious viral disease that can also affect humans.",
        icon: <FaSyringe />,
        color: "bg-[#EAF7FF]",
        iconColor: "text-sky-600",
        badgeColor: "bg-[#DFF4FF] text-sky-700",
        buttonColor: "bg-sky-600 hover:bg-sky-700",
    },
    {
        name: "FeLV Vaccine",
        shortName: "ADDITIONAL PROTECTION",
        description:
            "Helps protect cats against feline leukemia virus. A veterinarian can assess whether your cat needs it.",
        icon: <FaHeartbeat />,
        color: "bg-[#ECF8EF]",
        iconColor: "text-green-700",
        badgeColor: "bg-[#D8F3DC] text-green-800",
        buttonColor: "bg-green-700 hover:bg-green-800",
    },
    {
        name: "Vet-Recommended Package",
        shortName: "PERSONALIZED CARE",
        description:
            "Request a vaccination plan based on your cat's age, health, lifestyle, and previous vaccination history.",
        icon: <FaStethoscope />,
        color: "bg-[#FFF0F7]",
        iconColor: "text-pink-600",
        badgeColor: "bg-[#FCE7F3] text-pink-700",
        buttonColor: "bg-pink-600 hover:bg-pink-700",
        featured: true,
    },
];

const benefits = [
    {
        icon: <FaShieldAlt />,
        title: "Health First",
        description:
            "Learn about important vaccinations that help protect your cat.",
    },
    {
        icon: <FaCalendarCheck />,
        title: "Easy Booking",
        description:
            "Submit a booking request with your preferred date and details.",
    },
    {
        icon: <FaHeart />,
        title: "Care That Matters",
        description:
            "Give your furry companion the attention and preventive care they deserve.",
    },
];

export default function VaccinationPage() {
    return (
        <main className="relative z-10 overflow-hidden bg-[#F8FAFC] text-[#292044]">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#F2E9FF] via-[#F8F5FF] to-[#E7F5FF]">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-16 lg:py-28">

                    <div className="relative z-10">
                        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-5 py-2.5 text-base font-semibold text-[#7C3AED] shadow-sm">
                            <FaSyringe />
                            PawNest Vaccination Care
                        </span>

                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[56px]">
                            A Healthier Life
                            <br />
                            Starts With{" "}
                            <span className="text-[#7C3AED]">
                                Protection.
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-lg leading-8 text-[#625B75] sm:text-xl">
                            Your cat deserves a happy and healthy life.
                            Explore vaccination options and request a
                            booking for your furry companion with PawNest.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-4">
                            <Link
                                href="#vaccine-options"
                                className="inline-flex items-center gap-3 rounded-2xl bg-[#7C3AED] px-7 py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:bg-[#6929D0]"
                            >
                                Explore Vaccines
                                <FaArrowRight />
                            </Link>

                            <Link
                                href="/vaccination/book"
                                className="inline-flex items-center gap-3 rounded-2xl border-2 border-[#7C3AED]/20 bg-white px-7 py-4 text-lg font-bold text-[#7C3AED] transition hover:border-[#7C3AED] hover:bg-purple-50"
                            >
                                Book Now
                            </Link>
                        </div>

                        <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-base font-medium text-[#625B75]">
                            <span className="flex items-center gap-2">
                                <FaCheckCircle className="text-green-600" />
                                Simple booking
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCheckCircle className="text-green-600" />
                                Cat-focused care
                            </span>
                        </div>
                    </div>

                    {/* Cat Image Collage */}
                    <div className="relative mx-auto w-full max-w-[540px]">
                        <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-purple-200/60 blur-2xl" />
                        <div className="absolute -bottom-8 right-0 h-40 w-40 rounded-full bg-sky-200/60 blur-3xl" />

                        <div className="relative grid grid-cols-2 gap-4">
                            <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[36px] border-4 border-white shadow-xl">
                                <Image
                                    src="/images/cats/bella.jpg"
                                    alt="Bella the cat"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 45vw, 260px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border-4 border-white shadow-xl">
                                <Image
                                    src="/images/cats/leo.jpg"
                                    alt="Leo the cat"
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 45vw, 260px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border-4 border-white shadow-xl">
                                <Image
                                    src="/images/cats/luna.jpg"
                                    alt="Luna the cat"
                                    fill
                                    sizes="(max-width: 768px) 45vw, 260px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="relative -mt-10 aspect-[4/5] overflow-hidden rounded-[36px] border-4 border-white shadow-xl">
                                <Image
                                    src="/images/cats/max.jpg"
                                    alt="Max the cat"
                                    fill
                                    sizes="(max-width: 768px) 45vw, 260px"
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl border border-purple-100 bg-white px-5 py-4 shadow-xl">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E9D8FD] text-xl text-[#7C3AED]">
                                <FaHeart />
                            </span>
                            <div>
                                <p className="text-base font-bold">
                                    Healthy Cats, Happy Hearts
                                </p>
                                <p className="text-sm text-gray-500">
                                    Every little life matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <span className="text-base font-bold uppercase tracking-[0.2em] text-[#7C3AED]">
                        Why Vaccination Matters
                    </span>
                    <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                        Care That Keeps Them Safe
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-[#716B80]">
                        Preventive care plays an important role in your
                        cat&apos;s well-being. Start by exploring the available
                        vaccination options.
                    </p>
                </div>

                <div className="grid gap-7 md:grid-cols-3">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.title}
                            className="rounded-[28px] border border-purple-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9D8FD] text-2xl text-[#7C3AED]">
                                {benefit.icon}
                            </div>
                            <h3 className="text-2xl font-bold">
                                {benefit.title}
                            </h3>
                            <p className="mt-4 text-lg leading-8 text-[#716B80]">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Vaccine Options */}
            <section
                id="vaccine-options"
                className="bg-gradient-to-b from-[#F3EDFF] to-[#F8FAFC] py-20"
            >
                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <span className="text-base font-bold uppercase tracking-[0.2em] text-[#7C3AED]">
                            Our Services
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                            Explore Vaccination Options
                        </h2>
                        <p className="mt-5 text-lg leading-8 text-[#716B80]">
                            Choose an option to submit a booking request.
                            The appropriate vaccine and schedule will be
                            confirmed by a qualified veterinarian.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {vaccines.map((vaccine) => (
                            <article
                                key={vaccine.name}
                                className={`group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${vaccine.featured
                                        ? "border-pink-200 shadow-pink-100/60"
                                        : "border-[#EAE5F3] hover:border-purple-200"
                                    }`}
                            >
                                {/* Top Accent */}
                                <div
                                    className={`absolute left-0 top-0 h-1.5 w-full ${vaccine.featured
                                            ? "bg-pink-400"
                                            : vaccine.iconColor.includes("sky")
                                                ? "bg-sky-400"
                                                : vaccine.iconColor.includes("green")
                                                    ? "bg-green-400"
                                                    : "bg-[#9B70EA]"
                                        }`}
                                />

                                {/* Category and Featured Badge */}
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold tracking-wider ${vaccine.badgeColor}`}
                                    >
                                        {vaccine.shortName}
                                    </span>

                                    {vaccine.featured && (
                                        <span className="flex items-center gap-1 text-xs font-bold text-pink-600">
                                            <FaStar />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Medical Icon */}
                                <div className="flex flex-1 flex-col items-center justify-center py-7">
                                    <div
                                        className={`flex h-[76px] w-[76px] items-center justify-center rounded-[24px] text-3xl shadow-sm transition duration-300 group-hover:scale-110 ${vaccine.color} ${vaccine.iconColor}`}
                                    >
                                        {vaccine.icon}
                                    </div>

                                    {/* Vaccine Name */}
                                    <h3 className="mt-5 text-center text-lg font-extrabold leading-snug text-[#292044]">
                                        {vaccine.name}
                                    </h3>
                                </div>

                                {/* Booking Button */}
                                <Link
                                    href={`/vaccination/book?vaccine=${encodeURIComponent(vaccine.name)}`}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-300 ${vaccine.buttonColor}`}
                                >
                                    Book This Vaccine
                                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </article>
                        ))}
                    </div>

                    <p className="mx-auto mt-9 max-w-3xl text-center text-base leading-7 text-[#716B80]">
                        <strong>Important:</strong> Not every vaccine is
                        suitable for every cat. Vaccine selection and
                        timing depend on age, health, lifestyle, and
                        veterinary assessment.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="text-base font-bold uppercase tracking-[0.2em] text-[#7C3AED]">
                        Simple Process
                    </span>
                    <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                        How Booking Works
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-[#716B80]">
                        Requesting a vaccination service for your cat
                        takes just a few simple steps.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            number: "01",
                            title: "Choose a Service",
                            description:
                                "Explore the available vaccine options and select the service you want to request.",
                        },
                        {
                            number: "02",
                            title: "Submit Your Details",
                            description:
                                "Provide your cat's information, contact details, and preferred date.",
                        },
                        {
                            number: "03",
                            title: "Wait for Confirmation",
                            description:
                                "Our team will review your request and update you about its booking status.",
                        },
                    ].map((step) => (
                        <div
                            key={step.number}
                            className="rounded-[28px] border border-purple-100 bg-white p-8 shadow-sm"
                        >
                            <span className="text-5xl font-extrabold text-[#D8C5FF]">
                                {step.number}
                            </span>
                            <h3 className="mt-6 text-2xl font-bold">
                                {step.title}
                            </h3>
                            <p className="mt-4 text-lg leading-8 text-[#716B80]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="px-6 pb-20 md:px-10">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-r from-[#7C3AED] to-[#9B70EA] px-7 py-14 text-center text-white shadow-xl shadow-purple-200 sm:px-12 sm:py-16">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">
                        <FaHeart />
                    </div>

                    <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">
                        Their Health Deserves Your Love.
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-purple-100">
                        Take the first step towards preventive care.
                        Submit a vaccination booking request for your
                        beloved cat today.
                    </p>

                    <Link
                        href="/vaccination/book"
                        className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-[#7C3AED] shadow-lg transition hover:-translate-y-1 hover:bg-purple-50"
                    >
                        Book a Vaccination
                        <FaArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
}
