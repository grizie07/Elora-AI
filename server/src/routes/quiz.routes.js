import express from "express";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createQuestion,
  createQuiz,
  getQuizById,
  submitQuizAttempt,
  getMyTopicProgress,
  getMyQuestions,
  getMyQuizzes,
} from "../controllers/quiz.controller.js";
import {
  createQuestionSchema,
  createQuizSchema,
  submitQuizAttemptSchema,
} from "../validators/quiz.validator.js";

const router = express.Router();

router.get("/questions/me", protect, getMyQuestions);
router.get("/me", protect, getMyQuizzes);
router.get("/progress/me", protect, getMyTopicProgress);

router.post(
  "/questions",
  protect,
  validate(createQuestionSchema),
  createQuestion
);

router.post(
  "/attempts",
  protect,
  validate(submitQuizAttemptSchema),
  submitQuizAttempt
);

router.post(
  "/",
  protect,
  validate(createQuizSchema),
  createQuiz
);

router.get("/:id", protect, getQuizById);

export default router;