import Question from "../models/Question.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const testCloudinaryConfig = async (req, res) => {
  try {
    console.log("Testing Cloudinary configuration...");
    console.log("Environment variables:");
    console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
    console.log(
      "CLOUDINARY_API_SECRET:",
      process.env.CLOUDINARY_API_SECRET ? "***SET***" : "NOT SET"
    );

    // Test cloudinary config
    const config = cloudinary.config();
    console.log("Cloudinary config:", config);

    res.json({
      success: true,
      config: {
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret ? "***SET***" : "NOT SET",
      },
    });
  } catch (error) {
    console.error("Error testing Cloudinary config:", error);
    res.status(500).json({ error: error.message });
  }
};

export const Askquestion = async (req, res) => {
  const postquestiondata = req.body;
  const userid = req.userid;
  const postquestion = new Question({ ...postquestiondata, userid });
  try {
    await postquestion.save();
    res.status(200).json("Posted a question successfully");
  } catch (error) {
    console.log(error);
    res.status(404).json("couldn't post a new question");
    return;
  }
};

export const AskquestionWithVideo = async (req, res) => {
  try {
    const { questiontitle, questionbody, questiontag, userposted } = req.body;
    const userid = req.userid;

    let videoUrl = null;
    let videoPublicId = null;

    // If video file is uploaded
    if (req.file) {
      try {
        console.log("Video upload: Starting Cloudinary upload...");

        // Ensure Cloudinary is configured before use
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        console.log("Cloudinary config check:", {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
          api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
        });

        // Check cloudinary instance
        const config = cloudinary.config();
        console.log("Cloudinary configured values:", {
          cloud_name: config.cloud_name,
          api_key: config.api_key,
          api_secret: config.api_secret ? "SET" : "NOT SET",
        });

        // Upload video to Cloudinary using upload_stream
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "question_videos",
              public_id: `question_${Date.now()}`,
              transformation: [{ quality: "auto" }, { format: "mp4" }],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Cloudinary upload successful:", result.secure_url);
                resolve(result);
              }
            }
          );

          // Write the buffer to the stream
          uploadStream.end(req.file.buffer);
        });

        videoUrl = uploadResult.secure_url;
        videoPublicId = uploadResult.public_id;
        console.log("Video uploaded successfully:", videoUrl);
      } catch (error) {
        console.error("Error uploading video:", error);
        return res.status(500).json({
          message: "Failed to upload video",
          error: error.message,
        });
      }
    }

    // Create question with video URL
    const questionData = {
      questiontitle,
      questionbody,
      questiontag,
      userposted,
      userid,
      videoUrl,
      videoPublicId,
      askedon: new Date(),
      noofanswers: 0,
      upvote: [],
      downvote: [],
    };

    const question = new Question(questionData);
    await question.save();

    res.status(200).json({
      message: "Question posted successfully with video",
      question: question,
    });
  } catch (error) {
    console.error("Error posting question:", error);
    res.status(500).json({
      message: "Failed to post question",
      error: error.message,
    });
  }
};

export const getallquestion = async (req, res) => {
  try {
    const questionList = await Question.find().sort({ askedon: -1 });
    res.status(200).json(questionList);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    await Question.findByIdAndDelete(_id);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const votequestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value } = req.body;
  const userid = req.userid;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const question = await Question.findById(_id);
    const upIndex = question.upvote.findIndex((id) => id === String(userid));
    const downIndex = question.downvote.findIndex(
      (id) => id === String(userid)
    );

    if (value === "upvote") {
      if (downIndex !== -1) {
        question.downvote = question.downvote.filter(
          (id) => id !== String(userid)
        );
      }
      if (upIndex === -1) {
        question.upvote.push(userid);
      } else {
        question.upvote = question.upvote.filter((id) => id !== String(userid));
      }
    } else if (value === "downvote") {
      if (upIndex !== -1) {
        question.upvote = question.upvote.filter((id) => id !== String(userid));
      }
      if (downIndex === -1) {
        question.downvote.push(userid);
      } else {
        question.downvote = question.downvote.filter(
          (id) => id !== String(userid)
        );
      }
    }
    await Question.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};
