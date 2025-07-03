import mongoose from "mongoose";
import users from "../models/auth.js";
import {
  transferPoints,
  getPointsLeaderboard,
  getUserPointsHistory,
} from "../utils/pointsService.js";

export const getallusers = async (req, res) => {
  try {
    const allusers = await users.find();
    const alluserdetails = [];
    allusers.forEach((user) => {
      alluserdetails.push({
        _id: user._id,
        name: user.name,
        about: user.about,
        tags: user.tags,
        joinedon: user.joinedon,
        points: user.points,
        badges: user.badges,
      });
    });
    res.status(200).json(alluserdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
    return;
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("user unavailable");
  }
  try {
    const updateprofile = await users.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json(updateprofile);
  } catch (error) {
    res.status(404).json({ message: error.message });
    return;
  }
};

export const transferUserPoints = async (req, res) => {
  const { receiverId, points } = req.body;
  const senderId = req.userid;

  try {
    const result = await transferPoints(senderId, receiverId, points);
    res.status(200).json({
      message: "Points transferred successfully",
      sender: {
        id: result.sender._id,
        name: result.sender.name,
        points: result.sender.points,
      },
      receiver: {
        id: result.receiver._id,
        name: result.receiver.name,
        points: result.receiver.points,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getPointsLeaderboard(limit);
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPoints = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("user unavailable");
  }

  try {
    const user = await users
      .findById(_id)
      .select("points badges pointsHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      points: user.points,
      badges: user.badges,
      pointsHistory: user.pointsHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 20),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  const { query } = req.query;

  try {
    const users_found = await users
      .find({
        name: { $regex: query, $options: "i" },
      })
      .select("_id name points badges joinedon")
      .limit(10);

    res.status(200).json(users_found);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
