import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/api", userRoutes);
export { app };
