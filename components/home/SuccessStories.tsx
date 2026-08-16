import React from "react";
import Image from "next/image";

const stories = [
    {
        petName: "Max",
        petImage:
            "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80",
        story:
            "Max completely transformed our home. He brought so much joy into our lives. The adoption process was smooth and wonderful.",
        ownerName: "Sarah Johnson",
        ownerImage:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        address: "Austin, TX",
    },
    {
        petName: "Luna",
        petImage:
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80",
        story:
            "We adopted Luna for our daughter's birthday. She's gentle, loving, and absolutely adores cuddles.",
        ownerName: "Emily Carter",
        ownerImage:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        address: "Portland, OR",
    },
    {
        petName: "Charlie",
        petImage:
            "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=1000&q=80",
        story:
            "Charlie is my perfect morning-run partner. PawNest made everything transparent and stress-free.",
        ownerName: "Michael Brown",
        ownerImage:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        address: "Denver, CO",
    },
];

const SuccessStories = () => {
    return (
        <section className="relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16">

            {/* Decorative paw */}
            <div className="pointer-events-none absolute left-8 top-10 text-[75px] opacity-[0.08]">
                🐾
            </div>

            <div className="pointer-events-none absolute bottom-10 right-8 text-[70px] opacity-[0.07]">
                🐾
            </div>

            {/* Header */}
            <div className="relative z-10 mx-auto max-w-4xl text-center">

                <p className="mb-3 text-sm font-extrabold tracking-[4px] text-[#059669] sm:text-base">
                    HAPPY ENDINGS
                </p>

                <h2 className="nunito-font text-4xl font-extrabold tracking-[-1px] text-[#1E293B] sm:text-5xl lg:text-[56px]">
                    Success Stories
                </h2>

                <p className="mx-auto mt-7 max-w-190 text-lg font-medium leading-8 text-[#647A9C] sm:text-xl sm:leading-10">
                    Real families, real love. Read how PawNest helped hundreds of pets
                    find their forever homes.
                </p>

            </div>

            {/* Stories */}
            <div className="relative z-10 mx-auto mt-24 grid max-w-450 gap-8 lg:grid-cols-3">

                {stories.map((story) => (
                    <article
                        key={story.petName}
                        className="overflow-hidden rounded-[28px] bg-white shadow-[0_8px_25px_rgba(30,41,59,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(30,41,59,0.12)]"
                    >

                        {/* Pet image */}
                        <div className="relative h-62.5 w-full overflow-hidden sm:h-70">

                            <Image
                                src="/images/pet.jpg"
                                alt={`${story.petName} success story`}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 33vw"
                            />

                            {/* Dark gradient at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/60 to-transparent" />

                            {/* Stars */}
                            <div className="absolute right-5 top-5 flex gap-1 text-xl text-[#FFB000]">
                                ★★★★★
                            </div>

                            {/* Pet name */}
                            <h3 className="nunito-font absolute bottom-5 left-6 text-2xl font-extrabold text-white">
                                {story.petName}
                            </h3>

                        </div>

                        {/* Story content */}
                        <div className="px-7 pb-7 pt-7">

                            <p className="text-[17px] font-medium leading-9 text-[#50627D]">
                                {story.story}
                            </p>

                            {/* Owner */}
                            <div className="mt-7 flex items-center gap-4 border-t border-[#E8EDF5] pt-6">

                                <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-full ring-2 ring-[#E9D8FD]">
                                    <Image
                                        src="/image/pets.jpg"
                                        alt={story.ownerName}
                                        fill
                                        className="object-cover"
                                        sizes="52px"
                                    />
                                </div>

                                <div>
                                    <h4 className="nunito-font text-base font-extrabold text-[#1E293B]">
                                        {story.ownerName}
                                    </h4>

                                    <p className="mt-1 text-sm font-medium text-[#8CA0BE]">
                                        📍 {story.address}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </article>
                ))}

            </div>

        </section>
    );
};

export default SuccessStories;