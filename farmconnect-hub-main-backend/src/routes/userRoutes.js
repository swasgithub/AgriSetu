import express from "express";
import { getMe,getAllUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/me", protect, getMe);
router.get("/", protect, getAllUsers);
export default router;