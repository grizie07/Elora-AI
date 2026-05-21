import express from "express";
import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  uploadMaterial,
  getMyMaterials,
  deleteMaterial,
  reprocessMaterial,
} from "../controllers/material.controller.js";

const router = express.Router();

router.get("/me", protect, getMyMaterials);
router.post("/", protect, upload.single("file"), uploadMaterial);
router.post("/:id/reprocess", protect, reprocessMaterial);
router.delete("/:id", protect, deleteMaterial);

export default router;