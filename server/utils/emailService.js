import nodemailer from "nodemailer";
import crypto from "crypto";

// Create NodeMailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Generate random password with only uppercase and lowercase letters (10 characters)
export const generateRandomPassword = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let password = "";

  for (let i = 0; i < 10; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return password;
};

// Generate OTP token (keeping for backward compatibility)
export const generateOTP = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Send new password email
export const sendNewPasswordEmail = async (email, newPassword) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your New Password - stackoverflow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007ac6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .password-box { background-color: #fff; border: 2px solid #007ac6; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .password { font-size: 24px; font-weight: bold; color: #007ac6; letter-spacing: 2px; font-family: 'Courier New', monospace; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Password Generated</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Your password has been successfully reset. Here is your new password:</p>
              
              <div class="password-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your New Password:</p>
                <div class="password">${newPassword}</div>
              </div>
              
              <div class="warning">
                <p><strong>Important Security Instructions:</strong></p>
                <ul>
                  <li><strong>Please change this password immediately after logging in</strong></li>
                  <li>Do not share this password with anyone</li>
                  <li>You can only request a password reset once per day</li>
                  <li>This password is temporary and should be changed to something more secure</li>
                </ul>
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Log in to your account using this new password</li>
                <li>Go to your profile settings</li>
                <li>Change your password to something secure and memorable</li>
              </ol>
              
              <p>If you didn't request this password reset, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 stackoverflow. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`
========= NEW PASSWORD EMAIL (DEVELOPMENT MODE) =========
To: ${email}
Subject: Your New Password - stackoverflow
New Password: ${newPassword}

Note: Email configuration not found. In production, configure:
- EMAIL_USER: Your Gmail address
- EMAIL_PASSWORD: Your Gmail app password
- EMAIL_FROM: Sender email address
=========================================================
      `);
      return {
        success: true,
        message: "Email sent successfully (development mode)",
      };
    }

    await transporter.sendMail(mailOptions);
    console.log(`New password email sent to: ${email}`);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, message: "Failed to send email" };
  }
};

// Send password reset email with OTP link (keeping for backward compatibility)
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - stackoverflow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007ac6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background-color: #007ac6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>We received a request to reset your password for your stackoverflow account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 3px;">
                ${resetLink}
              </p>
              
              <div class="warning">
                <p><strong>Important:</strong></p>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>For security, you can only request a password reset once per day</li>
                </ul>
              </div>
              
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 stackoverflow. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`
========= PASSWORD RESET EMAIL (DEVELOPMENT MODE) =========
To: ${email}
Subject: Password Reset Request - stackoverflow
Reset Link: ${resetLink}

Note: Email configuration not found. In production, configure:
- EMAIL_USER: Your Gmail address
- EMAIL_PASSWORD: Your Gmail app password
- EMAIL_FROM: Sender email address
==========================================================
      `);
      return {
        success: true,
        message: "Email sent successfully (development mode)",
      };
    }

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, message: "Failed to send email" };
  }
};

// Email validation function
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Send OTP email for video upload verification
export const sendOTPEmail = async (email, otp) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address");
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Video Upload Verification - stackoverflow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007ac6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp-box { background-color: #fff; border: 2px solid #007ac6; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .otp { font-size: 32px; font-weight: bold; color: #007ac6; letter-spacing: 5px; font-family: 'Courier New', monospace; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Video Upload Verification</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>You have requested to upload a video with your question. Please use the OTP below to verify your email address:</p>
              
              <div class="otp-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Verification Code:</p>
                <div class="otp">${otp}</div>
              </div>
              
              <div class="warning">
                <p><strong>Important:</strong></p>
                <ul>
                  <li>This OTP is valid for 10 minutes only</li>
                  <li>Do not share this code with anyone</li>
                  <li>Video uploads are only allowed between 2:00 PM and 7:00 PM</li>
                  <li>Video should not exceed 2 minutes duration and 50MB size</li>
                </ul>
              </div>
              
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 stackoverflow. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`
========= OTP EMAIL (DEVELOPMENT MODE) =========
To: ${email}
Subject: Video Upload Verification - stackoverflow
OTP: ${otp}

Note: Email configuration not found. In production, configure:
- EMAIL_USER: Your Gmail address
- EMAIL_PASSWORD: Your Gmail app password
- EMAIL_FROM: Sender email address
==========================================================
      `);
      return {
        success: true,
        message: "OTP sent successfully (development mode)",
      };
    }

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to: ${email}`);

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("OTP email sending error:", error);
    return { success: false, message: "Failed to send OTP email" };
  }
};

// Send login OTP email
export const sendLoginOTPEmail = async (email, otp, deviceInfo) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address");
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Login Verification - stackoverflow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007ac6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp-box { background-color: #fff; border: 2px solid #007ac6; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
            .otp { font-size: 32px; font-weight: bold; color: #007ac6; letter-spacing: 5px; font-family: 'Courier New', monospace; }
            .device-info { background-color: #e8f4f8; border-left: 4px solid #007ac6; padding: 15px; margin: 15px 0; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Login Verification Required</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>We detected a login attempt from a Chrome-based browser. Please use the OTP below to complete your login:</p>
              
              <div class="otp-box">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your Login Verification Code:</p>
                <div class="otp">${otp}</div>
              </div>
              
              <div class="device-info">
                <p><strong>Login Details:</strong></p>
                <ul>
                  <li><strong>Browser:</strong> ${deviceInfo.browser}</li>
                  <li><strong>Operating System:</strong> ${deviceInfo.os}</li>
                  <li><strong>Device Type:</strong> ${deviceInfo.device}</li>
                  <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
                </ul>
              </div>
              
              <div class="warning">
                <p><strong>Important:</strong></p>
                <ul>
                  <li>This OTP is valid for 10 minutes only</li>
                  <li>Do not share this code with anyone</li>
                  <li>If you didn't attempt to login, please secure your account immediately</li>
                </ul>
              </div>
              
              <p>If you didn't request this login, please ignore this email and consider changing your password.</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 stackoverflow. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`
========= LOGIN OTP EMAIL (DEVELOPMENT MODE) =========
To: ${email}
Subject: Login Verification - stackoverflow
OTP: ${otp}
Device: ${deviceInfo.browser} on ${deviceInfo.os} (${deviceInfo.device})

Note: Email configuration not found. In production, configure:
- EMAIL_USER: Your Gmail address
- EMAIL_PASSWORD: Your Gmail app password
- EMAIL_FROM: Sender email address
==========================================================
      `);
      return {
        success: true,
        message: "Login OTP sent successfully (development mode)",
      };
    }

    await transporter.sendMail(mailOptions);
    console.log(`Login OTP email sent to: ${email}`);

    return { success: true, message: "Login OTP sent successfully" };
  } catch (error) {
    console.error("Login OTP email sending error:", error);
    return { success: false, message: "Failed to send login OTP email" };
  }
};
