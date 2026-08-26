import express from "express";
import { getPlatformSummary } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/analytics/summary — admin only
router.get("/summary", protect, authorize("admin"), getPlatformSummary);

export default router;
