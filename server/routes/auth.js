import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  forgotPasswordSMS,
  verifyOTPAndResetPassword,
  verifyLoginOTP,
  getLoginHistory,
  terminateSession,
  terminateAllSessions,
  sendLanguageEmailOTP,
  sendLanguageSMSOTP,
  verifyLanguageOTP,
  getUserLanguagePreferences,
} from "../controller/auth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password-sms", forgotPasswordSMS);
router.post("/verify-otp-reset", verifyOTPAndResetPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-token/:token", verifyResetToken);

// Protected routes for login history and session management
router.get("/login-history", auth, getLoginHistory);
router.delete("/sessions/:sessionId", auth, terminateSession);
router.delete("/sessions", auth, terminateAllSessions);

// Protected routes for language switching
router.post("/send-language-email-otp", auth, sendLanguageEmailOTP);
router.post("/send-language-sms-otp", auth, sendLanguageSMSOTP);
router.post("/verify-language-otp", auth, verifyLanguageOTP);
router.get("/language-preferences", auth, getUserLanguagePreferences);

export default router;
