import { z } from "zod";

// Zod validation schemas mirror our backend DTOs.
// Use these on every form submit and API write.

export const EventInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  type: z.enum(["Wedding", "Birthday", "Corporate", "Custom"]),
  date: z.string().min(1, "Pick a date"),
  location: z.string().min(2, "Location is required"),
  guests: z.number().int().min(2).max(10000),
  budget: z.number().min(100),
  style: z.enum(["Luxury", "Standard", "Budget"]).default("Standard"),
});

export const BookingInputSchema = z.object({
  vendorId: z.string(),
  vendorName: z.string(),
  category: z.string(),
  amount: z.number().min(1),
  date: z.string(),
  message: z.string().max(500).optional(),
});

export const GuestInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email("Valid email required"),
  phone: z.string().min(4),
  plusOne: z.boolean().default(false),
  table: z.string().default("-"),
});

export const ReviewInputSchema = z.object({
  bookingId: z.string(),
  vendorId: z.string(),
  vendorName: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(120),
  body: z.string().min(10).max(2000),
  photos: z.number().int().min(0).default(0),
});

export const InstallmentPlanSchema = z.object({
  bookingId: z.string(),
  totalAmount: z.number().min(50),
  months: z.union([z.literal(3), z.literal(6), z.literal(9), z.literal(12)]),
  depositPct: z.number().min(0).max(50).default(20),
});

export type EventInputDTO = z.infer<typeof EventInputSchema>;
export type BookingInputDTO = z.infer<typeof BookingInputSchema>;
export type GuestInputDTO = z.infer<typeof GuestInputSchema>;
export type ReviewInputDTO = z.infer<typeof ReviewInputSchema>;
export type InstallmentPlanDTO = z.infer<typeof InstallmentPlanSchema>;
