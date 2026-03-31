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
      supplier: req.user.id 
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Create Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};