import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    subject: { type: String, default: "" },
    topic: { type: String, default: "" },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    reviewStatus: { type: String, enum: ["new", "learning", "known"], default: "new" },
  },
  { timestamps: true }
);

const Flashcard = mongoose.model("Flashcard", flashcardSchema);
export default Flashcard;
