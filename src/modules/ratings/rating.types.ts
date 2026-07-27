import { Types } from "mongoose";

export interface Rating {
  _id: string;
  user: Types.ObjectId;
  course: Types.ObjectId;

  rate: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
