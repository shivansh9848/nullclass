import User from "../models/auth.js";
import mongoose from "mongoose";

export const POINT_ACTIONS = {
  ANSWER_QUESTION: "answer_question",
  ANSWER_UPVOTE: "answer_upvote",
  ANSWER_DOWNVOTE: "answer_downvote",
  ANSWER_DELETED: "answer_deleted",
  POINTS_TRANSFER_SENT: "points_transfer_sent",
  POINTS_TRANSFER_RECEIVED: "points_transfer_received",
};

export const POINT_VALUES = {
  ANSWER_QUESTION: 5,
  ANSWER_UPVOTE: 5,
  ANSWER_DOWNVOTE: -2,
  ANSWER_DELETED: -5,
};

export const BADGES = {
  FIRST_ANSWER: {
    name: "First Answer",
    description: "Posted your first answer",
    icon: "🎯",
  },
  HELPFUL_CONTRIBUTOR: {
    name: "Helpful Contributor",
    description: "Earned 50 points from answers",
    icon: "🌟",
  },
  EXPERT_CONTRIBUTOR: {
    name: "Expert Contributor",
    description: "Earned 100 points from answers",
    icon: "👑",
  },
  POPULAR_ANSWER: {
    name: "Popular Answer",
    description: "Answer received 10 upvotes",
    icon: "🔥",
  },
  GENEROUS_GIVER: {
    name: "Generous Giver",
    description: "Transferred points to other users",
    icon: "💝",
  },
};

export const addPoints = async (
  userId,
  action,
  points,
  description,
  relatedId = null
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Update points
    user.points += points;

    // Add to history
    user.pointsHistory.push({
      action,
      points,
      description,
      relatedId,
      timestamp: new Date(),
    });

    // Check and award badges
    await checkAndAwardBadges(user, action, points);

    await user.save();
    return user;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

export const transferPoints = async (senderId, receiverId, points) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      throw new Error("Invalid user ID");
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    if (sender.points < 10) {
      throw new Error(
        "Insufficient points. You need at least 10 points to transfer."
      );
    }

    if (sender.points < points) {
      throw new Error("Insufficient points to transfer");
    }

    // Transfer points
    sender.points -= points;
    receiver.points += points;

    // Add to history
    sender.pointsHistory.push({
      action: POINT_ACTIONS.POINTS_TRANSFER_SENT,
      points: -points,
      description: `Transferred ${points} points to ${receiver.name}`,
      relatedId: receiverId,
      timestamp: new Date(),
    });

    receiver.pointsHistory.push({
      action: POINT_ACTIONS.POINTS_TRANSFER_RECEIVED,
      points: points,
      description: `Received ${points} points from ${sender.name}`,
      relatedId: senderId,
      timestamp: new Date(),
    });

    // Check for generous giver badge
    const transfersSent = sender.pointsHistory.filter(
      (h) => h.action === POINT_ACTIONS.POINTS_TRANSFER_SENT
    ).length;
    if (
      transfersSent >= 1 &&
      !sender.badges.find((b) => b.name === BADGES.GENEROUS_GIVER.name)
    ) {
      sender.badges.push({
        ...BADGES.GENEROUS_GIVER,
        achievedOn: new Date(),
      });
    }

    await sender.save();
    await receiver.save();

    return { sender, receiver };
  } catch (error) {
    console.error("Error transferring points:", error);
    throw error;
  }
};

const checkAndAwardBadges = async (user, action, points) => {
  const existingBadgeNames = user.badges.map((b) => b.name);

  // First Answer Badge
  if (
    action === POINT_ACTIONS.ANSWER_QUESTION &&
    !existingBadgeNames.includes(BADGES.FIRST_ANSWER.name)
  ) {
    user.badges.push({
      ...BADGES.FIRST_ANSWER,
      achievedOn: new Date(),
    });
  }

  // Helpful Contributor Badge (50 points)
  if (
    user.points >= 50 &&
    !existingBadgeNames.includes(BADGES.HELPFUL_CONTRIBUTOR.name)
  ) {
    user.badges.push({
      ...BADGES.HELPFUL_CONTRIBUTOR,
      achievedOn: new Date(),
    });
  }

  // Expert Contributor Badge (100 points)
  if (
    user.points >= 100 &&
    !existingBadgeNames.includes(BADGES.EXPERT_CONTRIBUTOR.name)
  ) {
    user.badges.push({
      ...BADGES.EXPERT_CONTRIBUTOR,
      achievedOn: new Date(),
    });
  }
};

export const getPointsLeaderboard = async (limit = 10) => {
  try {
    const users = await User.find()
      .select("name points badges joinedon")
      .sort({ points: -1 })
      .limit(limit);

    return users;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
};

export const getUserPointsHistory = async (userId, limit = 20) => {
  try {
    const user = await User.findById(userId).select("pointsHistory");
    if (!user) {
      throw new Error("User not found");
    }

    return user.pointsHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting points history:", error);
    throw error;
  }
};
