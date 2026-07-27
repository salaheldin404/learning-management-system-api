import connectDB from "@/common/utils/connectDB";
import app from "./server"
import env from "@/config/env";

const PORT = env.PORT;



const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();