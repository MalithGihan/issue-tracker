import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res, _next, options) => {
    const resetTimeMs =
      (req as any).rateLimit?.resetTime?.getTime?.() ?? Date.now() + 60_000;

    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((resetTimeMs - Date.now()) / 1000)
    );

    res.setHeader("Retry-After", String(retryAfterSeconds));
    return res.status(options.statusCode).json({
      error: "Too many login attempts. Please try again later.",
      retryAfterSeconds,
    });
  },
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
