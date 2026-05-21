import User from "../models/User.js";
import TopicProgress from "../models/TopicProgress.js";
import StudyPlan from "../models/StudyPlan.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function getDaysUntilExam(examDateStr) {
  if (!examDateStr || typeof examDateStr !== "string" || examDateStr.trim() === "") return 30;
  const exam = new Date(examDateStr);
  if (isNaN(exam.getTime())) return 30;
  const diff = Math.ceil((exam - new Date()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 7);
}

function buildWeeklyPlan(topics, daysUntilExam) {
  const weeksAvailable = Math.max(1, Math.floor(daysUntilExam / 7));
  const sessionsPerWeek = Math.min(7, Math.ceil(topics.length / weeksAvailable));

  // Sort: weak first, then moderate, then strong
  const sorted = [...topics].sort((a, b) => {
    const order = { weak: 0, moderate: 1, strong: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  const plan = [];
  const today = new Date();

  sorted.slice(0, 7).forEach((topic, i) => {
    const dayName = DAYS[i % 7];
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + i);

    plan.push({
      day: dayName,
      date: dayDate.toISOString().split("T")[0],
      subject: topic.subject || "",
      topic: topic.topic,
      durationMinutes: topic.status === "weak" ? 60 : topic.status === "moderate" ? 45 : 30,
      priority: topic.status === "weak" ? "high" : topic.status === "moderate" ? "medium" : "low",
      completed: false,
    });
  });

  // If fewer than 7 topics, fill remaining days with review sessions
  if (plan.length < 7 && sorted.length > 0) {
    for (let i = plan.length; i < 7; i++) {
      const topic = sorted[i % sorted.length];
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);
      plan.push({
        day: DAYS[i],
        date: dayDate.toISOString().split("T")[0],
        subject: topic.subject || "",
        topic: `Review: ${topic.topic}`,
        durationMinutes: 30,
        priority: "low",
        completed: false,
      });
    }
  }

  return plan;
}

// Generate or regenerate a study plan
export const generatePlan = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User not found", 404);

  const topics = await TopicProgress.find({ userId: req.user._id });

  // If no topics tracked yet, create a default plan from studyGoals
  const planTopics =
    topics.length > 0
      ? topics
      : [{ topic: user.studyGoals || "General Revision", subject: user.course || "", status: "weak" }];

  const daysUntilExam = getDaysUntilExam(user.examDate);
  const weeklyPlan = buildWeeklyPlan(planTopics, daysUntilExam);

  const plan = await StudyPlan.findOneAndUpdate(
    { userId: req.user._id },
    {
      userId: req.user._id,
      examDate: user.examDate || null,
      daysUntilExam,
      weeklyPlan,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return res.status(200).json({ success: true, data: plan });
});

// Get existing plan
export const getMyPlan = asyncHandler(async (req, res) => {
  const plan = await StudyPlan.findOne({ userId: req.user._id });
  return res.status(200).json({ success: true, data: plan || null });
});

// Mark a session complete
export const markSessionCompleted = asyncHandler(async (req, res) => {
  const plan = await StudyPlan.findOne({ userId: req.user._id });
  if (!plan) throw new AppError("No study plan found. Generate one first.", 404);

  const session = plan.weeklyPlan.id(req.params.sessionId);
  if (!session) throw new AppError("Session not found", 404);

  session.completed = !session.completed;
  await plan.save();

  return res.status(200).json({ success: true, data: plan });
});
