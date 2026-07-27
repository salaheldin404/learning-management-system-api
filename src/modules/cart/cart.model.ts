import { Cart } from "@/modules/cart/cart.types";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const cartSchema = new Schema<Cart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = models.Cart || model("Cart", cartSchema);

export default Cart;