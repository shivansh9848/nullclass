import Friend from "../models/Friend.js";
import User from "../models/auth.js";
import mongoose from "mongoose";

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.userId;

    if (userId === friendId) {
      return res
        .status(400)
        .json({ message: "Cannot send friend request to yourself" });
    }

    // Check if friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if friendship already exists
    const existingFriendship = await Friend.findOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    if (existingFriendship) {
      return res
        .status(400)
        .json({
          message: "Friend request already exists or you are already friends",
        });
    }

    const newFriendRequest = new Friend({
      userId,
      friendId,
      initiatedBy: userId,
      status: "pending",
    });

    await newFriendRequest.save();
    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Check if the current user is the recipient of the friend request
    if (friendRequest.friendId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this friend request" });
    }

    friendRequest.status = "accepted";
    friendRequest.updatedAt = new Date();
    await friendRequest.save();

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    const friendRequest = await Friend.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Check if the current user is the recipient of the friend request
    if (friendRequest.friendId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this friend request" });
    }

    await Friend.findByIdAndDelete(requestId);
    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending friend requests
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const pendingRequests = await Friend.find({
      friendId: userId,
      status: "pending",
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get friends list
export const getFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const friends = await Friend.find({
      $or: [
        { userId, status: "accepted" },
        { friendId: userId, status: "accepted" },
      ],
    })
      .populate("userId", "name email")
      .populate("friendId", "name email")
      .sort({ updatedAt: -1 });

    // Format the response to show the friend's details
    const formattedFriends = friends.map((friendship) => {
      const friend =
        friendship.userId.toString() === userId
          ? friendship.friendId
          : friendship.userId;

      return {
        _id: friendship._id,
        friend,
        since: friendship.updatedAt,
      };
    });

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.userId;

    const friendship = await Friend.findOne({
      $or: [
        { userId, friendId, status: "accepted" },
        { userId: friendId, friendId: userId, status: "accepted" },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    await Friend.findByIdAndDelete(friendship._id);
    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get friend suggestions (users who are not friends yet)
export const getFriendSuggestions = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get all existing friendships for the user
    const existingFriends = await Friend.find({
      $or: [{ userId }, { friendId: userId }],
    });

    // Extract friend IDs
    const friendIds = existingFriends.map((friendship) =>
      friendship.userId.toString() === userId
        ? friendship.friendId.toString()
        : friendship.userId.toString()
    );

    // Add the current user ID to exclude from suggestions
    friendIds.push(userId);

    // Find users who are not friends with the current user
    const suggestions = await User.find({
      _id: { $nin: friendIds },
    })
      .select("name email joinedon")
      .skip(skip)
      .limit(parseInt(limit));

    const totalSuggestions = await User.countDocuments({
      _id: { $nin: friendIds },
    });

    res.status(200).json({
      suggestions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSuggestions / limit),
      totalSuggestions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get friends count
export const getFriendsCount = async (req, res) => {
  try {
    const userId = req.userId;

    const friendsCount = await Friend.countDocuments({
      $or: [
        { userId, status: "accepted" },
        { friendId: userId, status: "accepted" },
      ],
    });

    res.status(200).json({ count: friendsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
