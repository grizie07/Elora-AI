import TopicProgress from "../models/TopicProgress.js";

function getStatusFromAccuracy(accuracy) {
  if (accuracy < 50) return "weak";
  if (accuracy < 75) return "moderate";
  return "strong";
}

function getTrend(previousAccuracy, newAccuracy) {
  if (newAccuracy > previousAccuracy) return "improving";
  if (newAccuracy < previousAccuracy) return "declining";
  return "stable";
}

export const updateTopicProgressFromAttempt = async (userId, answers) => {
  const grouped = {};

  for (const answer of answers) {
    const key = `${answer.subject}__${answer.chapter}__${answer.topic}__${answer.subtopic}`;

    if (!grouped[key]) {
      grouped[key] = {
        subject: answer.subject,
        chapter: answer.chapter || "",
        topic: answer.topic,
        subtopic: answer.subtopic || "",
        total: 0,
        correct: 0,
        wrong: 0,
        totalTime: 0,
      };
    }

    grouped[key].total += 1;
    grouped[key].totalTime += Number(answer.timeTakenSeconds || 0);

    if (answer.isCorrect) {
      grouped[key].correct += 1;
    } else {
      grouped[key].wrong += 1;
    }
  }

  const weakTopicsDetected = [];
  const strongTopicsDetected = [];

  for (const key of Object.keys(grouped)) {
    const item = grouped[key];

    const currentAccuracy =
      item.total > 0 ? (item.correct / item.total) * 100 : 0;

    const existing = await TopicProgress.findOne({
      userId,
      subject: item.subject,
      chapter: item.chapter,
      topic: item.topic,
      subtopic: item.subtopic,
    });

    if (!existing) {
      const status = getStatusFromAccuracy(currentAccuracy);

      await TopicProgress.create({
        userId,
        subject: item.subject,
        chapter: item.chapter,
        topic: item.topic,
        subtopic: item.subtopic,
        masteryScore: currentAccuracy,
        accuracy: currentAccuracy,
        attemptsCount: item.total,
        correctCount: item.correct,
        wrongCount: item.wrong,
        averageTimeSeconds:
          item.total > 0 ? item.totalTime / item.total : 0,
        status,
        lastPracticedAt: new Date(),
        improvementTrend: "stable",
      });

      if (status === "weak") weakTopicsDetected.push(item.topic);
      if (status === "strong") strongTopicsDetected.push(item.topic);

      continue;
    }

    const previousAccuracy = existing.accuracy || 0;

    const newAttemptsCount = existing.attemptsCount + item.total;
    const newCorrectCount = existing.correctCount + item.correct;
    const newWrongCount = existing.wrongCount + item.wrong;

    const newAccuracy =
      newAttemptsCount > 0 ? (newCorrectCount / newAttemptsCount) * 100 : 0;

    const newAverageTimeSeconds =
      newAttemptsCount > 0
        ? (existing.averageTimeSeconds * existing.attemptsCount + item.totalTime) /
          newAttemptsCount
        : 0;

    const newStatus = getStatusFromAccuracy(newAccuracy);
    const newTrend = getTrend(previousAccuracy, newAccuracy);

    existing.masteryScore = newAccuracy;
    existing.accuracy = newAccuracy;
    existing.attemptsCount = newAttemptsCount;
    existing.correctCount = newCorrectCount;
    existing.wrongCount = newWrongCount;
    existing.averageTimeSeconds = newAverageTimeSeconds;
    existing.status = newStatus;
    existing.lastPracticedAt = new Date();
    existing.improvementTrend = newTrend;

    await existing.save();

    if (newStatus === "weak") weakTopicsDetected.push(item.topic);
    if (newStatus === "strong") strongTopicsDetected.push(item.topic);
  }

  return {
    weakTopicsDetected: [...new Set(weakTopicsDetected)],
    strongTopicsDetected: [...new Set(strongTopicsDetected)],
  };
};