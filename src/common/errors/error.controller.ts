import type { ErrorRequestHandler } from "express";
import AppError from "@/common/errors/appError";

const globalError: ErrorRequestHandler = (
  err: AppError,
  req,
  res,
  next
) => {
  res.status(err.statusCode ?? 500).json({
    status: err.status ?? "error",
    message: err.message,
  });
};

export default globalError;