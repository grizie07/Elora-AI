import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createChat,
  getMyChats,
  getChatMessages,
  sendMessage,
  getProcessedMaterialsForChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/me", protect, getMyChats);
router.get("/materials/processed", protect, getProcessedMaterialsForChat);
router.post("/", protect, createChat);
router.get("/:id/messages", protect, getChatMessages);
router.post("/:id/messages", protect, sendMessage);

export default router;