import { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export interface Course {
  _id: string;
  title: string;
  subtitle: string;
  status: CourseStatus;
  description?: string;
  willLearn: string[];
  requirements: string[];
  slug?: string;
  instructor: Types.ObjectId;
  chapters: Types.ObjectId[];
  students: Types.ObjectId[];
  enrollmentsCount: number;
  image?: CourseImage;
  category?: CourseCategory;
  level?: CourseLevel;
  ratingsSummary?: CourseRatingsSummary;
  price?: number;
  free: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseDocument = HydratedDocument<Course>;

export interface CourseImage {
  public_id: string | null;
  url: string | null;
}

export interface CourseRatingsSummary {
  averageRating: number;
  totalRatings: number;
}

export enum CourseStatus {
  Draft = "draft",
  Published = "published",
}

export enum CourseLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export enum CourseCategory {
  Programming = "programming",
  Design = "design",
  Marketing = "marketing",
  Business = "business",
}
