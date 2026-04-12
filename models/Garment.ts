import mongoose from "mongoose";

const GarmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["top", "bottom", "shoes", "outerwear"],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      enum: ["summer", "winter", "all"],
      default: "all",
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Garment =
  mongoose.models.Garment ||
  mongoose.model("Garment", GarmentSchema);