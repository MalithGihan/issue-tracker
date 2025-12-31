import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.SERVER_PORT || 4000);
app.listen(port, () => console.log(`API running on :${port}`));
