import { Types } from "mongoose";


export interface Wishlist {
  _id: string;
  user: Types.ObjectId;
  items: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date
}

