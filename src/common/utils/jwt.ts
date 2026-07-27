import jwt from "jsonwebtoken";
import env from "@/config/env";
import AppError from "../errors/appError";

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export function generateAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function generateTokens(userId: string) {
  return {
    token: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
}

export function verifyToken(
  token: string,
  secret: string = env.JWT_SECRET
): JwtPayload {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", 401);
    }
    throw new AppError("Invalid token", 401);
  }
}
