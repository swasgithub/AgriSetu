import Order from "../models/order.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product");

    res.status(200).json(orders);
  } catch (error) {
    console.log("Get Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};