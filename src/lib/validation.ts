import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(8).max(20),
  ticketCategory: z.enum(["early_bird", "standard", "vip"]),
  organization: z.string().max(120).optional().or(z.literal("")),
  city: z.string().max(80).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const checkinSchema = z.object({
  token: z.string().min(8),
});
