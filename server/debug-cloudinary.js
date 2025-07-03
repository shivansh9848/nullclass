// Debug script to check what's happening with Cloudinary config
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("Environment variables:");
console.log("CLOUDINARY_URL:", process.env.CLOUDINARY_URL);
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.API_KEY);
console.log("API_SECRET:", process.env.API_SECRET);

// Test the configuration
if (process.env.CLOUDINARY_URL) {
  console.log("\nUsing CLOUDINARY_URL configuration...");
  cloudinary.config();
} else {
  console.log("\nUsing individual environment variables...");
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
}

console.log("\nCloudinary config result:");
console.log("cloud_name:", cloudinary.config().cloud_name);
console.log("api_key:", cloudinary.config().api_key);
console.log("api_secret:", cloudinary.config().api_secret ? "SET" : "NOT SET");
