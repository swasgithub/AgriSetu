import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = await Order.create({
      user: req.user.id,   // 🔥 VERY IMPORTANT
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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