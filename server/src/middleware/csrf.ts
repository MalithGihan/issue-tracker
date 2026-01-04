import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

// Only protect state-changing methods
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfGuard(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();

  // allow non-browser tools (Postman/curl) where Origin is missing
  const origin = req.headers.origin;
  if (!origin) return next();

  // only allow your frontend origin
  if (origin !== env.CLIENT_ORIGIN) {
    return res.status(403).json({ error: "CSRF blocked" });
  }

  return next();
}
