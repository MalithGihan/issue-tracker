/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Express } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import pinoHttp from "pino-http";
import pino from "pino";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";

const baseLoggerOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
    ],
    remove: true,
  },
};

const logger = (() => {
  if (isProd) return pino(baseLoggerOptions);

  const logDir = path.join(process.cwd(), "logs");
  fs.mkdirSync(logDir, { recursive: true });

  const logPath = path.join(logDir, "server.log");
  return pino(baseLoggerOptions, pino.destination({ dest: logPath, sync: true }));
})();

export function applySecurity(app: Express) {
  app.disable("x-powered-by");
  app.use(helmet());

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) =>
        (req.headers["x-request-id"] as string) || crypto.randomUUID(),
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "res.headers.set-cookie",
        ],
        remove: true,
      },
    })
  );

  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use(hpp());

  function hasMongoOps(v: any): boolean {
    if (!v || typeof v !== "object") return false;
    for (const [k, val] of Object.entries(v)) {
      if (k.startsWith("$") || k.includes(".")) return true;
      if (hasMongoOps(val)) return true;
    }
    return false;
  }

  app.use((req, res, next) => {
    if (
      hasMongoOps(req.body) ||
      hasMongoOps(req.params) ||
      hasMongoOps(req.query)
    ) {
      return res.status(400).json({ error: "Invalid keys" });
    }
    next();
  });
}
