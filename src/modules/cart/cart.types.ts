import { HydratedDocument, Types } from "mongoose";


export interface Cart {
  _id: string;
  user: Types.ObjectId;
  items: Types.ObjectId[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CartDocument = HydratedDocument<Cart>;