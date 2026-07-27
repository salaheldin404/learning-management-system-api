import { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export interface Chapter {
  _id: string;
  title: string;
  course: Types.ObjectId;
  lessons: Types.ObjectId[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ChapterDocument = HydratedDocument<Chapter>;
