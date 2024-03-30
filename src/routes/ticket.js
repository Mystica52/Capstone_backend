import express from "express";
import Ticket from "../models/ticket.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Import fileURLToPath
import mongoose from "mongoose";
import {
  getTicketById,
  initiatePaymentAndCompleteBooking,
} from "../controllers/booking.controller.js";

const __filename = fileURLToPath(import.meta.url); // Get current file's path
const __dirname = path.dirname(__filename); // Get directory name

const router = express.Router();

// Route to initiate payment
router.post("/payment", initiatePaymentAndCompleteBooking);

// Serve static HTML files for success and failure routes
router.get("/success", (req, res) => {
  res.sendFile("success.html", {
    root: path.join(process.cwd(), "src", "views"),
  });
});

router.get("/failure", (req, res) => {
  res.sendFile("failure.html", {
    root: path.join(process.cwd(), "src", "views"),
  });
});

// Serve ticket.html file when accessing "/ticket.html" route
router.get("/ticket.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "ticket.html")); // Use __dirname
});

// Route to fetch a single ticket by ID and send response as JSON
router.get("/ticket/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    console.log("ticketID", ticketId);
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
