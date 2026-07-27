import mongoose from "mongoose";
import { Wishlist } from "@/modules/wishlists/wishlist.types";

const { Schema, model, models } = mongoose;

const wishlistSchema = new Schema<Wishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [{
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }]
  }, {
  timestamps: true,
})


const Wishlist = models.Wishlist || model("Wishlist", wishlistSchema);

export default Wishlist;