import express from "express";
import {
  createRent,
  getMyRentals,
  getOwnerRentals,
  updateRentStatus,
} from "../controllers/rentController.js";

import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRent);
router.get("/my", protect, getMyRentals);
router.get("/owner", protect, getOwnerRentals);
router.put("/:id", protect, updateRentStatus);

export default router;