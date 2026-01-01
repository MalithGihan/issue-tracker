import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";

export type AuthedRequest = Request & { userId?: string };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
