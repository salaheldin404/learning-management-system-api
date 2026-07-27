import { Types } from "mongoose";

export interface Progress {
  _id: string;
  user: Types.ObjectId;
  course: Types.ObjectId;
  completedLessons: CompletedLessons[];
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CompletedLessons {
  lessonId: Types.ObjectId;
  completionDate: Date;
}