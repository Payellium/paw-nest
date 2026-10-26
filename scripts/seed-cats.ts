import mongoose from "mongoose";
   import Cat from "../models/Cat";

const cats = [
  // ---- The 8 featured cats (images from /public/cats) ----
  {
    name: "Milo",
    breed: "Persian",
    ageInMonths: 24,
    gender: "Male",
    location: "Austin, TX",
    image: "/cats/persian.jpg",
    personality: ["Calm", "Cuddly", "Quiet"],
    description: "Milo loves slow mornings, sunny windowsills and long brushing sessions.",
    featured: true,
  },
  {
    name: "Luna",
    breed: "Siamese",
    ageInMonths: 12,
    gender: "Female",
    location: "Portland, OR",
    image: "/cats/siamese.jpg",
    personality: ["Vocal", "Playful", "Social"],
    description: "Luna will happily chat with you all day and follow you from room to room.",
    featured: true,
  },
  {
    name: "Oliver",
    breed: "Maine Coon",
    ageInMonths: 36,
    gender: "Male",
    location: "Denver, CO",
    image: "/cats/maine-coon.jpg",
    personality: ["Gentle", "Curious", "Friendly"],
    description: "A gentle giant who gets along with kids and other pets.",
    featured: true,
  },
  {
    name: "Mia",
    breed: "Ragdoll",
    ageInMonths: 48,
    gender: "Female",
    location: "Seattle, WA",
    image: "/cats/ragdoll.jpg",
    personality: ["Affectionate", "Relaxed", "Lap cat"],
    description: "Mia goes limp with happiness the moment she is picked up.",
    featured: true,
  },
  {
    name: "Leo",
    breed: "British Shorthair",
    ageInMonths: 24,
    gender: "Male",
    location: "Chicago, IL",
    image: "/cats/british-shorthair.jpg",
    personality: ["Independent", "Loyal", "Calm"],
    description: "Leo is happy to hang out nearby without demanding constant attention.",
    featured: true,
  },
  {
    name: "Nala",
    breed: "Bengal",
    ageInMonths: 12,
    gender: "Female",
    location: "Miami, FL",
    image: "/cats/bengal.jpg",
    personality: ["Energetic", "Adventurous", "Smart"],
    description: "Nala needs climbing space and puzzle toys to keep her busy.",
    featured: true,
  },
  {
    name: "Simba",
    breed: "Scottish Fold",
    ageInMonths: 36,
    gender: "Male",
    location: "Boston, MA",
    image: "/cats/scottish-fold.jpg",
    personality: ["Sweet", "Sleepy", "Gentle"],
    description: "Simba is a sweet, easygoing companion who loves a warm lap.",
    featured: true,
  },
  {
    name: "Cleo",
    breed: "American Shorthair",
    ageInMonths: 24,
    gender: "Female",
    location: "Dallas, TX",
    image: "/cats/american-shorthair.jpg",
    personality: ["Playful", "Adaptable", "Friendly"],
    description: "Cleo settles into new homes quickly and loves feather toys.",
    featured: true,
  },

  // ---- Extra cats so every homepage category has results ----
  {
    name: "Pip",
    breed: "Domestic Shorthair",
    ageInMonths: 3,
    gender: "Male",
    location: "Austin, TX",
    image: "/images/categories/kitten1.jpg",
    personality: ["Tiny", "Bouncy", "Curious"],
    description: "A 3-month-old ball of energy looking for a patient family.",
  },
  {
    name: "Willow",
    breed: "Domestic Shorthair",
    ageInMonths: 18,
    gender: "Female",
    location: "Portland, OR",
    image: "/images/categories/young-cat1.jpg",
    personality: ["Playful", "Curious", "Affectionate"],
    description: "Willow is a young cat who loves chasing toys and cuddling at night.",
  },
  {
    name: "Shadow",
    breed: "Domestic Shorthair",
    ageInMonths: 60,
    gender: "Male",
    location: "Chicago, IL",
    image: "/images/categories/adult-cat1.jpg",
    personality: ["Laid-back", "Loyal", "Quiet"],
    description: "Shadow is a calm adult who is already litter trained and house-friendly.",
  },
  {
    name: "Gus",
    breed: "Domestic Longhair",
    ageInMonths: 132,
    gender: "Male",
    location: "Denver, CO",
    image: "/images/categories/senior-cats.webp",
    personality: ["Wise", "Gentle", "Cuddly"],
    description: "Gus is 11 years old and wants a quiet home and a soft blanket.",
  },
  {
    name: "Bean",
    breed: "Domestic Shorthair",
    ageInMonths: 60,
    gender: "Female",
    location: "Seattle, WA",
    image: "/images/categories/handicapped-pets-3.jpg",
    personality: ["Brave", "Sweet", "Determined"],
    description: "Bean has limited mobility in her back legs but does not let it slow her down.",
    specialNeeds: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Run with --env-file=.env.local");
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Cat.deleteMany({});
  const inserted = await Cat.insertMany(cats);

  console.log(`Seeded ${inserted.length} cats`);
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
