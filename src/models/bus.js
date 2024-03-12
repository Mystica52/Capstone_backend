import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  plateNo: {
    type: String,
    required: true,
  },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  available_seats: { type: Number, required: true },
  price: { type: Number, required: true },
});

const Bus = mongoose.model("Bus", busSchema);

export default Bus;
