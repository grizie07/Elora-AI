import Flashcard from "../models/Flashcard.js";
import Material from "../models/Material.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import path from "path";

// Generate flashcards from a material via AI service
export const generateFlashcards = asyncHandler(async (req, res) => {
  const { materialId } = req.body;
  if (!materialId) throw new AppError("materialId is required", 400);

  const material = await Material.findOne({ _id: materialId, userId: req.user._id });
  if (!material) throw new AppError("Material not found", 404);
  if (material.processingStatus !== "processed")
    throw new AppError("Material must be processed first", 400);

  // Call AI service to generate flashcards
  const response = await fetch(`${process.env.AI_SERVICE_URL}/flashcards/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ materialId: material._id.toString() }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new AppError(`AI service error: ${err}`, 500);
  }

  const { flashcards: generated } = await response.json();

  // Upsert: delete old cards for this material, insert new
  await Flashcard.deleteMany({ materialId: material._id, userId: req.user._id });

  const docs = generated.map((fc) => ({
    userId: req.user._id,
    materialId: material._id,
    question: fc.question,
    answer: fc.answer,
    subject: material.subject || "",
    topic: material.topic || "",
    difficulty: fc.difficulty || "medium",
    reviewStatus: "new",
  }));

  const saved = await Flashcard.insertMany(docs);

  return res.status(201).json({
    success: true,
    message: `Generated ${saved.length} flashcards`,
    data: saved,
  });
});

// Get all flashcards for the logged-in user (optionally filter by materialId)
export const getMyFlashcards = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.materialId) filter.materialId = req.query.materialId;
  if (req.query.topic) filter.topic = req.query.topic;

  const flashcards = await Flashcard.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({ success: true, data: flashcards });
});

// Update review status (new → learning → known)
export const updateFlashcardStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["new", "learning", "known"];
  if (!allowed.includes(status))
    throw new AppError(`status must be one of: ${allowed.join(", ")}`, 400);

  const card = await Flashcard.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { reviewStatus: status },
    { new: true }
  );
  if (!card) throw new AppError("Flashcard not found", 404);

  return res.status(200).json({ success: true, data: card });
});

// Delete a flashcard
export const deleteFlashcard = asyncHandler(async (req, res) => {
  const card = await Flashcard.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!card) throw new AppError("Flashcard not found", 404);

  return res.status(200).json({ success: true, message: "Flashcard deleted" });
});
