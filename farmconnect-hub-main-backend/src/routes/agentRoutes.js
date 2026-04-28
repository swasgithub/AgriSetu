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

// Public
router.get("/", getAllAgents);
router.get("/:id", getAgentById);


router.post("/", createAgent);
router.put("/:id", updateAgent);
router.delete("/:id", deleteAgent);

export default router;