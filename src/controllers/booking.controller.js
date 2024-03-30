import dotenv from "dotenv";
import stripePackage from "stripe";
import Bus from "../models/bus.js";
import Ticket from "../models/ticket.js";
import qr from "qrcode"; // Import QR code library
import User from "../models/user.js";
import fs from "fs";
import path from "path"; // Import the path module

dotenv.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripePackage(stripeSecretKey);

export const initiatePaymentAndCompleteBooking = async (req, res) => {
  try {
    const { busId, userId } = req.body;

    // Retrieve bus details to calculate payment amount
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const existUser = await User.findById(userId);
    if (!existUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Create a ticket for the user
    const ticket = new Ticket({
      user: userId,
      userName: existUser.name,
      userEmail: existUser.email,
      bus: busId,
      busPlate: bus.plateNo,
      busDate:bus.date,
      busTime:bus.departure_time,
      price: bus.price,
    });
    await ticket.save(); // Save the ticket first

    // Calculate payment amount based on bus price
    const paymentAmount = bus.price * 100; // Convert to cents

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Bus Ticket",
            },
            unit_amount: paymentAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/api/success?ticketId=${ticket._id}`, // Include ticket info in success URL
      cancel_url: `${process.env.BASE_URL}/api/failure`,
      metadata: {
        busId,
        userId,
      },
    });

    // Reduce available seats for the bus
    if (bus.available_seats === 0) {
      return res.status(400).json({ message: "No available seats" });
    }
    bus.available_seats -= 1;
    await bus.save();

    // Generate QR code containing ticket information
    const ticketInfo = {
      user: userId,
      userName: existUser.name,
      userEmail: existUser.email,
      bus: busId,
      busPlate: bus.plateNo,
      busDate:bus.date,
      busTime:bus.departure_time,
      price: bus.price,
      ticketId: ticket._id, // Include ticket ID in QR code
    };
    const qrCode = await qr.toDataURL(JSON.stringify(ticketInfo));

    // Send response containing session ID and QR code
    res.status(200).json({ sessionId: session.id, qrCode });

    console.log("Stripe session:", session);
  } catch (error) {
    console.error("Error initiating payment and completing booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Get the directory path of the current module file
    const __dirname = path.dirname(new URL(import.meta.url).pathname);

    // Read the HTML file
    fs.readFile(
      path.join(__dirname, "../../views/ticket.html"), // Adjust the path here
      "utf8",
      (err, data) => {
        if (err) {
          console.error("Error reading HTML file:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }

        // Send the HTML file with ticket information
        const htmlWithData = data
          .replace(/{{ticketId}}/g, ticket._id)
          .replace(/{{userName}}/g, ticket.userName)
          .replace(/{{userEmail}}/g, ticket.userEmail)
          .replace(/{{busPlate}}/g, ticket.busPlate)
          .replace(/{{busDate}}/g, ticket.busDate)
          .replace(/{{busTime}}/g, ticket.busTime)
          .replace(/{{price}}/g, ticket.price);

        res.send(htmlWithData);
      }
    );
  } catch (error) {
    console.error("Error retrieving ticket:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
