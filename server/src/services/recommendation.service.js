import Recommendation from "../models/Recommendation.js";

export const generateRecommendationsFromWeakTopics = async (
  userId,
  weakTopics = [],
  subject = ""
) => {
  if (!weakTopics.length) return [];

  const recommendations = [];

  for (const topic of weakTopics) {
    recommendations.push({
      userId,
      type: "quiz",
      subject,
      topic,
      title: `Practice ${topic}`,
      message: `You need more practice in ${topic}. Start with an easy-level quiz and revise the concept before moving to medium difficulty.`,
      priority: "high",
      status: "pending",
    });

    recommendations.push({
      userId,
      type: "tip",
      subject,
      topic,
      title: `Tip for ${topic}`,
      message: `Your recent performance shows difficulty in ${topic}. Focus on step-by-step solving, review examples, and practice simpler questions first.`,
      priority: "medium",
      status: "pending",
    });
  }

  const inserted = await Recommendation.insertMany(recommendations);
  return inserted;
};