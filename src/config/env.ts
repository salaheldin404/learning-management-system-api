import { env as loadEnv } from "custom-env";
import { StringValue } from "ms";
import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production" || process.env.APP_STAGE === "production";

if (!isProduction) {
  loadEnv();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  APP_STAGE: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().startsWith("mongodb+srv://", "DATABASE_URL must be a valid MongoDB connection string"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters long"),
  JWT_EXPIRES_IN: z.custom<StringValue>().default("1h"),
  JWT_REFRESH_EXPIRES_IN: z.custom<StringValue>().default("7d"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.email("EMAIL_FROM must be a valid email address"),
  APP_NAME: z.string().min(1, "APP_NAME is required"),
  FRONTEND_URL: z.url("FRONTEND_URL must be a valid URL"),
})

export type Env = z.infer<typeof envSchema>

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Environment variable validation error:", error.issues);
    error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      console.log(`${path}: ${issue.message}`)
    })
    process.exit(1);
  }
  throw error
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTest = () => env.APP_STAGE === 'test'

export { env }
export default env