import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    styles: {
      type: [String],
      default: [],
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    styleMemory: {
      styleWeights: {
        type: Schema.Types.Mixed,
        default: {},
      },
      colorWeights: {
        type: Schema.Types.Mixed,
        default: {},
      },
      silhouetteWeights: {
        type: Schema.Types.Mixed,
        default: {},
      },
      lastGeneratedOutfits: {
        type: [
          new Schema(
            {
              signature: String,
              items: {
                type: [String],
                default: [],
              },
              colors: {
                type: [String],
                default: [],
              },
              styles: {
                type: [String],
                default: [],
              },
              createdAt: {
                type: Date,
                default: Date.now,
              },
            },
            { _id: false }
          ),
        ],
        default: [],
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
