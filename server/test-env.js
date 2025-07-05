// Simple test to verify environment variables are loaded
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const result = dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Environment Variables Test");
console.log("==========================");

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("✅ .env file loaded successfully");
}

console.log("\nCloudinary Environment Variables:");
console.log(
  "CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME || "NOT SET"
);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY || "NOT SET");
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
);

console.log("\nOther Environment Variables:");
console.log("NODE_ENV:", process.env.NODE_ENV || "NOT SET");
console.log("PORT:", process.env.PORT || "NOT SET");
console.log("MONGODB_URL:", process.env.MONGODB_URL ? "SET" : "NOT SET");

console.log("\nAll environment variables:");
Object.keys(process.env).forEach((key) => {
  if (key.startsWith("CLOUDINARY_")) {
    console.log(`${key}: ${process.env[key] ? "SET" : "NOT SET"}`);
  }
});
