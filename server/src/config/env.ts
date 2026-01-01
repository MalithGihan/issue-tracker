import { z } from "zod";

const schema = z.object({
  SERVER_PORT: z.coerce.number().default(4000),
  REFRESH_DAYS: z.coerce.number().int().min(1).max(30).default(7),
  ACCESS_MINUTES: z.coerce.number().int().min(5).max(60).default(15),

  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  MONGO_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(20),
  JWT_REFRESH_SECRET: z.string().min(20),

  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
});

export const env = schema.parse(process.env);
