import users from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendNewPasswordEmail,
  validateEmail,
  generateRandomPassword,
  sendLoginOTPEmail,
} from "../utils/emailService.js";
import {
  sendOTP,
  sendNewPasswordSMS,
  validatePhoneNumber,
  generateOTP,
} from "../utils/smsService.js";
import {
  parseUserAgent,
  getClientIpAddress,
  generateSessionId,
  generateLoginOTP,
  validateMobileLoginTime,
  getAuthRequirement,
  cleanupLoginHistory,
  checkOTPAttempts,
  checkSuspiciousIP,
  formatDeviceInfo,
} from "../utils/deviceService.js";

export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const extinguser = await users.findOne({ email });
    if (extinguser) {
      return res.status(404).json({ message: "User already exist" });
    }
    const hashedpassword = await bcrypt.hash(password, 12);
    const newuser = await users.create({
      name,
      email,
      password: hashedpassword,
      phone: phone || undefined, // Only add phone if provided
    });
    const token = jwt.sign(
      {
        email: newuser.email,
        id: newuser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: newuser, token });
  } catch (error) {
    res.status(500).json("something went wrong...");
    return;
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get device and IP information
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = getClientIpAddress(req);
    const deviceInfo = parseUserAgent(userAgent);
    const formattedDeviceInfo = formatDeviceInfo(deviceInfo);

    // Find user
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      // Log failed login attempt
      await logLoginAttempt(existingUser._id, {
        ipAddress,
        userAgent,
        deviceInfo: formattedDeviceInfo,
        loginStatus: "failed",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check mobile time restrictions
    const timeValidation = validateMobileLoginTime(deviceInfo);
    if (!timeValidation.allowed) {
      await logLoginAttempt(existingUser._id, {
        ipAddress,
        userAgent,
        deviceInfo: formattedDeviceInfo,
        loginStatus: "time_restricted",
      });
      return res.status(403).json({
        message: timeValidation.message,
        code: "TIME_RESTRICTED",
      });
    }

    // Check authentication requirements based on browser
    const authRequirement = getAuthRequirement(deviceInfo.browser);

    // For regular login, we should not require OTP
    // OTP should only be required for language switching
    // Complete login directly for all browsers
    return await completeLogin(
      existingUser,
      deviceInfo,
      ipAddress,
      userAgent,
      res
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong..." });
  }
};

// Helper function to complete login process
const completeLogin = async (user, deviceInfo, ipAddress, userAgent, res) => {
  try {
    // Generate session ID and JWT token
    const sessionId = generateSessionId();
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        sessionId: sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Add to current sessions
    const sessionData = {
      sessionId,
      deviceInfo,
      ipAddress,
      loginTime: new Date(),
      lastActivity: new Date(),
      isActive: true,
    };

    // Use findOneAndUpdate to avoid version conflicts
    await users.findOneAndUpdate(
      { _id: user._id },
      {
        $pull: {
          currentSessions: {
            ipAddress: ipAddress,
            "deviceInfo.browser": deviceInfo.browser,
          },
        },
      },
      { new: true }
    );

    // Add new session
    await users.findOneAndUpdate(
      { _id: user._id },
      {
        $push: { currentSessions: sessionData },
        $unset: {
          loginOTP: 1,
          loginOTPExpires: 1,
        },
        $set: {
          loginOTPAttempts: 0,
        },
      },
      { new: true }
    );

    // Log successful login
    await logLoginAttempt(user._id, {
      ipAddress,
      userAgent,
      deviceInfo,
      loginStatus: "success",
      sessionId: sessionId,
    });

    res.status(200).json({
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
        tags: user.tags,
        phone: user.phone,
        joinedon: user.joinedon,
        points: user.points,
        badges: user.badges,
      },
      token,
      sessionId,
      deviceInfo,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Complete login error:", error);
    throw error;
  }
};

// Helper function to log login attempts
const logLoginAttempt = async (userId, loginData) => {
  try {
    const user = await users.findById(userId);
    if (!user) return;

    const loginEntry = {
      loginTime: new Date(),
      ipAddress: loginData.ipAddress,
      userAgent: loginData.userAgent,
      deviceInfo: loginData.deviceInfo,
      loginStatus: loginData.loginStatus,
      otpSent: loginData.otpSent || false,
      otpVerified: loginData.otpVerified || false,
      sessionId: loginData.sessionId,
    };

    user.loginHistory.push(loginEntry);

    // Clean up old login history
    user.loginHistory = cleanupLoginHistory(user.loginHistory);

    await user.save();
  } catch (error) {
    console.error("Error logging login attempt:", error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide your email address" });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address" });
    }

    // Find user by email
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with the provided email address",
      });
    }

    // Check if user has already requested password reset today (24 hours rule)
    const lastResetRequest = user.lastPasswordResetRequest;
    const now = new Date();

    if (lastResetRequest) {
      const timeDifference = now - lastResetRequest;
      const hoursSinceLastReset = timeDifference / (1000 * 60 * 60);

      if (hoursSinceLastReset < 24) {
        return res.status(400).json({
          message: "You can request password reset only once a day.",
        });
      }
    }

    // Generate new random password (10 characters, only uppercase and lowercase letters)
    const newPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user with new password and reset request timestamp
    user.password = hashedPassword;
    user.lastPasswordResetRequest = now;
    // Clear any existing reset tokens
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send new password to user's email
    const notificationResult = await sendNewPasswordEmail(
      user.email,
      newPassword
    );

    if (notificationResult.success) {
      res.status(200).json({
        message: "A new password has been sent to your email address.",
        success: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to send new password. Please try again later.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message:
        "Something went wrong while processing your request. Please try again later.",
    });
  }
};

// New function to verify reset token and reset password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validate inputs
    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Reset token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user by reset token
    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Password has been successfully reset. You can now login with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message:
        "Something went wrong while resetting your password. Please try again later.",
    });
  }
};

// New function to verify reset token (for frontend validation)
export const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        valid: false,
      });
    }

    res.status(200).json({
      message: "Token is valid",
      valid: true,
      email: user.email, // Return email for display
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      message: "Something went wrong while verifying the token",
    });
  }
};

// SMS-based forgot password - Step 1: Send OTP
export const forgotPasswordSMS = async (req, res) => {
  const { phone } = req.body;

  try {
    // Validate input
    if (!phone) {
      return res
        .status(400)
        .json({ message: "Please provide your phone number" });
    }

    if (!validatePhoneNumber(phone)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid 10-digit phone number" });
    }

    // Find user by phone number
    const user = await users.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found with the provided phone number",
      });
    }

    // Check if user has already requested password reset today (24 hours rule)
    const lastResetRequest = user.lastPasswordResetRequestSMS;
    const now = new Date();

    if (lastResetRequest) {
      const timeDifference = now - lastResetRequest;
      const hoursSinceLastReset = timeDifference / (1000 * 60 * 60);

      if (hoursSinceLastReset < 24) {
        return res.status(400).json({
          message: "You can request password reset only once a day.",
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.smsOTP = otp;
    user.smsOTPExpires = otpExpires;
    await user.save();

    // Send OTP via SMS
    const smsResult = await sendOTP(phone, otp);

    if (smsResult.success) {
      res.status(200).json({
        message: "OTP sent to your phone number successfully.",
        success: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to send OTP. Please try again later.",
        success: false,
      });
    }
  } catch (error) {
    console.error("SMS Password reset error:", error);
    res.status(500).json({
      message:
        "Something went wrong while processing your request. Please try again later.",
    });
  }
};

// SMS-based forgot password - Step 2: Verify OTP and reset password
export const verifyOTPAndResetPassword = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    // Validate inputs
    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone number and OTP are required",
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid 10-digit phone number" });
    }

    // Find user by phone number
    const user = await users.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found with the provided phone number",
      });
    }

    // Check OTP validity
    if (!user.smsOTP || !user.smsOTPExpires) {
      return res.status(400).json({
        message: "No OTP found. Please request a new OTP.",
      });
    }

    if (user.smsOTPExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (user.smsOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // Generate new random password
    const newPassword = generateRandomPassword();

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user with new password and clear OTP
    user.password = hashedPassword;
    user.lastPasswordResetRequestSMS = new Date();
    user.smsOTP = undefined;
    user.smsOTPExpires = undefined;
    await user.save();

    // Send new password via SMS
    const smsResult = await sendNewPasswordSMS(phone, newPassword);

    if (smsResult.success) {
      res.status(200).json({
        message: "Your new password has been sent to your phone number.",
        success: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to send new password. Please try again later.",
        success: false,
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message:
        "Something went wrong while processing your request. Please try again later.",
    });
  }
};

// Verify login OTP
export const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Get device and IP information
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = getClientIpAddress(req);
    const deviceInfo = parseUserAgent(userAgent);
    const formattedDeviceInfo = formatDeviceInfo(deviceInfo);

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP exists and is valid
    if (!user.loginOTP || !user.loginOTPExpires) {
      return res.status(400).json({
        message: "No OTP found. Please login again.",
        code: "NO_OTP",
      });
    }

    // Check if OTP has expired
    if (user.loginOTPExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please login again.",
        code: "OTP_EXPIRED",
      });
    }

    // Check OTP attempts
    const otpCheck = checkOTPAttempts(user);
    if (otpCheck.blocked) {
      return res.status(429).json({
        message: otpCheck.message,
        hoursLeft: otpCheck.hoursLeft,
        code: "OTP_BLOCKED",
      });
    }

    // Verify OTP
    if (user.loginOTP !== otp) {
      // Increment failed attempts
      user.loginOTPAttempts = (user.loginOTPAttempts || 0) + 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
        attemptsLeft: Math.max(0, 5 - user.loginOTPAttempts),
        code: "INVALID_OTP",
      });
    }

    // Check mobile time restrictions again
    const timeValidation = validateMobileLoginTime(deviceInfo);
    if (!timeValidation.allowed) {
      await logLoginAttempt(user._id, {
        ipAddress,
        userAgent,
        deviceInfo: formattedDeviceInfo,
        loginStatus: "time_restricted",
        otpVerified: true,
      });
      return res.status(403).json({
        message: timeValidation.message,
        code: "TIME_RESTRICTED",
      });
    }

    // OTP verified successfully - complete login
    await logLoginAttempt(user._id, {
      ipAddress,
      userAgent,
      deviceInfo: formattedDeviceInfo,
      loginStatus: "success",
      otpVerified: true,
    });

    return await completeLogin(
      user,
      formattedDeviceInfo,
      ipAddress,
      userAgent,
      res
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong during OTP verification" });
  }
};

// Get user's login history
export const getLoginHistory = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await users
      .findById(userId)
      .select("loginHistory currentSessions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format login history for display
    const formattedHistory = user.loginHistory
      .map((login) => ({
        _id: login._id,
        loginTime: login.loginTime,
        ipAddress: login.ipAddress,
        deviceInfo: {
          browser: login.deviceInfo.browser,
          os: login.deviceInfo.os,
          device: login.deviceInfo.device,
          displayName:
            login.deviceInfo.displayName ||
            `${login.deviceInfo.browser} on ${login.deviceInfo.os}`,
        },
        loginStatus: login.loginStatus,
        otpRequired: login.otpSent,
        otpVerified: login.otpVerified,
        sessionId: login.sessionId,
        logoutTime: login.logoutTime,
      }))
      .sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));

    // Format current sessions
    const currentSessions = user.currentSessions.map((session) => ({
      _id: session._id,
      sessionId: session.sessionId,
      deviceInfo: {
        browser: session.deviceInfo.browser,
        os: session.deviceInfo.os,
        device: session.deviceInfo.device,
        displayName:
          session.deviceInfo.displayName ||
          `${session.deviceInfo.browser} on ${session.deviceInfo.os}`,
      },
      ipAddress: session.ipAddress,
      loginTime: session.loginTime,
      lastActivity: session.lastActivity,
      isActive: session.isActive,
      isCurrent: session.sessionId === req.sessionId, // Current session
    }));

    res.status(200).json({
      loginHistory: formattedHistory,
      currentSessions: currentSessions,
      totalLogins: formattedHistory.length,
      activeSessions: currentSessions.filter((s) => s.isActive).length,
    });
  } catch (error) {
    console.error("Get login history error:", error);
    res.status(500).json({ message: "Failed to fetch login history" });
  }
};

// Terminate a specific session
export const terminateSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find and deactivate the session
    const sessionIndex = user.currentSessions.findIndex(
      (s) => s.sessionId === sessionId
    );
    if (sessionIndex === -1) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Don't allow terminating current session
    if (sessionId === req.sessionId) {
      return res
        .status(400)
        .json({ message: "Cannot terminate current session" });
    }

    user.currentSessions[sessionIndex].isActive = false;

    // Update login history with logout time
    const loginHistoryEntry = user.loginHistory.find(
      (login) => login.sessionId === sessionId
    );
    if (loginHistoryEntry) {
      loginHistoryEntry.logoutTime = new Date();
    }

    await user.save();

    res.status(200).json({ message: "Session terminated successfully" });
  } catch (error) {
    console.error("Terminate session error:", error);
    res.status(500).json({ message: "Failed to terminate session" });
  }
};

// Terminate all other sessions
export const terminateAllSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const currentSessionId = req.sessionId;

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deactivate all sessions except current one
    user.currentSessions = user.currentSessions.map((session) => {
      if (session.sessionId !== currentSessionId) {
        session.isActive = false;

        // Update login history with logout time
        const loginHistoryEntry = user.loginHistory.find(
          (login) => login.sessionId === session.sessionId
        );
        if (loginHistoryEntry) {
          loginHistoryEntry.logoutTime = new Date();
        }
      }
      return session;
    });

    await user.save();

    res
      .status(200)
      .json({ message: "All other sessions terminated successfully" });
  } catch (error) {
    console.error("Terminate all sessions error:", error);
    res.status(500).json({ message: "Failed to terminate sessions" });
  }
};

// Language switching OTP endpoints
export const sendLanguageEmailOTP = async (req, res) => {
  const { language } = req.body;
  const userId = req.userId;

  try {
    if (!language || !["en", "hi", "es", "fr", "pt", "zh"].includes(language)) {
      return res.status(400).json({ message: "Invalid language selection" });
    }

    // French requires email OTP
    if (language !== "fr") {
      return res.status(400).json({
        message: "Email OTP is only required for French language",
      });
    }

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has already verified this language
    const langVerification = user.languagesVerified.get(language);
    if (langVerification && langVerification.verified) {
      return res.status(200).json({
        message: "Language already verified",
        verified: true,
      });
    }

    // Rate limiting for language OTP requests
    const now = new Date();
    if (
      user.lastLanguageOTPRequest &&
      now - user.lastLanguageOTPRequest < 60000
    ) {
      // 1 minute
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
      });
    }

    // Generate OTP
    const otp = generateLoginOTP();
    const otpExpires = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // Update user with language OTP
    await users.findByIdAndUpdate(userId, {
      languageOTP: otp,
      languageOTPExpires: otpExpires,
      languageOTPAttempts: 0,
      lastLanguageOTPRequest: now,
    });

    // Send OTP email
    const emailResult = await sendLoginOTPEmail(
      user.email,
      otp,
      "language switching"
    );

    if (emailResult.success) {
      res.status(200).json({
        message: "OTP sent to your email for language verification",
        otpSent: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to send OTP email",
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("Error sending language email OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendLanguageSMSOTP = async (req, res) => {
  const { language, phone } = req.body;
  const userId = req.userId;

  try {
    if (!language || !["en", "hi", "es", "fr", "pt", "zh"].includes(language)) {
      return res.status(400).json({ message: "Invalid language selection" });
    }

    // French requires email OTP, others require SMS OTP
    if (language === "fr") {
      return res.status(400).json({
        message: "French language requires email OTP, not SMS",
      });
    }

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If phone is provided in request, use it and update user
    let phoneNumber = phone || user.phone;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number is required for SMS verification",
      });
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        message: "Please provide a valid phone number",
      });
    }

    // Update user phone if new one is provided
    if (phone && phone !== user.phone) {
      await users.findByIdAndUpdate(userId, { phone: phoneNumber });
    }

    // Check if user has already verified this language
    const langVerification = user.languagesVerified.get(language);
    if (langVerification && langVerification.verified) {
      return res.status(200).json({
        message: "Language already verified",
        verified: true,
      });
    }

    // Rate limiting for language OTP requests
    const now = new Date();
    if (
      user.lastLanguageOTPRequest &&
      now - user.lastLanguageOTPRequest < 60000
    ) {
      // 1 minute
      return res.status(429).json({
        message: "Please wait before requesting another OTP",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    // Update user with language OTP
    await users.findByIdAndUpdate(userId, {
      languageOTP: otp,
      languageOTPExpires: otpExpires,
      languageOTPAttempts: 0,
      lastLanguageOTPRequest: now,
    });

    // Send OTP SMS
    const smsResult = await sendOTP(phoneNumber, otp);

    if (smsResult.success) {
      res.status(200).json({
        message: "OTP sent to your phone for language verification",
        otpSent: true,
      });
    } else {
      res.status(500).json({
        message: "Failed to send OTP SMS",
        error: smsResult.message,
      });
    }
  } catch (error) {
    console.error("Error sending language SMS OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyLanguageOTP = async (req, res) => {
  const { otp, language } = req.body;
  const userId = req.userId;

  try {
    console.log("Language OTP verification request:", {
      otp,
      language,
      userId,
    });

    if (!otp || !language) {
      return res.status(400).json({ message: "OTP and language are required" });
    }

    if (!["en", "hi", "es", "fr", "pt", "zh"].includes(language)) {
      return res.status(400).json({ message: "Invalid language selection" });
    }

    const user = await users.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", {
      email: user.email,
      languageOTP: user.languageOTP ? "SET" : "NOT SET",
      languageOTPExpires: user.languageOTPExpires,
      languageOTPAttempts: user.languageOTPAttempts,
    });

    // Check if OTP exists and is not expired
    if (!user.languageOTP || !user.languageOTPExpires) {
      console.log("No OTP found for user");
      return res.status(400).json({
        message: "No OTP found. Please request a new OTP.",
      });
    }

    if (new Date() > user.languageOTPExpires) {
      console.log("OTP expired");
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check attempt limits
    if (user.languageOTPAttempts >= 5) {
      console.log("Too many attempts");
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    console.log("Comparing OTPs:", { provided: otp, stored: user.languageOTP });
    if (user.languageOTP !== otp) {
      // Increment failed attempts
      await users.findByIdAndUpdate(userId, {
        $inc: { languageOTPAttempts: 1 },
      });

      console.log("Invalid OTP provided");
      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
        attemptsLeft: 5 - (user.languageOTPAttempts + 1),
      });
    }

    // OTP is valid, mark language as verified
    const verificationMethod = language === "fr" ? "email" : "sms";
    const languagesVerified = user.languagesVerified || new Map();
    languagesVerified.set(language, {
      verified: true,
      verifiedAt: new Date(),
      method: verificationMethod,
    });

    await users.findByIdAndUpdate(userId, {
      languagesVerified,
      preferredLanguage: language,
      // Clear OTP data
      languageOTP: null,
      languageOTPExpires: null,
      languageOTPAttempts: 0,
      lastLanguageOTPRequest: null,
    });

    console.log("Language verification successful");
    res.status(200).json({
      message: "Language verification successful",
      verified: true,
      language: language,
    });
  } catch (error) {
    console.error("Error verifying language OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserLanguagePreferences = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await users
      .findById(userId)
      .select("preferredLanguage languagesVerified");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert Map to object for JSON response
    const languagesVerified = {};
    if (user.languagesVerified) {
      for (const [lang, verification] of user.languagesVerified) {
        languagesVerified[lang] = verification;
      }
    }

    res.status(200).json({
      preferredLanguage: user.preferredLanguage || "en",
      languagesVerified,
    });
  } catch (error) {
    console.error("Error getting user language preferences:", error);
    res.status(500).json({ message: "Server error" });
  }
};
