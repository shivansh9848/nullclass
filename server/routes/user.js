import express from "express";
import { login, signup } from "../controller/auth.js";
import {
  getallusers,
  updateprofile,
  transferUserPoints,
  getLeaderboard,
  getUserPoints,
  searchUsers,
} from "../controller/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/getallusers", getallusers);
router.get("/search", searchUsers);
router.get("/leaderboard", getLeaderboard);
router.get("/points/:id", getUserPoints);

router.patch("/update/:id", auth, updateprofile);
router.post("/transfer-points", auth, transferUserPoints);

export default router;
