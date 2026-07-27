import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const catchAsync = <
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ) => Promise<unknown>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;