import mongoose from "mongoose";
import { Chapter } from "@/modules/chapters/chapter.types";


const { Schema, model, models } = mongoose;

const chapterSchema = new Schema<Chapter>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const ChapterModel = models.Chapter || model<Chapter>("Chapter", chapterSchema);

export default ChapterModel;
