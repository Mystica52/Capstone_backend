import express from "express";
import { login, signup } from "../controllers/user.controller.js";
import {
  signupValidationRules,
  loginValidationRules,
  validate,
} from "../middlewares/validator.js";

const router = express.Router();

router.post("/signup", validate(signupValidationRules), signup);
router.post("/login", validate(loginValidationRules), login);

export default router;
