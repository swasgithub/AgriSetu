
import User from "../models/user.js";

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/ — admin only
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id — admin only
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent admin from deleting their own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id/role — admin only
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["farmer", "supplier", "equipment_owner", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};