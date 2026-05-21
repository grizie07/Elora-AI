import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  generatePlan,
  getMyPlan,
  markSessionCompleted,
} from "../controllers/planner.controller.js";

const router = express.Router();

router.post("/generate", protect, generatePlan);
router.get("/me", protect, getMyPlan);
router.patch("/:sessionId/complete", protect, markSessionCompleted);

export default router;
