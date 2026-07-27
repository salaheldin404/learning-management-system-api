import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import AppError from "@/common/errors/appError";

type SchemaMap = {
  body?: ZodType<any>;
  params?: ZodType<any>;
  query?: ZodType<any>;
};

const validateSchema = <T>(
  schema: ZodType<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues
      .map(issue => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new AppError(
      message,
      400
    );
  }

  return result.data;
};


export const validate = (schema: SchemaMap) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    try {
      if (schema.params) {
        req.params = validateSchema(schema.params, req.params);
      }

      if (schema.body) {
        req.body = validateSchema(schema.body, req.body);
      }


      if (schema.query) {
        req.query = validateSchema(schema.query, req.query);
      }

      next();
    } catch (error) {
      // if (error instanceof ZodError) {
      //   const message = error.issues.map((err) => err.message).join(", ");
      //   return next(new AppError(message, 400));
      // }
      next(error);
    }
  };
};

