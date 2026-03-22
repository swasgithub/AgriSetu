import express from "express";
import { getProducts, getProductById , createProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);        // /api/products
router.get("/:id", getProductById);  // /api/products/:id

router.post("/", createProduct);

export default router;