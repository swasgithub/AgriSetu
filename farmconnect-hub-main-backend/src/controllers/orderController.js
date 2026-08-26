import Order from "../models/order.js";
import Product from "../models/product.js";
export const createOrder = async (req, res) => {
  const { items } = req.body;

  let subtotal = 0;

  const populatedItems = [];

  for (let item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
     
    }

    const itemTotal = product.price * item.quantity;

    subtotal += itemTotal;

    populatedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });
  }

  const gst = subtotal * 0.18;
  const totalAmount = subtotal + gst;

  const order = await Order.create({
    user: req.user._id,
    items: populatedItems,
    subtotal,
    gst,
    totalAmount
  });

  
  res.status(201).json(order);
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

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product");

  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order);
};

export const getSupplierOrders = async (req, res) => {
  try {
    const supplierProducts = await Product.find({ supplier: req.user._id });
    const productIds = supplierProducts.map(p => p._id);

    const orders = await Order.find({
      "items.product": { $in: productIds }
    }).populate("items.product").populate("user", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = req.body.status;
  await order.save();

  res.json(order);
};

// GET /api/orders/all — admin only
// Returns every order on the platform with farmer info and product details
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone village district role")
      .populate("items.product", "name category price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};