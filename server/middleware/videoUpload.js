// Middleware to check video upload time restrictions
export const checkVideoUploadTime = (req, res, next) => {
  const currentHour = new Date().getHours();
  const currentTime = new Date().toLocaleTimeString();

  console.log(
    `Video upload time check: Current time is ${currentTime} (hour: ${currentHour})`
  );

  if (currentHour >= 14 && currentHour < 19) {
    console.log(
      "Video upload allowed - within permitted hours (2:00 PM - 7:00 PM)"
    );
    next();
  } else {
    console.log("Video upload blocked - outside permitted hours");
    return res.status(403).json({
      message: "Video uploads are only allowed between 2:00 PM and 7:00 PM",
      currentTime: currentTime,
      allowedHours: "2:00 PM - 7:00 PM",
    });
  }
};

// Store OTP tokens temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiration
export const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { otp, expiresAt });
};

// Verify OTP
export const verifyOTP = (email, otp) => {
  const storedData = otpStore.get(email);

  if (!storedData) {
    return { valid: false, message: "OTP not found or expired" };
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: "OTP has expired" };
  }

  if (storedData.otp !== otp) {
    return { valid: false, message: "Invalid OTP" };
  }

  // OTP is valid, remove it from store
  otpStore.delete(email);
  return { valid: true, message: "OTP verified successfully" };
};

// Clean up expired OTPs (run this periodically)
export const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);
