
import mongoose, { Schema, type Model } from "mongoose";

export type VaccinationGender = "Male" | "Female" | "Unknown";

export type VaccinationStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export interface IVaccinationBooking {
  userId: string;
  vaccine: string;
  catName: string;
  breed: string;
  age: string;
  gender: VaccinationGender;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  preferredDate: Date;
  notes?: string;
  status: VaccinationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const VaccinationBookingSchema = new Schema<IVaccinationBooking>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    vaccine: {
      type: String,
      required: true,
      enum: [
        "FVRCP Vaccine",
        "Rabies Vaccine",
        "FeLV Vaccine",
        "Vet-Recommended Package",
      ],
    },
    catName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    age: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Unknown"],
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const VaccinationBooking: Model<IVaccinationBooking> =
  (mongoose.models.VaccinationBooking as Model<IVaccinationBooking>) ||
  mongoose.model<IVaccinationBooking>(
    "VaccinationBooking",
    VaccinationBookingSchema
  );

export default VaccinationBooking;
