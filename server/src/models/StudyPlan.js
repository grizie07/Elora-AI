import mongoose from "mongoose";

const daySessionSchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g. "Monday"
  date: { type: String },
  subject: { type: String, default: "" },
  topic: { type: String, required: true },
  durationMinutes: { type: Number, default: 45 },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
});

const studyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    examDate: { type: String },
    daysUntilExam: { type: Number },
    weeklyPlan: [daySessionSchema],
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);
export default StudyPlan;
