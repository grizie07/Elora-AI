import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getMyAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/me", protect, getMyAnalytics);

export default router;
