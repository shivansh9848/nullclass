import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "publicspace",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "webm", "mov", "avi"],

    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      return `${file.fieldname}_${timestamp}_${randomString}`;
    },

    // REMOVE transformation from here; apply transformation via Cloudinary URL when needed.
  },
});

export { cloudinary, storage };
