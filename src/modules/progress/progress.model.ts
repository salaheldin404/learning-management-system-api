import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

import { Progress } from "@/modules/progress/progress.types";

const progressSchema = new Schema<Progress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    completedLessons: [
      {
        lesson: {
          type: Schema.Types.ObjectId,
          ref: "Lesson",
          required: true,
        },
        completionDate: { type: Date, required: true },
      },
    ],

    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

const ProgressModel = models.Progress || model<Progress>("Progress", progressSchema);

export default ProgressModel;
