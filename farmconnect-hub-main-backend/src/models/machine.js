import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String, // Tractor, Harvester, Seeder etc.
      required: true,
    },
    description: {
      type: String,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },

    // 👤 Owner (Equipment Owner)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String, // URL
    },

    location: {
      village: String,
      district: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Machine", machineSchema);