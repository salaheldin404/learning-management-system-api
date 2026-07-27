import mongoose from "mongoose";

mongoose.set("strictQuery", true);
import env from "@/config/env";

const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log(`Database Connected`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;