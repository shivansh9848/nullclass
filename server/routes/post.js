import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import {
  createPost,
  getAllPosts,
  getUserPosts,
  toggleLike,
  addComment,
  sharePost,
  getPostingStatus,
  deletePost,
} from "../controller/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Configure multer with Cloudinary storage
const fileFilter = (req, file, cb) => {
  // Accept images and videos
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Routes
router.post("/", auth, upload.array("media", 5), createPost);
router.get("/", getAllPosts);
router.get("/status", auth, getPostingStatus);
router.get("/user/:userId", getUserPosts);
router.post("/:postId/like", auth, toggleLike);
router.post("/:postId/comment", auth, addComment);
router.post("/:postId/share", auth, sharePost);
router.delete("/:postId", auth, deletePost);

export default router;
