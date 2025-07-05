import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure multer with memory storage
const storage = multer.memoryStorage();

// File filter for image and video files
const fileFilter = (req, file, cb) => {
  // Check if file is an image or video
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter,
});

// Middleware to upload files to Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const resourceType = file.mimetype.startsWith("image/")
          ? "image"
          : "video";

        cloudinary.uploader
          .upload_stream(
            {
              resource_type: resourceType,
              folder: "posts",
              quality: "auto:good",
              fetch_format: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  ...file,
                  path: result.secure_url,
                  filename: result.public_id,
                  public_id: result.public_id,
                });
              }
            }
          )
          .end(file.buffer);
      });
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    req.files = uploadedFiles;
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

export default upload;
