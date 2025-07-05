import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

// Diagnostic function to check post media issues
export const diagnosePostMedia = async (req, res) => {
  try {
    console.log("=== POST MEDIA DIAGNOSTIC ===");

    // 1. Check Cloudinary configuration
    console.log("1. Checking Cloudinary configuration...");
    const cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
    };
    console.log("Cloudinary config:", cloudinaryConfig);

    // 2. Test Cloudinary connection
    console.log("2. Testing Cloudinary connection...");
    try {
      const resources = await cloudinary.api.resources({ max_results: 1 });
      console.log("✅ Cloudinary connection successful");
    } catch (error) {
      console.log("❌ Cloudinary connection failed:", error.message);
    }

    // 3. Check recent posts with media
    console.log("3. Checking recent posts with media...");
    const postsWithMedia = await Post.find({
      media: { $exists: true, $ne: [] },
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`Found ${postsWithMedia.length} posts with media`);

    // 4. Check media URLs
    console.log("4. Checking media URLs...");
    const mediaUrls = [];
    postsWithMedia.forEach((post, index) => {
      console.log(`Post ${index + 1} by ${post.userId?.name || "Unknown"}:`);
      console.log(`  Content: ${post.content.substring(0, 50)}...`);
      console.log(`  Media count: ${post.media.length}`);

      post.media.forEach((media, mediaIndex) => {
        console.log(`  Media ${mediaIndex + 1}:`, {
          type: media.type,
          url: media.url,
          filename: media.filename,
          public_id: media.public_id,
        });
        mediaUrls.push(media.url);
      });
    });

    // 5. Test media URL accessibility
    console.log("5. Testing media URL accessibility...");
    const urlTestResults = [];

    // For Node.js, we'll just check if URLs are properly formatted
    for (const url of mediaUrls.slice(0, 3)) {
      // Test first 3 URLs
      try {
        const urlObj = new URL(url);
        const isCloudinaryUrl = urlObj.hostname.includes("cloudinary.com");
        const isSecure = urlObj.protocol === "https:";

        urlTestResults.push({
          url,
          status: "URL_CHECK",
          accessible: isCloudinaryUrl && isSecure,
          isCloudinary: isCloudinaryUrl,
          isSecure: isSecure,
        });
        console.log(
          `  ${url}: ${
            isCloudinaryUrl && isSecure
              ? "✅ Valid Cloudinary URL"
              : "❌ Invalid URL"
          }`
        );
      } catch (error) {
        urlTestResults.push({
          url,
          status: "INVALID_URL",
          accessible: false,
          error: error.message,
        });
        console.log(`  ${url}: INVALID URL - ${error.message} ❌`);
      }
    }

    // 6. Summary
    const summary = {
      cloudinaryConfigured: !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
      postsWithMediaCount: postsWithMedia.length,
      totalMediaItems: postsWithMedia.reduce(
        (sum, post) => sum + post.media.length,
        0
      ),
      urlTestResults,
      recommendations: [],
    };

    if (!summary.cloudinaryConfigured) {
      summary.recommendations.push(
        "Configure Cloudinary environment variables"
      );
    }

    if (summary.postsWithMediaCount === 0) {
      summary.recommendations.push(
        "No posts with media found - check file upload process"
      );
    }

    const failedUrls = urlTestResults.filter((result) => !result.accessible);
    if (failedUrls.length > 0) {
      summary.recommendations.push(
        `${failedUrls.length} media URLs are not accessible - check Cloudinary settings`
      );
    }

    console.log("=== DIAGNOSTIC SUMMARY ===");
    console.log(summary);

    res.json({
      success: true,
      diagnostic: summary,
      postsWithMedia: postsWithMedia.map((post) => ({
        id: post._id,
        content: post.content.substring(0, 50) + "...",
        mediaCount: post.media.length,
        media: post.media,
      })),
    });
  } catch (error) {
    console.error("Diagnostic error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
