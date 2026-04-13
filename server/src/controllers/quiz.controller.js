import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import TopicProgress from "../models/TopicProgress.js";
import { updateTopicProgressFromAttempt } from "../services/progress.service.js";
import { generateRecommendationsFromWeakTopics } from "../services/recommendation.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const createQuestion = asyncHandler(async (req, res) => {
  const {
    questionText,
    questionType,
    options,
    correctAnswer,
    explanation,
    subject,
    chapter,
    topic,
    subtopic,
    difficulty,
    sourceType,
    materialId,
  } = req.body;

  const question = await Question.create({
    questionText,
    questionType,
    options,
    correctAnswer,
    explanation,
    subject,
    chapter,
    topic,
    subtopic,
    difficulty,
    sourceType,
    materialId,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Question created successfully",
    data: question,
  });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const {
    title,
    subject,
    topicsCovered,
    difficulty,
    questionIds,
    sourceType,
  } = req.body;

  const quiz = await Quiz.create({
    userId: req.user._id,
    title,
    subject,
    topicsCovered,
    difficulty,
    questionIds,
    sourceType,
    totalQuestions: questionIds.length,
  });

  return res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    data: quiz,
  });
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate("questionIds");

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  return res.status(200).json({
    success: true,
    data: quiz,
  });
});

export const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { quizId, answers, totalTimeSeconds } = req.body;

  const totalQuestions = answers.length;
  const score = answers.filter((a) => a.isCorrect).length;
  const accuracy = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  const progressResult = await updateTopicProgressFromAttempt(
    req.user._id,
    answers
  );

  const attempt = await QuizAttempt.create({
    userId: req.user._id,
    quizId,
    score,
    totalQuestions,
    accuracy,
    totalTimeSeconds,
    answers,
    weakTopicsDetected: progressResult.weakTopicsDetected,
    strongTopicsDetected: progressResult.strongTopicsDetected,
  });

  const firstSubject = answers[0]?.subject || "";

  const recommendations = await generateRecommendationsFromWeakTopics(
    req.user._id,
    progressResult.weakTopicsDetected,
    firstSubject
  );

  return res.status(201).json({
    success: true,
    message: "Quiz submitted successfully",
    data: {
      attempt,
      weakTopicsDetected: progressResult.weakTopicsDetected,
      strongTopicsDetected: progressResult.strongTopicsDetected,
      recommendations,
    },
  });
});

export const getMyTopicProgress = asyncHandler(async (req, res) => {
  const progress = await TopicProgress.find({ userId: req.user._id }).sort({
    subject: 1,
    topic: 1,
  });

  return res.status(200).json({
    success: true,
    data: progress,
  });
});
export const getMyQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    data: questions,
  });
});

export const getMyQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    data: quizzes,
  });
});