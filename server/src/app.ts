import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { applySecurity } from "./middleware/security";
import { notFound, errorHandler } from "./middleware/error";
import apiRouter from "./routes";
import { csrfGuard } from "./middleware/csrf";
import { httpMetrics } from "./monitoring/httpMetrics";
import { metricsText } from "./monitoring/metrics";

const app = express();


const allowedOrigins = String(env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); 

app.use(express.json());
app.use(cookieParser());

applySecurity(app);
app.use(httpMetrics);

app.use(csrfGuard);

app.use("/api/v1", apiRouter);

app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));

app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", "text/plain; version=0.0.4");
  res.send(await metricsText());
});

app.use(notFound);
app.use(errorHandler);

export default app;
