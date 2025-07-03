import express from "express";
import {
  sendOTPForVideoUpload,
  verifyOTPForVideoUpload,
} from "../controller/otp.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Send OTP for video upload verification
router.post("/send-otp", auth, sendOTPForVideoUpload);

// Verify OTP for video upload
router.post("/verify-otp", auth, verifyOTPForVideoUpload);

export default router;
