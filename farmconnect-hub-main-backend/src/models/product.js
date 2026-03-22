// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  description: String,
  price: Number,
  category: String,
  
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;