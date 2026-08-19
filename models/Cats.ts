import mongoose, { Schema } from "mongoose";

interface ICat {
  name: string;
  breed: string;
  age: number;
  gender: string;
  available: boolean;
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
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});
