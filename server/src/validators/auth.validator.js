import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),

  course: z.string().trim().max(100).optional().default(""),

  year: z.string().trim().max(50).optional().default(""),

  preferredSubjects: z.array(z.string().trim()).optional().default([]),

  weakSubjects: z.array(z.string().trim()).optional().default([]),

  studyGoals: z.string().trim().max(500).optional().default(""),

  examDate: z.string().trim().max(50).optional().default(""),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});