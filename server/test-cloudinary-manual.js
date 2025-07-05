// Manual test to verify Cloudinary credentials work
import { v2 as cloudinary } from "cloudinary";

// Manually set the credentials (replace with your actual values)
cloudinary.config({
  cloud_name: "dwn4dsa7z",
  api_key: "594691339365792",
  api_secret: "EgxqhrN4LoKy8aXBdhLADvgK5Uk",
});

console.log("Testing Cloudinary with manual credentials...");

// Test 1: Check configuration
const config = cloudinary.config();
console.log("Config result:", {
  cloud_name: config.cloud_name,
  api_key: config.api_key ? "SET" : "NOT SET",
  api_secret: config.api_secret ? "SET" : "NOT SET",
});

// Test 2: Try to list resources
try {
  const result = await cloudinary.api.resources({ max_results: 1 });
  console.log("✅ Cloudinary API test successful");
  console.log("Resources:", result.resources.length);
} catch (error) {
  console.error("❌ Cloudinary API test failed:", error.message);
}

// Test 3: Try to upload a test image
try {
  // Create a simple test image (1x1 pixel PNG)
  const testImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

  const uploadResult = await cloudinary.uploader.upload(testImage, {
    folder: "test",
    public_id: "test_upload_" + Date.now(),
  });

  console.log("✅ Test upload successful");
  console.log("URL:", uploadResult.secure_url);

  // Clean up
  await cloudinary.uploader.destroy(uploadResult.public_id);
  console.log("✅ Test image cleaned up");
} catch (error) {
  console.error("❌ Test upload failed:", error.message);
  console.error("Error details:", error);
}
