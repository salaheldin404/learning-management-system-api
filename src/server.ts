import express from "express";
import authRoutes from "@/modules/auth/auth.routes";
import globalError from "@/common/errors/error.controller";
import AppError from "@/common/errors/appError";

const app = express();

app.use(express.json());


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});


app.use("/api/auth", authRoutes);

// app.use("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
// })

app.use(globalError)


export default app;