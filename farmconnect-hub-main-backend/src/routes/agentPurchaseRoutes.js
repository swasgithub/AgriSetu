import express from "express";
import {
  buyAgent,
  getMyAgentPurchases,
  getAllAgentPurchases,
  activateAgent,
  deleteAgentPurchase,
} from "../controllers/agentPurchaseController.js";

import { protect, authorize } from "../middleware/authMiddleware.js"; // your existing auth middleware

const router = express.Router();

// Farmer routes (protected)
router.post("/", protect, buyAgent);
router.get("/my", protect, getMyAgentPurchases);

// Admin routes (admin only)
router.get("/all", protect, authorize("admin"), getAllAgentPurchases);
router.patch("/:id/activate", protect, authorize("admin"), activateAgent);
router.delete("/:id", protect, authorize("admin"), deleteAgentPurchase);

export default router;