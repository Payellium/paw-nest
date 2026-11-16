import mongoose, { Schema, Model } from "mongoose";
import type { INIDVerification } from "@/types/nid-verification";

export interface IAdoptionRequest {
  catId: mongoose.Types.ObjectId;
  userId: string;
  applicantName: string;
  email: string;
  phone: string;
  city: string;
  livingEnvironment: string;
  hasPreviousCatExperience: boolean;
  reason: string;
  nidVerification: INIDVerification;
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
    userId: {
      type: String,
      required: true,
      index: true,
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
    nidVerification: {
      documentFront: {
        type: String,
        required: true,
      },
      documentBack: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Verified", "Rejected"],
        default: "Pending",
      },
      consentGiven: {
        type: Boolean,
        required: true,
        default: false,
      },
      verifiedAt: {
        type: Date,
      },
      rejectionReason: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const AdoptionRequest: Model<IAdoptionRequest> =
  mongoose.models.AdoptionRequest ||
  mongoose.model<IAdoptionRequest>("AdoptionRequest", AdoptionRequestSchema);

export default AdoptionRequest;
