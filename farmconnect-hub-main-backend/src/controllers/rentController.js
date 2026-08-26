import Rent from "../models/rent.js";
import Machine from "../models/machine.js";

export const createRent = async (req, res) => {
  try {
    const { machineId, startDate, endDate } = req.body;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // Prevent renting own machine
    if (machine.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot rent your own machine" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Invalid date check
    if (end < start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const totalAmount = days * machine.pricePerDay;

    const rent = await Rent.create({
      machine: machineId,
      user: req.user._id,
      owner: machine.owner,
      startDate: start,
      endDate: end,
      totalDays: days,
      totalAmount,
      status: "pending" // important for lifecycle
    });

    res.status(201).json(rent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY RENTALS (Farmer)
export const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rent.find({ user: req.user.id })
      .populate("machine")
      .populate("owner", "name");

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET OWNER RENTALS (Equipment Owner)
export const getOwnerRentals = async (req, res) => {
  try {
    const rentals = await Rent.find({ owner: req.user._id })
      .populate("machine")
      .populate("user", "name");

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE RENT STATUS
export const updateRentStatus = async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.id);

    if (!rent) {
      return res.status(404).json({ message: "Rent not found" });
    }

    rent.status = req.body.status || rent.status;

    const updated = await rent.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/rentals/all — admin only
// Returns every rental on the platform with machine, renter, and owner details
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rent.find()
      .populate("machine", "name type pricePerDay image")
      .populate("user", "name email phone village district")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

