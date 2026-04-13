import { z } from "zod";

export const createMaterialMetadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters long"),

  subject: z.string().trim().optional().default(""),

  chapter: z.string().trim().optional().default(""),

  topic: z.string().trim().optional().default(""),

  description: z.string().trim().optional().default(""),
});