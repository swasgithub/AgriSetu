import Product from "../models/product.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log("Get Products Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description,image,unit,rating } = req.body;

    const product = await Product.create({
      image,
      name,
      price,
      category,
      description,
      unit,
      rating,
      supplier: req.user._id 
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Create Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // ✅ FIX HERE
    if (product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    console.log("Update Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product — supplier owns it, or admin can override
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Admin can delete any product; suppliers can only delete their own
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && product.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.log("Delete Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/products/all — admin only
// Returns all products with their supplier info
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("supplier", "name email phone district")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};