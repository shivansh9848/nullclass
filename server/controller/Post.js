import Post from "../models/Post.js";
import Friend from "../models/Friend.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

// Get posting limits based on friends count
const getPostingLimits = async (userId) => {
  const friendsCount = await Friend.countDocuments({
    $or: [
      { userId, status: "accepted" },
      { friendId: userId, status: "accepted" },
    ],
  });

  if (friendsCount === 0) {
    return { canPost: false, maxPosts: 0 };
  } else if (friendsCount === 1 || friendsCount === 2) {
    return { canPost: true, maxPosts: friendsCount };
  } else if (friendsCount > 10) {
    return { canPost: true, maxPosts: Infinity };
  } else {
    return { canPost: true, maxPosts: 1 };
  }
};

// Check if user can post today
const canPostToday = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayPostsCount = await Post.countDocuments({
    userId,
    createdAt: { $gte: today, $lt: tomorrow },
  });

  const limits = await getPostingLimits(userId);

  return {
    canPost:
      limits.canPost &&
      (limits.maxPosts === Infinity || todayPostsCount < limits.maxPosts),
    postsToday: todayPostsCount,
    maxPosts: limits.maxPosts,
    friendsRequired: limits.maxPosts === 0,
  };
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, visibility = "public" } = req.body;
    const userId = req.userId;

    // Check if user can post today
    const postingStatus = await canPostToday(userId);
    if (!postingStatus.canPost) {
      if (postingStatus.friendsRequired) {
        return res.status(403).json({
          message: "You need at least 1 friend to post in the public space",
        });
      } else {
        return res.status(403).json({
          message: `You have reached your daily posting limit (${postingStatus.maxPosts} posts)`,
        });
      }
    }

    const newPost = new Post({
      userId,
      content,
      visibility,
      media: req.files
        ? req.files.map((file) => ({
            type: file.mimetype.startsWith("image/") ? "image" : "video",
            url: file.path, // Cloudinary URL
            filename: file.filename || file.public_id, // Cloudinary public_id
            public_id: file.public_id, // Store Cloudinary public_id for deletion
          }))
        : [],
    });

    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate("userId", "name email")
      .populate("comments.userId", "name email")
      .populate("likes.userId", "name email");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all public posts
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ visibility: "public" })
      .populate("userId", "name email")
      .populate("comments.userId", "name email")
      .populate("likes.userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments({ visibility: "public" });

    res.status(200).json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId })
      .populate("userId", "name email")
      .populate("comments.userId", "name email")
      .populate("likes.userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments({ userId });

    res.status(200).json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.userId.toString() === userId
    );

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push({ userId });
    }

    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("userId", "name email")
      .populate("comments.userId", "name email")
      .populate("likes.userId", "name email");

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      userId,
      content,
    });

    await post.save();

    const populatedPost = await Post.findById(postId)
      .populate("userId", "name email")
      .populate("comments.userId", "name email")
      .populate("likes.userId", "name email");

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Share a post
export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const shareIndex = post.shares.findIndex(
      (share) => share.userId.toString() === userId
    );

    if (shareIndex === -1) {
      post.shares.push({ userId });
      await post.save();
    }

    const populatedPost = await Post.findById(postId)
      .populate("userId", "name email")
      .populate("comments.userId", "name email")
      .populate("likes.userId", "name email");

    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get posting status for current user
export const getPostingStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const status = await canPostToday(userId);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete media files from Cloudinary
    await Promise.all(
      post.media.map((file) => cloudinary.v2.uploader.destroy(file.public_id))
    );

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
