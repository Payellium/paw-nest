import {
  FaSearch,
  FaHeart,
  FaCheckCircle,
  FaAward,
} from "react-icons/fa";

const steps = [
  {
    number: "1",
    title: "Browse Pets",
    description:
      "Explore hundreds of adorable animals looking for their forever home. Filter by species, age, breed, and city.",
    icon: FaSearch,
    color: "blue",
    bg: "bg-[#EFF9FF]",
    iconBg: "bg-gradient-to-br from-[#08B8F5] to-[#3182F6]",
  },
  {
    number: "2",
    title: "Choose Your Match",
    description:
      "Connect with a pet that fits your lifestyle and personality. Save favorites and request photos from the shelter.",
    icon: FaHeart,
    color: "pink",
    bg: "bg-[#FFF3F8]",
    iconBg: "bg-gradient-to-br from-[#FF4F9A] to-[#FF2870]",
  },
  {
    number: "3",
    title: "Apply to Adopt",
    description:
      "Complete our quick online application. Our compassionate team reviews every submission within 24 hours.",
    icon: FaCheckCircle,
    color: "purple",
    bg: "bg-[#F5F3FF]",
    iconBg: "bg-gradient-to-br from-[#A276FF] to-[#8B2CF5]",
  },
  {
    number: "4",
    title: "Welcome Home",
    description:
      "After approval, meet your new family member and bring them home with our full welcome kit and ongoing support.",
    icon: FaAward,
    color: "green",
    bg: "bg-[#ECFCF5]",
    iconBg: "bg-gradient-to-br from-[#06C9A5] to-[#00BFA5]",
  },
];

export default function AdoptionSteps() {
  return (
    <section className="relative z-10 px-6 py-20 sm:px-8 lg:px-12">

      {/* Heading */}
      <div className="mx-auto max-w-212.5 text-center">

        <h2 className="text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl lg:text-[54px]">
          How Adoption Works
        </h2>

        <p className="mx-auto mt-7 max-w-200 text-base leading-8 text-[#647894] sm:text-lg md:text-[24px] md:leading-10">
          Our thoughtful process makes bringing home a new family member
          easy, transparent, and joyful.
        </p>

      </div>

      {/* Cards */}
      <div className="mx-auto mt-24 grid max-w-[1800px] grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className={`group relative min-h-97.5 overflow-hidden rounded-4xl ${step.bg} p-9 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.015] hover:shadow-[0_20px_45px_rgba(30,41,59,0.12)]`}
            >

              {/* Number */}
              <div className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#7C20FF] to-[#6824E8] text-lg font-bold text-white shadow-[0_5px_15px_rgba(124,58,237,0.25)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                {step.number}
              </div>

              {/* Icon */}
              <div
                className={`flex h-22 w-22 items-center justify-center rounded-[25px] ${step.iconBg} text-[40px] text-white shadow-[0_12px_25px_rgba(30,41,59,0.12)] transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-110`}
              >
                <Icon />
              </div>

              {/* Content */}
              <div className="mt-9">

                <h3 className="text-[26px] font-extrabold text-[#1E293B]">
                  {step.title}
                </h3>

                <p className="mt-5 text-[19px] font-medium leading-9 text-[#657A99]">
                  {step.description}
                </p>

              </div>

              {/* Bottom hover glow */}
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-white/40 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            </div>
          );
        })}

      </div>
    </section>
  );
}