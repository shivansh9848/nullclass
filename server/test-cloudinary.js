// Test script to verify Cloudinary configuration
// Run this with: node test-cloudinary.js

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary using individual environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinaryConfig() {
  console.log("🧪 Testing Cloudinary Configuration...\n");

  try {
    // Test 1: Check if individual environment variables are set
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.log("❌ Cloudinary environment variables are not set");
      console.log(
        "Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file"
      );
      console.log("Missing variables:");
      if (!process.env.CLOUDINARY_CLOUD_NAME)
        console.log("  - CLOUDINARY_CLOUD_NAME");
      if (!process.env.CLOUDINARY_API_KEY)
        console.log("  - CLOUDINARY_API_KEY");
      if (!process.env.CLOUDINARY_API_SECRET)
        console.log("  - CLOUDINARY_API_SECRET");
      return;
    }

    console.log("✅ All Cloudinary environment variables are set");

    // Test 2: Check API connectivity
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary API connection successful");
    console.log("📊 API Status:", result.status);

    // Test 3: Get account information
    const usage = await cloudinary.api.usage();
    console.log("✅ Successfully retrieved account usage");
    console.log(
      "📈 Storage Used:",
      Math.round(usage.storage.used_bytes / 1024 / 1024),
      "MB"
    );
    console.log(
      "📈 Bandwidth Used:",
      Math.round(usage.bandwidth.used_bytes / 1024 / 1024),
      "MB"
    );
    console.log("📈 Transformations Used:", usage.transformations.used_count);

    console.log("\n🎉 Cloudinary configuration is working correctly!");
    console.log("Your Public Space is ready to handle file uploads!");
  } catch (error) {
    console.log("❌ Cloudinary configuration error:");
    console.log(error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log(
      "1. Check if CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are correctly set in .env"
    );
    console.log("2. Verify your Cloudinary credentials from your dashboard");
    console.log("3. Ensure your Cloudinary account is active");
  }
}

// Run the test
testCloudinaryConfig();
