import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Server-side log (keep full detail here)
  console.error(err);

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ error: "Validation error" });
  }

  // Mongo duplicate key (e.g., unique email)
  if (err?.code === 11000) {
    return res.status(409).json({ error: "Duplicate key" });
  }

  return res.status(500).json({ error: "Internal server error" });
}
