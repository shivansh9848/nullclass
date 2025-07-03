import express from "express";
import multer from "multer";
import upload from "../config/multer.js";
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
