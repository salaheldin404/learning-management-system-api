import { Types } from "mongoose";

export type UserRole = "student" | "teacher" | "admin";

export interface SocialMedia {
  github: string;
  linkedin: string;
  facebook: string;
  instagram: string;
}

export interface SocialLinks {
  github: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
}

export interface InstructorRating {
  averageRatings: number;
  totalRatings: number;
}

export interface ProfilePicture {
  public_id: string | null;
  url: string | null;
}

interface Certificate {
  courseId: Types.ObjectId;
  issuedAt: Date;
  certificateUrl: {
    public_id: string;
    url: string;
  }
}

export interface User extends Document {
  id : string;
  username: string;
  email: string;
  bio?: string;
  headline: string;
  socialMedia: SocialMedia;
  instructorRating: InstructorRating;
  password: string;
  role: UserRole;
  profilePicture: ProfilePicture;
  slug: string;
  enrolledCourses: Types.ObjectId[];
  createdCourses: Types.ObjectId[];
  completedCourses: Types.ObjectId[];
  certificates: Certificate[];
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, "password" | "passwordResetToken" | "passwordResetExpires" | "passwordChangedAt">;


export interface UserMethods {
  changePasswordAfter(jwtTimestamp: number): boolean;
  createResetToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}