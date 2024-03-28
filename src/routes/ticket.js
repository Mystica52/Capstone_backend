import express from "express";
import path from "path";
import { initiatePaymentAndCompleteBooking } from "../controllers/booking.controller.js";

const router = express.Router();

// Route to initiate payment
router.post("/payment", initiatePaymentAndCompleteBooking);

// Route to serve success HTML page
router.get("/success", (req, res) => {
  // Retrieve ticket information from query parameters
  const { busId, userId } = req.query;
  // Assuming you have a success.html file that expects busId and userId
  res.sendFile("success.html", {
    root: path.join(process.cwd(), "src", "views"),
    query: { busId, userId },
  });
});

// Route to serve failure HTML page
router.get("/failure", (req, res) => {
  res.sendFile("failure.html", {
    root: path.join(process.cwd(), "src", "views"),
  });
});

export default router;
