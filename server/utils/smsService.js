import twilio from "twilio";

// Generate OTP for SMS (6 digits)
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

// Validate phone number (international format, E.164 OR 10-digit Indian)
export const validatePhoneNumber = (phone) => {
  // Support both international format and 10-digit Indian numbers
  const internationalRegex = /^\+\d{10,15}$/; // International format
  const indianRegex = /^[6-9]\d{9}$/; // 10-digit Indian format

  return internationalRegex.test(phone) || indianRegex.test(phone);
};

// Initialize Twilio client
const getTwilioClient = () => {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
    return null;
  }
  return twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
};

// Send OTP via Twilio WhatsApp Sandbox
export const sendOTP = async (phoneNumber, otp) => {
  try {
    const client = getTwilioClient();

    if (!client) {
      console.error("Twilio credentials not configured");
      return {
        success: false,
        message: "WhatsApp service not configured",
      };
    }

    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    const message = await client.messages.create({
      body: `🔐 Your OTP for password reset is: *${otp}*\n\nThis OTP is valid for 10 minutes. Do not share this with anyone.\n\n- stackoverflow Team`,
      from: "whatsapp:+14155238886", // Twilio WhatsApp Sandbox number
      to: `whatsapp:${formattedPhone}`,
    });

    if (message.sid) {
      return {
        success: true,
        message: "OTP sent successfully via WhatsApp",
        data: { sid: message.sid, status: message.status },
      };
    } else {
      return {
        success: false,
        message: "Failed to send OTP",
      };
    }
  } catch (error) {
    console.error("WhatsApp Error:", error.message);
    return {
      success: false,
      message: "Failed to send OTP via WhatsApp",
      error: error.message,
    };
  }
};

// Send new password via Twilio WhatsApp Sandbox
export const sendNewPasswordSMS = async (phoneNumber, newPassword) => {
  try {
    const client = getTwilioClient();

    if (!client) {
      console.error("Twilio credentials not configured");
      return {
        success: false,
        message: "WhatsApp service not configured",
      };
    }

    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    const message = await client.messages.create({
      body: `🔑 Your new password is: *${newPassword}*\n\n⚠️ Please change this password after logging in.\nThis password is valid for 24 hours.\n\n- stackoverflow Team`,
      from: "whatsapp:+14155238886", // Twilio WhatsApp Sandbox number
      to: `whatsapp:${formattedPhone}`,
    });

    if (message.sid) {
      return {
        success: true,
        message: "New password sent successfully via WhatsApp",
        data: { sid: message.sid, status: message.status },
      };
    } else {
      return {
        success: false,
        message: "Failed to send new password",
      };
    }
  } catch (error) {
    console.error("WhatsApp Error:", error.message);
    return {
      success: false,
      message: "Failed to send new password via WhatsApp",
      error: error.message,
    };
  }
};

// Test WhatsApp service (for development)
export const testSMS = async (phoneNumber) => {
  try {
    const client = getTwilioClient();

    if (!client) {
      return {
        success: false,
        error: "Twilio credentials not configured",
      };
    }

    // Ensure phone number is in E.164 format
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    const message = await client.messages.create({
      body: `🧪 Test message from your stackoverflow app.\n\nWhatsApp service is working! 🎉\n\n- stackoverflow Team`,
      from: "whatsapp:+14155238886", // Twilio WhatsApp Sandbox number
      to: `whatsapp:${formattedPhone}`,
    });

    return {
      success: true,
      data: { sid: message.sid, status: message.status },
    };
  } catch (error) {
    console.error("Test WhatsApp Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};
