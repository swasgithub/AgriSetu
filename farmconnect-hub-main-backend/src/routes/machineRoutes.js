import express from "express";
import {
  createMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
} from "../controllers/machineController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createMachine);
router.get("/", getAllMachines);
router.get("/:id", getMachineById);
router.put("/:id", protect, updateMachine);
router.delete("/:id", protect, deleteMachine);

export default router;