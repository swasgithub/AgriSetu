// routes/orderRoutes.js

import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getSupplierOrders,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only — all orders platform-wide (must be before /:id)
router.get("/all", protect, authorize("admin"), getAllOrders);

// Only farmers create orders
router.post("/", protect, authorize("farmer"), createOrder);

router.get("/my", protect, getMyOrders);
router.get("/supplier", protect, authorize("supplier"), getSupplierOrders);
router.get("/:id", protect, getOrderById);

// Admin or supplier can update order status
router.put("/:id/status", protect, authorize("admin", "supplier"), updateOrderStatus);

export default router;