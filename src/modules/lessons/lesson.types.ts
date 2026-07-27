import { HydratedDocument } from "mongoose";
import { Types } from "mongoose";

export interface Lesson {
  _id: string;
  title: string;
  chapter: Types.ObjectId;
  course: Types.ObjectId;
  video: LessonVideo;
  order: number;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LessonDocument = HydratedDocument<Lesson>;

interface LessonVideo {
  assetId: string;
  playbackId: string;
  playbackUrl: string;
  duration: number;
}