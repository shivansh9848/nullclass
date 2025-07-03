import dotenv from "dotenv";
import { testSMS, sendOTP, validatePhoneNumber } from "./utils/smsService.js";

dotenv.config();

// Test WhatsApp functionality
async function testWhatsAppFeature() {
  console.log("🚀 Testing WhatsApp Feature...\n");

  // Test 1: Phone number validation
  console.log("📱 Testing phone number validation:");
  const testNumbers = [
    "+919876543210", // Valid (with country code)
    "+918765432109", // Valid (with country code)
    "9876543210", // Valid (will be formatted to +91)
    "+15678901234", // Valid (US number)
    "98765432", // Invalid (too short)
    "98765432100", // Invalid (too long)
    "abc1234567", // Invalid (contains letters)
    "+91abc1234567", // Invalid (contains letters)
  ];

  testNumbers.forEach((num) => {
    const isValid = validatePhoneNumber(num);
    console.log(`  ${num}: ${isValid ? "✅ Valid" : "❌ Invalid"}`);
  });

  // Test 2: Check Twilio configuration
  console.log("\n🔑 Checking Twilio configuration:");
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
    console.log("  ❌ Twilio credentials not configured in .env file");
    console.log("  Please add:");
    console.log("  TWILIO_SID=your_twilio_account_sid");
    console.log("  TWILIO_TOKEN=your_twilio_auth_token");
    console.log("\n📚 Setup Guide:");
    console.log("  1. Sign up at: https://console.twilio.com");
    console.log("  2. Go to WhatsApp Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn");
    console.log("  3. Join the sandbox by sending a WhatsApp message to +1 415 523 8886");
    console.log("  4. Send the code provided in the Twilio console");
    return;
  } else {
    console.log("  ✅ Twilio credentials are configured");
  }

  // Test 3: Send test WhatsApp message (uncomment and add your phone number for testing)
  /*
    console.log('\n📤 Sending test WhatsApp message:');
    const testPhoneNumber = '+919876543210'; // Replace with your phone number (include country code)
    
    try {
        const result = await testSMS(testPhoneNumber);
        if (result.success) {
            console.log('  ✅ Test WhatsApp message sent successfully');
            console.log('  Message SID:', result.data.sid);
            console.log('  Status:', result.data.status);
        } else {
            console.log('  ❌ Failed to send test WhatsApp message');
            console.log('  Error:', result.error);
        }
    } catch (error) {
        console.log('  ❌ Error sending test WhatsApp message:', error.message);
    }
    */

  // Test 4: Send OTP via WhatsApp (uncomment and add your phone number for testing)
  /*
    console.log('\n🔐 Sending test OTP via WhatsApp:');
    const testPhoneNumber = '+919876543210'; // Replace with your phone number (include country code)
    
    try {
        const result = await sendOTP(testPhoneNumber, '123456');
        if (result.success) {
            console.log('  ✅ OTP sent successfully via WhatsApp');
            console.log('  Message SID:', result.data.sid);
            console.log('  Status:', result.data.status);
        } else {
            console.log('  ❌ Failed to send OTP via WhatsApp');
            console.log('  Error:', result.error);
        }
    } catch (error) {
        console.log('  ❌ Error sending OTP via WhatsApp:', error.message);
    }
    */

  console.log("\n🏁 WhatsApp feature test completed!");
  console.log("\n📱 To test WhatsApp messaging:");
  console.log("1. Join Twilio WhatsApp Sandbox first:");
  console.log("   - Send 'join <sandbox-code>' to +1 415 523 8886");
  console.log("   - Get the sandbox code from Twilio Console");
  console.log("2. Uncomment the test sections above");
  console.log("3. Replace test phone numbers with your actual phone number (with country code)");
  console.log("4. Run: node testSMS.js");
  console.log("\n⚠️  Note: Your phone number must be registered in the Twilio WhatsApp Sandbox");
}

// Run the test
testWhatsAppFeature().catch(console.error);
