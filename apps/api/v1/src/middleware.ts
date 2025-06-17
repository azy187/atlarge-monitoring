import { Request, Response, NextFunction } from "express";

export interface ServerError extends Error {
  status?: number;
}

export const errorHandler = (
  err: ServerError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
