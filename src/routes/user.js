import express from "express";
import {
  allUsers,
  changePassword,
  editProfile,
  login,
  signup,
} from "../controllers/user.controller.js";
import {
  signupValidationRules,
  loginValidationRules,
  validate,
  profileUpdateValidationRules,
  passwordChangeValidationRules,
} from "../middlewares/validator.js";

const router = express.Router();

router.post("/signup", validate(signupValidationRules), signup);
router.post("/login", validate(loginValidationRules), login);
router.get("/users", allUsers);
router.put(
  "/edit-profile/:userId",
  validate(profileUpdateValidationRules),
  editProfile
);
router.put(
  "/change-password/:userId",
  validate(passwordChangeValidationRules),
  changePassword
);
export default router;
