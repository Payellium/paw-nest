import mongoose, { Schema, Model } from "mongoose";

export interface ICat {
  name: string;
  breed: string;
  ageInMonths: number;
  gender: string;
  location: string;
  image: string;
  personality: string[];
  adoptionStatus: "Available" | "Pending" | "Adopted";
  reviewStatus: "Pending" | "Approved" | "Rejected";
  description?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  specialNeeds?: boolean;
  featured?: boolean;
  ownerId?: string | null;
  listingType: "Admin" | "User";
  createdAt?: Date;
  updatedAt?: Date;
}

const catSchema = new Schema<ICat>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    ageInMonths: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    personality: {
      type: [String],
      required: true,
      default: [],
    },
    adoptionStatus: {
      type: String,
      enum: ["Available", "Pending", "Adopted"],
      default: "Available",
    },
    reviewStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },
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
    ownerId: {
      type: String,
      default: null,
    },
    listingType: {
      type: String,
      enum: ["Admin", "User"],
      default: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

const Cat =
  (mongoose.models.Cat as Model<ICat>) ||
  mongoose.model<ICat>("Cat", catSchema);

export default Cat;
