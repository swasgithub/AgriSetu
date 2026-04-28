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

// Admin routes
router.get("/all", getAllAgentPurchases);
router.patch("/:id/activate",  activateAgent);
router.delete("/:id", deleteAgentPurchase);

export default router;