// Simple test script to verify Cloudinary configuration
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Configuration Test");
console.log("============================");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
);

// Test Cloudinary connection
async function testCloudinaryConnection() {
  try {
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log("✅ Cloudinary connection successful!");
    console.log("Resources found:", result.resources.length);
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    return false;
  }
}

// Test image upload
async function testImageUpload() {
  try {
    // Create a simple test image buffer (1x1 transparent PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "posts",
            public_id: `test_image_${Date.now()}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(testImageBuffer);
    });

    console.log("✅ Test image upload successful!");
    console.log("Image URL:", result.secure_url);

    // Clean up test image
    await cloudinary.uploader.destroy(result.public_id);
    console.log("✅ Test image cleaned up");

    return true;
  } catch (error) {
    console.error("❌ Test image upload failed:", error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("\n1. Testing Cloudinary connection...");
  const connectionOk = await testCloudinaryConnection();

  if (connectionOk) {
    console.log("\n2. Testing image upload...");
    await testImageUpload();
  }

  console.log("\n============================");
  console.log("Test completed");
}

runTests();
