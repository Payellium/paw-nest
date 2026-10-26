
import mongoose, { Schema, Model } from "mongoose";


export interface IAdoptionRequest {
  catId: mongoose.Types.ObjectId;
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  livingEnvironment: string;
  hasPreviousCatExperience: boolean;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";

  createdAt?: Date;
  updatedAt?: Date;
}


const AdoptionRequestSchema = new Schema<IAdoptionRequest>(
  {
    catId: {
      type: Schema.Types.ObjectId,
      ref: "Cat",
      required: true,
    },
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    livingEnvironment: {
      type: String,
      required: true,
      enum: ["Apartment", "House", "Other"],
    },
    hasPreviousCatExperience: {
      type: Boolean,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const AdoptionRequest: Model<IAdoptionRequest> =
  mongoose.models.AdoptionRequest ||
  mongoose.model<IAdoptionRequest>(
    "AdoptionRequest",
    AdoptionRequestSchema
  );

export default AdoptionRequest;
