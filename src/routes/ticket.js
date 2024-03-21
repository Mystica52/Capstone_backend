import express from "express";
import { initiatePaymentAndCompleteBooking } from "../controllers/booking.controller.js";

const router = express.Router();

// Route to initiate payment
router.post("/payment", initiatePaymentAndCompleteBooking);

export default router;
