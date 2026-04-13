import express from "express";
import protect from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  getStudentDashboard,
  getAdminDashboard,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/student", protect, authorizeRoles("student"), getStudentDashboard);
router.get("/admin", protect, authorizeRoles("admin"), getAdminDashboard);

export default router;