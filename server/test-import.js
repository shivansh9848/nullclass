// Test importing cloudinary config
import { cloudinary, storage } from "./config/cloudinary.js";

console.log("Testing cloudinary import...");
console.log("Cloudinary config:", cloudinary.config());
console.log("Storage configured:", storage ? "✅" : "❌");

// Test that cloudinary is properly configured
const config = cloudinary.config();
if (config.cloud_name && config.api_key && config.api_secret) {
  console.log("✅ Cloudinary configuration is valid");
} else {
  console.log("❌ Cloudinary configuration is missing values");
  console.log("cloud_name:", config.cloud_name);
  console.log("api_key:", config.api_key);
  console.log("api_secret:", config.api_secret ? "***" : "missing");
}
