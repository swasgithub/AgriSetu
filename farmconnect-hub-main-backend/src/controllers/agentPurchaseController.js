import AgentPurchase from "../models/agentPurchase.js";

// POST /api/agent-purchases
// Farmer buys an agent kit
export const buyAgent = async (req, res) => {
  try {
    const { agentType } = req.body;
    const farmerId = req.user._id; // from auth middleware

    // Check if farmer already bought this agent
    const existing = await AgentPurchase.findOne({
      farmer: farmerId,
      agentType,
    });

    if (existing) {
      return res.status(400).json({ message: "You already own this agent kit" });
    }

    const purchase = await AgentPurchase.create({
      farmer: farmerId,
      agentType,
      status: "pending",
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/agent-purchases/my
// Get all agent purchases for logged in farmer
export const getMyAgentPurchases = async (req, res) => {
  try {
    const purchases = await AgentPurchase.find({ farmer: req.user._id });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/agent-purchases/all   (admin only)
// Get all purchases across all farmers
export const getAllAgentPurchases = async (req, res) => {
  try {
    const purchases = await AgentPurchase.find()
      .populate("farmer", "name email phone"); // pulls farmer name/email/phone from User
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/agent-purchases/:id/activate   (admin only)
// Admin activates an agent after device is shipped
export const activateAgent = async (req, res) => {
  try {
    const { deviceId } = req.body;

    const purchase = await AgentPurchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    purchase.status = "active";
    purchase.deviceId = deviceId || null;

    await purchase.save();

    res.status(200).json({ message: "Agent activated", purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/agent-purchases/:id   (admin only)
// Remove a purchase record
export const deleteAgentPurchase = async (req, res) => {
  try {
    const purchase = await AgentPurchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    await purchase.deleteOne();
    res.status(200).json({ message: "Purchase deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};