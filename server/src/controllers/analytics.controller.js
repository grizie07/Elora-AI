import TopicProgress from "../models/TopicProgress.js";
import QuizAttempt from "../models/QuizAttempt.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Topic-by-topic breakdown from TopicProgress
  const topics = await TopicProgress.find({ userId }).sort({ accuracy: 1 });

  // Quiz attempt summary
  const attempts = await QuizAttempt.find({ userId });
  const totalAttempts = attempts.length;
  const avgAccuracy =
    totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / totalAttempts
      : 0;

  const topicBreakdown = topics.map((t) => ({
    _id: t._id,
    topic: t.topic,
    subject: t.subject || "",
    chapter: t.chapter || "",
    accuracy: t.accuracy || 0,
    attempts: t.attempts || 0,
    status: t.status || "weak",
  }));

  return res.status(200).json({
    success: true,
    data: {
      summary: {
        totalAttempts,
        avgAccuracy: parseFloat(avgAccuracy.toFixed(2)),
        topicsTracked: topics.length,
      },
      topicBreakdown,
    },
  });
});
