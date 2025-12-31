import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { applySecurity } from "./middleware/security";
import { notFound, errorHandler } from "./middleware/error";
import apiRouter from "./routes";

const app = express();

applySecurity(app); // includes helmet + rate limit + sanitize + hpp + logging
app.use(express.json());
app.use(cookieParser());

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

app.use(notFound);
app.use(errorHandler);

export default app;
