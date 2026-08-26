import express from "express";
import {
  createRent,
  getMyRentals,
  getOwnerRentals,
  updateRentStatus,
  getAllRentals,
} from "../controllers/rentController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only — all rentals platform-wide (must be before /:id/status)
router.get("/all", protect, authorize("admin"), getAllRentals);

// Only farmers rent
router.post("/", protect, authorize("farmer"), createRent);

// Farmer view
router.get("/my", protect, authorize("farmer"), getMyRentals);

// Owner view
router.get("/owner", protect, authorize("equipment_owner"), getOwnerRentals);

// Owner or admin update status
router.put("/:id/status", protect, authorize("equipment_owner", "admin"), updateRentStatus);

export default router;