import express from "express";
import {
  Addbus,
  deleteBus,
  getAllBuses,
  getBusById,
  updateBus,
} from "../controllers/bus.controller.js";
import { isAdmin, isAdminOrAgent } from "../middlewares/routeProtection.js";
const router = express.Router();

router.post("/addbus", isAdminOrAgent, Addbus);
router.get("/allBus", getAllBuses);
router.get("/singleBus/:busId", getBusById);
router.put("/updateBus/:busId", updateBus);
router.delete("/deleteBus/:busId", isAdmin, deleteBus);
export default router;
