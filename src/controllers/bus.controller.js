import Bus from "../models/bus.js";

export const Addbus = async (req, res) => {
  const {
    plateNo,
    origin,
    destination,
    date,
    departure_time,
    arrival_time,
    available_seats,
    price,
  } = req.body;
  try {
    const newBus = await Bus({
      plateNo,
      origin,
      destination,
      date,
      departure_time,
      arrival_time,
      available_seats,
      price,
    });
    await newBus.save();
    return res
      .status(201)
      .json({ message: "Bus created successfully", bus: newBus });
  } catch (error) {
    console.log("Error While adding bus", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getAllBuses = async (req, res) => {
  try {
    const allBuses = await Bus.find({});
    return res.status(200).json({ success: true, buses: allBuses });
  } catch (error) {
    console.log("Error While getting All buses", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getBusById = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        error: "Bus not found",
      });
    }
    return res.status(200).json({
      success: true,
      bus: bus,
    });
  } catch (error) {
    console.log("Error While adding bus", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const updateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const {
      plateNo,
      origin,
      destination,
      date,
      departure_time,
      arrival_time,
      available_seats,
      price,
    } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        error: "Bus not found",
      });
    }
    bus.plateNo = plateNo || bus.plateNo;
    bus.origin = origin || bus.origin;
    bus.destination = destination || bus.destination;
    bus.date = date || bus.date;
    bus.departure_time = departure_time || bus.departure_time;
    bus.arrival_time = arrival_time || bus.arrival_time;
    bus.available_seats = available_seats || bus.available_seats;
    bus.price = price || bus.price;
    const updatedBus = await bus.save();
    return res.status(200).json({
      success: true,
      updatedBus,
    });
  } catch (error) {
    console.log("Error While adding bus", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.statu(404).json({
        success: false,
        error: "Bus not found",
      });
    }
    await bus.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (error) {
    console.log("Error While adding bus", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
