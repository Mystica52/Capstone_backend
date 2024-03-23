import dotenv from "dotenv";
import stripePackage from "stripe";
import Bus from "../models/bus.js";
import Ticket from "../models/ticket.js";

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
      success_url: `https://docs.stripe.com/testing`, // Change as per your client URL
      cancel_url: `https://flutterwavedoc.readme.io/docs/test-cards`, // Change as per your client URL
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

    // Create a ticket for the user
    const ticket = new Ticket({
      user: userId,
      bus: busId,
      price: bus.price,
    });
    await ticket.save();

    res.status(200).json({ sessionId: session.id });
    console.log('Stripe session:', session);
  } catch (error) {
    console.error("Error initiating payment and completing booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
