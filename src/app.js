import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import path from 'path';
import busRoutes from "./routes/bus.js";
import ticketRoutes from "./routes/ticket.js";
import userRoutes from "./routes/user.js";


const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(bodyParser.json());

app.use(cors());
app.use(express.static(path.join(__dirname, '../../views/')));
app.use("/api", userRoutes, busRoutes, ticketRoutes);
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to Mystica's API",
  });
});

export { app };

