// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
 name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Seeds", "Fertilizer", "Pesticide", "Tools"],
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=No+Image",
    },

    unit: {
      type: String,
      default: "unit", // kg, bag, liter etc
    },

    rating: {
      type: Number,
      default: 4.0,
    },
  
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;