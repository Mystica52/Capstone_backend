import express from "express";
import {
  Addbus,
  deleteBus,
  getAllBuses,
  getBusById,
  updateBus,
} from "../controllers/bus.controller.js";
const router = express.Router();

router.post("/addbus", Addbus);
router.get("/allBus", getAllBuses);
router.get("/singleBus/:busId", getBusById);
router.put("/updateBus/:busId", updateBus);
router.delete("/deleteBus/:busId", deleteBus);
export default router;
