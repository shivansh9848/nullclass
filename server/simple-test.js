// Simple test to verify Cloudinary configuration
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("Testing Cloudinary Configuration...");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

console.log("Environment variables:");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.API_KEY);
console.log("API_SECRET:", process.env.API_SECRET ? "SET" : "NOT SET");

console.log("\nCloudinary config:");
console.log("cloud_name:", cloudinary.config().cloud_name);
console.log("api_key:", cloudinary.config().api_key);
console.log("api_secret:", cloudinary.config().api_secret ? "SET" : "NOT SET");

// Test basic connectivity
async function testConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful!");
    console.log("API Status:", result.status);
  } catch (error) {
    console.log("❌ Cloudinary connection failed:");
    console.log(error.message);
  }
}

testConnection();
