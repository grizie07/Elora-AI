import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import TopicProgress from "../models/TopicProgress.js";
import Recommendation from "../models/Recommendation.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalQuizAttempts = await QuizAttempt.countDocuments({ userId });

    const recentAttempts = await QuizAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("quizId", "title subject difficulty");

    const topicProgress = await TopicProgress.find({ userId }).sort({
      accuracy: 1,
    });

    const weakTopics = topicProgress
      .filter((item) => item.status === "weak")
      .slice(0, 5);

    const strongTopics = topicProgress
      .filter((item) => item.status === "strong")
      .slice(0, 5);

    const pendingRecommendations = await Recommendation.find({
      userId,
      status: "pending",
    })
      .sort({ createdAt: -1 })
      .limit(6);

    const avgAccuracyAgg = await QuizAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          avgAccuracy: { $avg: "$accuracy" },
        },
      },
    ]);

    const averageAccuracy =
      avgAccuracyAgg.length > 0 ? avgAccuracyAgg[0].avgAccuracy : 0;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          course: req.user.course,
          year: req.user.year,
          studyGoals: req.user.studyGoals,
          examDate: req.user.examDate,
        },
        summary: {
          totalQuizAttempts,
          averageAccuracy: Number(averageAccuracy.toFixed(2)),
          weakTopicsCount: weakTopics.length,
          strongTopicsCount: strongTopics.length,
          pendingRecommendationsCount: pendingRecommendations.length,
        },
        weakTopics,
        strongTopics,
        recommendations: pendingRecommendations,
        recentAttempts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard",
      error: error.message,
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalQuizzes = await Quiz.countDocuments();
    const totalQuizAttempts = await QuizAttempt.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();

    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentQuizAttempts = await QuizAttempt.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .populate("quizId", "title subject difficulty");

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalStudents,
          totalAdmins,
          totalQuizzes,
          totalQuizAttempts,
          totalRecommendations,
        },
        recentUsers,
        recentQuizAttempts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard",
      error: error.message,
    });
  }
};