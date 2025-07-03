import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  getFriends,
  removeFriend,
  getFriendSuggestions,
  getFriendsCount,
} from "../controller/Friend.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Routes
router.post("/request", auth, sendFriendRequest);
router.put("/accept/:requestId", auth, acceptFriendRequest);
router.delete("/reject/:requestId", auth, rejectFriendRequest);
router.get("/pending", auth, getPendingRequests);
router.get("/", auth, getFriends);
router.get("/count", auth, getFriendsCount);
router.get("/suggestions", auth, getFriendSuggestions);
router.delete("/:friendId", auth, removeFriend);

export default router;
