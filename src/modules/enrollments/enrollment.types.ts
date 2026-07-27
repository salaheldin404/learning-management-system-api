import { HydratedDocument, Types } from "mongoose";

export interface Enrollment {
  _id: string;
  user: Types.ObjectId;
  course: Types.ObjectId;
  progress: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type EnrollmentDocument = HydratedDocument<Enrollment>;