import Bus from "../models/bus.js";

export const Addbus = async (req, res) => {
  const {
    plateNo,
    origin,
    destination,
    date,
    departure_time,
    available_seats,
    price,
  } = req.body;
  try {
    // Check if there's already a bus with the same origin, destination, and departure time
    const existingBus = await Bus.findOne({
      origin: origin,
      destination: destination,
      date: date,
      departure_time: departure_time,
    });

    if (existingBus) {
      return res.status(400).json({
        success: false,
        error:
          "Another bus already exists with the same origin, destination, and departure time.",
      });
    }

    const newBus = await Bus.create({
      plateNo,
      origin,
      destination,
      date,
      departure_time,
      available_seats,
      price,
    });

    return res.status(201).json({
      success: true,
      message: "Bus created successfully",
      bus: newBus,
    });
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

export const getAllRoutes = async (req, res) => {
  try {
    const allRoutes = await Bus.aggregate([
      {
        $group: {
          _id: { origin: "$origin", destination: "$destination" },
        },
      },
      {
        $project: {
          _id: 0,
          origin: "$_id.origin",
          destination: "$_id.destination",
        },
      },
    ]);

    return res.status(200).json({ success: true, routes: allRoutes });
  } catch (error) {
    console.log("Error while getting all routes", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getBusesByRoute = async (req, res) => {
  const { origin, destination } = req.query;
  try {
    const busesOnRoute = await Bus.find({
      origin: origin,
      destination: destination,
    });
    if (!busesOnRoute || busesOnRoute.length === 0) {
      return res.status(404).json({
        error: "No bus(es) found",
      });
    }
    return res.status(200).json({
      success: true,
      buses: busesOnRoute,
    });
  } catch (error) {
    console.log("Error while getting buses by route", error);
    return res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
};
