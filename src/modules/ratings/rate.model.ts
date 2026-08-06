import mongoose, { Model } from "mongoose";
import { Rating } from "@/modules/ratings/rating.types";

const { Schema, model, models } = mongoose;

const ratingSchema = new Schema<Rating>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

ratingSchema.index({ course: 1, rate: 1 });

const RatingModel = models.Rating as Model<Rating> || model<Rating>("Rating", ratingSchema);

export default RatingModel;
