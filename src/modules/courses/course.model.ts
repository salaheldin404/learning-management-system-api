import {
  Course,
  CourseCategory,
  CourseDocument,
  CourseImage,
  CourseLevel,
  CourseStatus,
} from "@/modules/courses/course.types";
import mongoose, { Model } from "mongoose";
import slugify from "slugify";

const { Schema, model, models } = mongoose;

const courseSchema = new Schema<Course>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [60, "Title cannot exceed 60 characters"],
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxLength: [120, "Subtitle cannot exceed 120 characters"],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.Draft,
    },

    description: {
      type: String,
      required: function (): boolean {
        return this.status === CourseStatus.Published;
      },
      trim: true,
      minLength: [20, "Description must be at least 20 characters"],
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    willLearn: [
      {
        type: String,
        minLength: [1, "Learning field cannot be empty"],
        maxLength: [120, "Learning field cannot exceed 120 characters"],
      },
    ],
    requirements: [
      {
        type: String,
        minLength: [1, "Requirement field cannot be empty"],
        maxLength: [120, "Requirement cannot exceed 120 characters"],
      },
    ],
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chapters: {
      type: [{ type: Schema.Types.ObjectId, ref: "Chapter" }],

    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: Object.values(CourseCategory),
      index: true,
      required: function (this: CourseDocument) {
        return this.status === CourseStatus.Published;
      },
    },

    enrollmentsCount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      required: function (this: CourseDocument) {
        return !this.free;
      },
    },
    free: {
      type: Boolean,
      default: false,
    },
    image: {
      type: {
        public_id: { type: String, default: null },
        url: { type: String, default: null },
      },
      default: () => ({ public_id: null, url: null }),
      validate: {
        validator: function (this: CourseDocument, v: CourseImage) {
          return (
            this.status !== CourseStatus.Published || !!(v?.public_id && v?.url)
          );
        },
        message: "A course image is required when published.",
      },
    },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      required: function (this: CourseDocument) {
        return this.status === CourseStatus.Published;
      },
    },
    ratingsSummary: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        index: true,
      },
      totalRatings: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

courseSchema.index({ title: "text", description: "text" });


courseSchema.pre("save", async function (this: CourseDocument) {
  if (!this.isModified("title")) return;

  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
});

const Course = models.Course as Model<Course> || model<Course>("Course", courseSchema);

export default Course;
