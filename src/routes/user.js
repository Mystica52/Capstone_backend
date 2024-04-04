import express from "express";
import {
  allUsers,
  changePassword,
  editProfile,
  getUserById,
  login,
  signup,
  updateUserRole,
} from "../controllers/user.controller.js";
import {
  signupValidationRules,
  loginValidationRules,
  validate,
  profileUpdateValidationRules,
  passwordChangeValidationRules,
} from "../middlewares/validator.js";
import { isAdmin } from "../middlewares/routeProtection.js";

const router = express.Router();

router.post("/signup", validate(signupValidationRules), signup);
router.post("/login", validate(loginValidationRules), login);
router.get("/users", isAdmin, allUsers);
router.get("/singleUser/:userId", getUserById)
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
router.put("/assign-role/:userId", isAdmin, updateUserRole);
export default router;
