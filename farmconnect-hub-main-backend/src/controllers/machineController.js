import Machine from "../models/machine.js";

// CREATE MACHINE (Equipment Owner)
export const createMachine = async (req, res) => {
  try {
    const machine = await Machine.create({
      ...req.body,
      owner: req.user.id, // from auth middleware
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MACHINES
export const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate("owner", "name email");
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE MACHINE
export const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate("owner", "name");

    if (!machine) return res.status(404).json({ message: "Machine not found" });

    res.json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MACHINE
export const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MACHINE
export const deleteMachine = async (req, res) => {
  try {
    await Machine.findByIdAndDelete(req.params.id);
    res.json({ message: "Machine deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};