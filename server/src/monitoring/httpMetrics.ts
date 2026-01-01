import { Request, Response, NextFunction } from "express";
import { httpRequestDuration } from "./metrics";

export function httpMetrics(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const route = (req.route && req.route.path) ? req.route.path : req.path;
    httpRequestDuration.observe(
      { method: req.method, route, status: String(res.statusCode) },
      Date.now() - start
    );
  });

  next();
}
