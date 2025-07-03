import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controller/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-token/:token", verifyResetToken);

export default router;
