import { Request, Response, NextFunction } from "express";
import AppError from "../errors/app-error";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = statusCode === 500 ? "Произошла ошибка сервера" : err.message;

  res.status(statusCode).send({ message });
}
