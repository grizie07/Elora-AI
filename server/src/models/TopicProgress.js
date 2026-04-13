import mongoose from "mongoose";

const topicProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    masteryScore: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    attemptsCount: {
      type: Number,
      default: 0,
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
    },

    averageTimeSeconds: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["weak", "moderate", "strong"],
      default: "weak",
    },

    lastPracticedAt: {
      type: Date,
      default: null,
    },

    improvementTrend: {
      type: String,
      enum: ["improving", "stable", "declining"],
      default: "stable",
    },
  },
  {
    timestamps: true,
  }
);

topicProgressSchema.index(
  { userId: 1, subject: 1, topic: 1, subtopic: 1 },
  { unique: true }
);

const TopicProgress = mongoose.model("TopicProgress", topicProgressSchema);

export default TopicProgress;