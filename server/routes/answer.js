import express from "express";
import { postanswer, deleteanswer, voteanswer } from "../controller/Answer.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.patch("/post/:id", auth, postanswer);
router.patch("/delete/:id", auth, deleteanswer);
router.patch("/vote/:id", auth, voteanswer);

export default router;
