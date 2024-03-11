import express from "express";
import { Addbus } from "../controllers/bus.controller.js";
const router = express.Router();

router.post("/addbus", Addbus);

export default router;
