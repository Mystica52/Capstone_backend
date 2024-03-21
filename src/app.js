import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import busRoutes from "./routes/bus.js";
import ticketRoutes from "./routes/ticket.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api", userRoutes, busRoutes, ticketRoutes);
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to Mystica's API",
  });
});

export { app };
