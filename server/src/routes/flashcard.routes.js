import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  generateFlashcards,
  getMyFlashcards,
  updateFlashcardStatus,
  deleteFlashcard,
} from "../controllers/flashcard.controller.js";

const router = express.Router();

router.post("/generate", protect, generateFlashcards);
router.get("/me", protect, getMyFlashcards);
router.patch("/:id/status", protect, updateFlashcardStatus);
router.delete("/:id", protect, deleteFlashcard);

export default router;
