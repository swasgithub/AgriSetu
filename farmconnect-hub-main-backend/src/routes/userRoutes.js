import express from "express";
import { getMe, getAllUsers, deleteUser, updateUserRole } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Any logged-in user can get their own profile
router.get("/me", protect, getMe);

// Admin only — view all users
router.get("/", protect, authorize("admin"), getAllUsers);

// Admin only — delete a user
router.delete("/:id", protect, authorize("admin"), deleteUser);

// Admin only — change a user's role
router.put("/:id/role", protect, authorize("admin"), updateUserRole);

export default router;