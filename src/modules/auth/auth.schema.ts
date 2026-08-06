import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;


export const signupSchema = z
  .object({
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        strongPasswordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string({ error: "Password confirmation is required" }),
    role: z.enum(["student", "teacher"], { error: "Role must be either 'student' or 'teacher'" }),
    username: z
      .string({ error: "Username is required" })
      .trim()
      .min(2, "Username must be at least 2 characters long")
      .max(50, "Username must be at most 50 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string({ error: "Password is required" }),
});

export const forgotPasswordSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
  })
  .strict();


export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .regex(strongPasswordRegex, {
        message:
          "Password must be at least 8 characters, include uppercase, lowercase, number and special character",
      }),
    confirmPassword: z.string({
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();

export const resetPasswordParamsSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i, "Invalid token"),
});


export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordParamsSchema>;