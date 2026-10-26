import mongoose, { Schema, Model } from "mongoose";

interface ICat {
  name: string;
  breed: string;
  ageInMonths: number;
  gender: string;
  location: string;
  image: string;
  personality: string[];
  adoptionStatus: string;

  // Existing optional fields
  description?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  specialNeeds?: boolean;
  featured?: boolean;

  // New fields for user-submitted cats
  ownerId?: string;
  listingType: "Admin" | "User";
}

const catSchema = new Schema<ICat>(
  {
    name: {
      type: String,
      required: true,
    },

    breed: {
      type: String,
      required: true,
    },

    ageInMonths: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    personality: {
      type: [String],
      required: true,
    },

    adoptionStatus: {
      type: String,
      enum: ["Available", "Pending", "Adopted"],
      default: "Available",
    },

    // Existing fields
    description: {
      type: String,
      default: "",
    },

    vaccinated: {
      type: Boolean,
      default: true,
    },

    neutered: {
      type: Boolean,
      default: true,
    },

    specialNeeds: {
      type: Boolean,
      default: false,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // New: identifies the user who submitted the cat
    ownerId: {
      type: String,
      default: null,
    },

    // New: identifies who created the listing
    listingType: {
      type: String,
      enum: ["Admin", "User"],
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const Cat =
  (mongoose.models.Cat as Model<ICat>) ||
  mongoose.model<ICat>("Cat", catSchema);

export default Cat;