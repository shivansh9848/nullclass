// Twilio Credentials Test
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

console.log("🔍 Debugging Twilio Authentication...\n");

// Check if credentials are loaded
console.log("1. Environment Variables:");
console.log(`   TWILIO_SID: ${process.env.TWILIO_SID ? `${process.env.TWILIO_SID.substring(0, 8)}...` : "❌ Not found"}`);
console.log(`   TWILIO_TOKEN: ${process.env.TWILIO_TOKEN ? `${process.env.TWILIO_TOKEN.substring(0, 8)}...` : "❌ Not found"}`);

// Check credential format
console.log("\n2. Credential Format Check:");
if (process.env.TWILIO_SID) {
  if (process.env.TWILIO_SID.startsWith("AC")) {
    console.log("   ✅ Account SID format looks correct (starts with AC)");
  } else {
    console.log("   ❌ Account SID should start with 'AC'");
  }
} else {
  console.log("   ❌ Account SID not found");
}

if (process.env.TWILIO_TOKEN) {
  if (process.env.TWILIO_TOKEN.length >= 32) {
    console.log("   ✅ Auth Token length looks correct (32+ characters)");
  } else {
    console.log("   ❌ Auth Token seems too short (should be 32+ characters)");
  }
} else {
  console.log("   ❌ Auth Token not found");
}

// Test Twilio client creation
console.log("\n3. Twilio Client Test:");
try {
  if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    console.log("   ✅ Twilio client created successfully");
    
    // Test account validation
    console.log("\n4. Testing Account Validation:");
    try {
      const account = await client.api.accounts(process.env.TWILIO_SID).fetch();
      console.log(`   ✅ Account validated: ${account.friendlyName}`);
      console.log(`   ✅ Account Status: ${account.status}`);
    } catch (error) {
      console.log(`   ❌ Account validation failed: ${error.message}`);
      if (error.message.includes("authenticate")) {
        console.log("   💡 This means your TWILIO_SID or TWILIO_TOKEN is incorrect");
      }
    }
  } else {
    console.log("   ❌ Missing credentials - cannot create client");
  }
} catch (error) {
  console.log(`   ❌ Error creating client: ${error.message}`);
}

console.log("\n🛠️ Troubleshooting Steps:");
console.log("1. Check your .env file exists and has correct credentials");
console.log("2. Verify credentials from Twilio Console: https://console.twilio.com");
console.log("3. Make sure Account SID starts with 'AC'");
console.log("4. Make sure Auth Token is 32+ characters");
console.log("5. Restart your server after updating .env");
