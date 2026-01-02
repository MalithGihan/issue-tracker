import type { ZodError } from "zod";

export function firstZodError(err: ZodError) {
  return err.issues[0]?.message || "Invalid input";
}
