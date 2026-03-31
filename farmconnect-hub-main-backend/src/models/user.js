import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone:{
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    role : {
      type : String,
      enum: ["farmer", "supplier","equipment_owner", "admin"],
      default: "farmer",
      required:true
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
