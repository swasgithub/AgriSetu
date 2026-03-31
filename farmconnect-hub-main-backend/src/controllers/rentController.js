import Rent from "../models/rent.js";
import Machine from "../models/machine.js";

// CREATE RENT (Farmer rents machine)
export const createRent = async (req, res) => {
  try {
    const { machineId, startDate, endDate } = req.body;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;

    const rent = await Rent.create({
      machine: machineId,
      user: req.user._id,
      owner: machine.owner,
      startDate,
      endDate,
      totalDays: days,
      totalAmount: days * machine.pricePerDay, 
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
    const rentals = await Rent.find({ owner: req.user.id })
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