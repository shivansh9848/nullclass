import express from "express";
import {
  Askquestion,
  AskquestionWithVideo,
  getallquestion,
  deletequestion,
  votequestion,
} from "../controller/Question.js";
import auth from "../middleware/auth.js";
import { checkVideoUploadTime } from "../middleware/videoUpload.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/Ask", auth, Askquestion);
router.post(
  "/Ask/video",
  auth,
  checkVideoUploadTime,
  upload.single("video"),
  AskquestionWithVideo
);
router.get("/get", getallquestion);
router.delete("/delete/:id", auth, deletequestion);
router.patch("/vote/:id", auth, votequestion);

export default router;
