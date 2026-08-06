import { z } from "zod";


export const updateProfileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long").max(50, "Username must be at most 50 characters long").optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters long").optional(),
  headline: z.string().max(60, "Headline must be at most 60 characters long").optional(),
  socialMedia: z.object({
    facebook: z.string().min(5).max(50).optional(),
    linkedin: z.string().min(3).max(100).optional(),
    instagram: z.string().min(1).max(30).optional(),
    github: z.string().min(1).max(39).optional(),
  }).optional(),
}).strict();

export const updateUserSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long").max(50, "Username must be at most 50 characters long").optional(),
  role: z.enum(["student", "teacher", "admin"]).optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters long").optional(),
  headline: z.string().max(60, "Headline must be at most 60 characters long").optional(),
}).strict();

export const userIdParamSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
}).strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateUserByAdminInput = z.infer<typeof updateUserSchema>;