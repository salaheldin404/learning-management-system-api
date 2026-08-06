import { Request, Response, NextFunction } from 'express';
import AppError from '@/common/errors/appError';
import { verifyToken } from '../utils/jwt';
import User from '@/modules/users/user.model';
import jwt from "jsonwebtoken";

export const protectRouter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token

    if (!token) {
      throw new AppError("You are not logged in! Please log in to get access.", 401)
    }

    const decoded = verifyToken(token)
    const user = await User.findById(decoded.sub)

    if (!user) {
      throw new AppError("The user belonging to this token does no longer exist.", 401)
    }

    if (user.changePasswordAfter(decoded.iat)) {
      throw new AppError("User recently changed password! Please log in again.", 401)
    }

    req.user = user
    next()
  } catch (error) {
    console.log(error,'error from protectRouter')
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(401).json({ message: "Not authorized" });
  }
}

