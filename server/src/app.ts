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

applySecurity(app); // includes helmet + rate limit + sanitize + hpp + logging
app.use(httpMetrics);
app.use(express.json());
app.use(cookieParser());
app.use(csrfGuard);


app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// Versioned API base
app.use("/api", apiRouter);

// Keep health simple
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// System real monitoring
app.get("/metrics", async (_req, res) => {
  res.set("Content-Type", "text/plain; version=0.0.4");
  res.send(await metricsText());
});


app.use(notFound);
app.use(errorHandler);

export default app;
