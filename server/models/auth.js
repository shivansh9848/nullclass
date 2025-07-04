import mongoose from "mongoose";
const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  phone: { type: String },
  lastPasswordResetRequest: { type: Date },
  lastPasswordResetRequestSMS: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  smsOTP: { type: String },
  smsOTPExpires: { type: Date },
  joinedon: { type: Date, default: Date.now },
  points: { type: Number, default: 0 },
  badges: [
    {
      name: { type: String },
      description: { type: String },
      achievedOn: { type: Date, default: Date.now },
      icon: { type: String },
    },
  ],
  pointsHistory: [
    {
      action: { type: String },
      points: { type: Number },
      description: { type: String },
      timestamp: { type: Date, default: Date.now },
      relatedId: { type: String },
    },
  ],
  // Login tracking fields
  loginHistory: [
    {
      loginTime: { type: Date, default: Date.now },
      ipAddress: { type: String },
      userAgent: { type: String },
      deviceInfo: {
        browser: { type: String },
        os: { type: String },
        platform: { type: String },
        device: { type: String }, // desktop, mobile, tablet
        isMobile: { type: Boolean, default: false },
        isDesktop: { type: Boolean, default: false },
        isTablet: { type: Boolean, default: false },
      },
      loginStatus: {
        type: String,
        enum: ["success", "failed", "otp_required", "time_restricted"],
        default: "success",
      },
      otpSent: { type: Boolean, default: false },
      otpVerified: { type: Boolean, default: false },
      sessionId: { type: String },
      logoutTime: { type: Date },
    },
  ],
  // Current session tracking
  currentSessions: [
    {
      sessionId: { type: String, required: true },
      deviceInfo: {
        browser: { type: String },
        os: { type: String },
        platform: { type: String },
        device: { type: String },
        isMobile: { type: Boolean, default: false },
      },
      ipAddress: { type: String },
      loginTime: { type: Date, default: Date.now },
      lastActivity: { type: Date, default: Date.now },
      isActive: { type: Boolean, default: true },
    },
  ],
  // OTP for login verification
  loginOTP: { type: String },
  loginOTPExpires: { type: Date },
  loginOTPAttempts: { type: Number, default: 0 },
  lastLoginOTPRequest: { type: Date },
  // Language verification tracking
  languagesVerified: {
    type: Map,
    of: {
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      method: { type: String, enum: ["email", "sms"] },
    },
    default: new Map(),
  },
  // OTP for language switching
  languageOTP: { type: String },
  languageOTPExpires: { type: Date },
  languageOTPAttempts: { type: Number, default: 0 },
  lastLanguageOTPRequest: { type: Date },
  preferredLanguage: { type: String, default: "en" },
});

export default mongoose.model("User", userschema);
