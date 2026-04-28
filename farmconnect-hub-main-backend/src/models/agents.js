import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      unique: true,
      enum: ["soil", "weather", "disease", "irrigation", "market", "pest"],
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "Leaf",
    },
    color: {
      type: String,
      default: "leaf",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "warning", "inactive"],
      default: "active",
    },
    dashboardUrl: {
      type: String,
      default: "https://agrisetu-dashboard.onrender.com",
    },
    isVisible: {
      type: Boolean,
      default: true, // lets admin hide agents without deleting
    },
  },
  { timestamps: true }
);

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;