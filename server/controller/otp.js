import { generateOTP, storeOTP, verifyOTP } from "../middleware/videoUpload.js";
import { sendOTPEmail } from "../utils/emailService.js";

export const sendOTPForVideoUpload = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP
    storeOTP(email, otp);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOTPForVideoUpload = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP
    const verification = verifyOTP(email, otp);

    if (verification.valid) {
      res.status(200).json({ message: verification.message });
    } else {
      res.status(400).json({ message: verification.message });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
