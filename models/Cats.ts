import mongoose, { Schema } from "mongoose";

interface ICat {
  name: string;
  breed: string;
  ageInMonths: number;
  gender: string;
  location: string;
  image: string;
  personality: string[];
  adoptionStatus: string;

}

const catSchema = new Schema<ICat>({
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
    required: true,
  }
});

const Cat = mongoose.models.Cat || mongoose.model<ICat>("Cat", catSchema);

export default Cat;
