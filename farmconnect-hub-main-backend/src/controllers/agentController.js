import Agent from "../models/agents.js";

// GET /api/agents  — public, get all visible agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isVisible: true });
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};

// GET /api/agents/:id  — public
export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/agents  — admin only
export const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/agents/:id  — admin only
export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/agents/:id  — admin only
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.status(200).json({ message: "Agent deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};