import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  forgotPasswordSMS,
  verifyOTPAndResetPassword,
} from "../controller/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-sms", forgotPasswordSMS);
router.post("/verify-otp-reset", verifyOTPAndResetPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-token/:token", verifyResetToken);

export default router;
