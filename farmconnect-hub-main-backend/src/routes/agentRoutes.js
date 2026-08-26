import express from "express";
import {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../controllers/agentController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — anyone can view agents
router.get("/", getAllAgents);
router.get("/:id", getAgentById);

// Admin only — create, update, delete agents
router.post("/", protect, authorize("admin"), createAgent);
router.put("/:id", protect, authorize("admin"), updateAgent);
router.delete("/:id", protect, authorize("admin"), deleteAgent);

export default router;