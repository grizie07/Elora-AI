import mongoose from "mongoose";

const questionAttemptSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: String,
      default: "",
      trim: true,
    },

    correctAnswer: {
      type: String,
      default: "",
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    chapter: {
      type: String,
      default: "",
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    subtopic: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalQuestions: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    totalTimeSeconds: {
      type: Number,
      default: 0,
    },

    answers: {
      type: [questionAttemptSchema],
      default: [],
    },

    weakTopicsDetected: {
      type: [String],
      default: [],
    },

    strongTopicsDetected: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;