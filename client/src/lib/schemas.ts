import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema; // same rules for now

export const issueSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title too long"),
  description: z.string().trim().min(5, "Description must be at least 5 characters").max(4000, "Description too long"),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const issueCreateSchema = issueSchema.pick({
  title: true,
  description: true,
  priority: true,
});

export const issueUpdateSchema = issueSchema.pick({
  title: true,
  description: true,
  status: true,
  priority: true,
});
