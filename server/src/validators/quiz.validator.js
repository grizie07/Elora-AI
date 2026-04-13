import { z } from "zod";

export const createQuestionSchema = z.object({
  questionText: z
    .string()
    .trim()
    .min(5, "Question text must be at least 5 characters long"),

  questionType: z
    .enum(["mcq", "true_false", "short_answer", "fill_blank"])
    .optional()
    .default("mcq"),

  options: z.array(z.string().trim()).optional().default([]),

  correctAnswer: z
    .string()
    .trim()
    .min(1, "Correct answer is required"),

  explanation: z.string().trim().optional().default(""),

  subject: z
    .string()
    .trim()
    .min(1, "Subject is required"),

  chapter: z.string().trim().optional().default(""),

  topic: z
    .string()
    .trim()
    .min(1, "Topic is required"),

  subtopic: z.string().trim().optional().default(""),

  difficulty: z
    .enum(["easy", "medium", "hard"])
    .optional()
    .default("easy"),

  sourceType: z
    .enum(["manual", "ai_generated", "material_based"])
    .optional()
    .default("manual"),

  materialId: z.string().trim().optional().nullable(),
});

export const createQuizSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Quiz title must be at least 3 characters long"),

  subject: z.string().trim().optional().default(""),

  topicsCovered: z.array(z.string().trim()).optional().default([]),

  difficulty: z
    .enum(["easy", "medium", "hard", "mixed"])
    .optional()
    .default("mixed"),

  questionIds: z
    .array(z.string().trim().min(1))
    .min(1, "At least one questionId is required"),

  sourceType: z
    .enum(["topic_based", "material_based", "weakness_based", "mixed"])
    .optional()
    .default("topic_based"),
});

export const questionAttemptSchema = z.object({
  questionId: z.string().trim().min(1, "questionId is required"),

  selectedAnswer: z.string().trim().optional().default(""),

  correctAnswer: z.string().trim().optional().default(""),

  isCorrect: z.boolean(),

  subject: z.string().trim().min(1, "subject is required"),

  chapter: z.string().trim().optional().default(""),

  topic: z.string().trim().min(1, "topic is required"),

  subtopic: z.string().trim().optional().default(""),

  difficulty: z
    .enum(["easy", "medium", "hard"])
    .optional()
    .default("easy"),

  timeTakenSeconds: z.number().min(0).optional().default(0),
});

export const submitQuizAttemptSchema = z.object({
  quizId: z.string().trim().min(1, "quizId is required"),

  totalTimeSeconds: z.number().min(0).optional().default(0),

  answers: z
    .array(questionAttemptSchema)
    .min(1, "At least one answer is required"),
});