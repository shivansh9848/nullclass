import users from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendNewPasswordEmail,
  validateEmail,
  generateRandomPassword,
} from "../utils/emailService.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
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
    const extinguser = await users.findOne({ email });
    if (!extinguser) {
      return res.status(404).json({ message: "User does not exists" });
    }
    const ispasswordcrct = await bcrypt.compare(password, extinguser.password);
    if (!ispasswordcrct) {
      res.status(400).json({ message: "Invalid credentiasl" });
      return;
    }
    const token = jwt.sign(
      {
        email: extinguser.email,
        id: extinguser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: extinguser, token });
  } catch (error) {
    res.status(500).json("something went wrong...");
    return;
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
