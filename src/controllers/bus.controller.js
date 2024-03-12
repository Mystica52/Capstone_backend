import Bus from "../models/bus.js";

export const Addbus = async (req, res, next) => {
  let bus = await new Bus({
    plateNo: req.body.plateNo,
    origin: req.body.origin,
    destination: req.body.destination,
    date: req.body.date,
    departure_time: req.body.departure_time,
    arrival_time: req.body.arrival_time,
    available_seats: req.body.available_seats,
    price: req.body.price,
  });

  bus
    .save()
    .then((bus) => {
      res.status(200).json({
        message: "Bus added!!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};
