import mongoose from "mongoose";

const agentPurchaseSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentType: {
      type: String,
      required: true,
      enum: ["soil", "weather", "disease", "irrigation", "market", "pest"],
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    deviceId: {
      type: String,
      default: null,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const AgentPurchase = mongoose.model("AgentPurchase", agentPurchaseSchema);

export default AgentPurchase;