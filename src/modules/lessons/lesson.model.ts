import mongoose from "mongoose";
import { Lesson } from "@/modules/lessons/lesson.types";

const { Schema, model, models } = mongoose;

const lessonSchema = new Schema<Lesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [60, "Title cannot exceed 60 characters"],
    },
    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    video: {
      assetId: {
        type: String,
      },
      playbackId: {
        type: String,
      },
      playbackUrl: {
        type: String,
      },
      duration: {
        type: Number,
      },
    },
    order: {
      type: Number,
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

const LessonModel = models.Lesson || model<Lesson>("Lesson", lessonSchema);

export default LessonModel;
