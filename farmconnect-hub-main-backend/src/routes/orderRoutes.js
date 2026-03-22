// routes/orderRoutes.js

import express from "express";
import { getMyOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyOrders);

export default router;