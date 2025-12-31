import jwt from "jsonwebtoken";

export function signAccessToken(payload: object) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is missing");
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

export function verifyAccessToken(token: string) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is missing");
  return jwt.verify(token, secret) as any;
}
