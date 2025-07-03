import Question from "../models/Question.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

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
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          // Stream the file buffer to Cloudinary
          uploadStream.end(req.file.buffer);
        });

        videoUrl = uploadResult.secure_url;
        videoPublicId = uploadResult.public_id;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json("Failed to upload video");
      }
    }

    const questionData = {
      questiontitle,
      questionbody,
      questiontags: JSON.parse(questiontag),
      userposted,
      userid,
      videoUrl,
      videoPublicId,
    };

    const postquestion = new Question(questionData);
    await postquestion.save();

    res.status(200).json("Posted a question with video successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Couldn't post a new question");
  }
};

export const getallquestion = async (req, res) => {
  try {
    const questionlist = await Question.find().sort({ askedon: -1 });
    res.status(200).json(questionlist);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
    return;
  }
};

export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  try {
    await Question.findByIdAndDelete(_id);
    res.status(200).json({ message: "successfully deletd..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
    return;
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
    const upindex = question.upvote.findIndex((id) => id === String(userid));
    const downindex = question.downvote.findIndex(
      (id) => id === String(userid)
    );
    if (value === "upvote") {
      if (downindex !== -1) {
        question.downvote = question.downvote.filter(
          (id) => id !== String(userid)
        );
      }
      if (upindex === -1) {
        question.upvote.push(userid);
      } else {
        question.upvote = question.upvote.filter((id) => id !== String(userid));
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        question.upvote = question.upvote.filter((id) => id !== String(userid));
      }
      if (downindex === -1) {
        question.downvote.push(userid);
      } else {
        question.downvote = question.downvote.filter(
          (id) => id !== String(userid)
        );
      }
    }
    await Question.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully.." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
    return;
  }
};
