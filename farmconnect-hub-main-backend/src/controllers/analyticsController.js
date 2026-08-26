import User from "../models/user.js";
import Product from "../models/product.js";
import Machine from "../models/machine.js";
import Order from "../models/order.js";
import Rent from "../models/rent.js";
import Agent from "../models/agents.js";
import AgentPurchase from "../models/agentPurchase.js";

// GET /api/analytics/summary — admin only
// Returns a single aggregated snapshot of the entire platform
export const getPlatformSummary = async (req, res) => {
  try {
    // --- USER COUNTS ---
    const allUsers = await User.find().select("role createdAt");
    const totalUsers     = allUsers.length;
    const totalFarmers   = allUsers.filter(u => u.role === "farmer").length;
    const totalSuppliers = allUsers.filter(u => u.role === "supplier").length;
    const totalOwners    = allUsers.filter(u => u.role === "equipment_owner").length;

    // --- PRODUCT & MACHINE COUNTS ---
    const totalProducts = await Product.countDocuments();
    const totalMachines = await Machine.countDocuments();

    // --- ORDER STATS ---
    const orders = await Order.find().select("totalAmount status createdAt");
    const totalOrders        = orders.length;
    const totalOrderRevenue  = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders      = orders.filter(o => o.status === "pending").length;
    const deliveredOrders    = orders.filter(o => o.status === "delivered").length;

    // --- RENTAL STATS ---
    const rentals = await Rent.find().select("totalAmount status createdAt");
    const totalRentals       = rentals.length;
    const totalRentalRevenue = rentals
      .filter(r => r.status === "approved" || r.status === "completed")
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const pendingRentals     = rentals.filter(r => r.status === "pending").length;

    // --- AI AGENT STATS ---
    const activeAgents        = await Agent.countDocuments({ isVisible: true });
    const totalAgentPurchases = await AgentPurchase.countDocuments();

    // --- MONTHLY ORDERS (last 6 months for chart) ---
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentOrders = await Order.find({ createdAt: { $gte: sixMonthsAgo } })
      .select("totalAmount createdAt");

    // Build month-by-month buckets
    const monthlyMap = {};
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[key] = { orders: 0, revenue: 0 };
    }
    recentOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyMap[key]) {
        monthlyMap[key].orders  += 1;
        monthlyMap[key].revenue += o.totalAmount || 0;
      }
    });

    // Convert to sorted array for recharts
    const monthlyData = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        orders:  data.orders,
        revenue: Math.round(data.revenue),
      }));

    // --- RECENT REGISTRATIONS (last 30 days) ---
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = allUsers.filter(u => new Date(u.createdAt) >= thirtyDaysAgo).length;

    res.json({
      users: {
        total:     totalUsers,
        farmers:   totalFarmers,
        suppliers: totalSuppliers,
        owners:    totalOwners,
        newLast30Days: recentUsers,
      },
      products: {
        total: totalProducts,
      },
      machines: {
        total: totalMachines,
      },
      orders: {
        total:    totalOrders,
        pending:  pendingOrders,
        delivered: deliveredOrders,
        revenue:  Math.round(totalOrderRevenue),
      },
      rentals: {
        total:   totalRentals,
        pending: pendingRentals,
        revenue: Math.round(totalRentalRevenue),
      },
      agents: {
        active:   activeAgents,
        purchases: totalAgentPurchases,
      },
      totalRevenue: Math.round(totalOrderRevenue + totalRentalRevenue),
      monthlyData,
    });
  } catch (error) {
    console.error("Analytics error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
