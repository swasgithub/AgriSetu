import express from "express";
import { getProducts, getProductById , createProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getProducts);        // /api/products
router.get("/:id", getProductById);  // /api/products/:id

router.post("/",protect, createProduct);

export default router;