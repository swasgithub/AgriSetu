import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import machineRoutes from "./routes/machineRoutes.js";
import rentRoutes from "./routes/rentRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import agentPurchaseRoutes from "./routes/agentPurchaseRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/rentals", rentRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/agent-purchases", agentPurchaseRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Something went wrong",
  });
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

