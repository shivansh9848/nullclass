import mongoose from "mongoose";
import Question from "../models/Question.js";
import {
  addPoints,
  POINT_ACTIONS,
  POINT_VALUES,
} from "../utils/pointsService.js";

export const postanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noofanswers, answerbody, useranswered, userid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  updatenoofquestion(_id, noofanswers);
  try {
    const updatequestion = await Question.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerbody, useranswered, userid }] },
    });

    // Award points for posting an answer
    await addPoints(
      userid,
      POINT_ACTIONS.ANSWER_QUESTION,
      POINT_VALUES.ANSWER_QUESTION,
      `Posted an answer to question: ${updatequestion.questiontitle}`,
      _id
    );

    res.status(200).json(updatequestion);
  } catch (error) {
    res.status(404).json({ message: "error in uploading" });
    return;
  }
};
const updatenoofquestion = async (_id, noofanswers) => {
  try {
    await Question.findByIdAndUpdate(_id, {
      $set: { noofanswers: noofanswers },
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerid, noofanswers } = req.body;
  const userid = req.userid;
  // console.log(_id,answerid,noofanswers)
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(404).send("answer unavailable...");
  }
  updatenoofquestion(_id, noofanswers);
  try {
    const question = await Question.findById(_id);
    const answer = question.answer.find((a) => a._id.toString() === answerid);

    await Question.updateOne({ _id }, { $pull: { answer: { _id: answerid } } });

    // Deduct points for deleting an answer
    if (answer && answer.userid) {
      await addPoints(
        answer.userid,
        POINT_ACTIONS.ANSWER_DELETED,
        POINT_VALUES.ANSWER_DELETED,
        `Answer deleted from question: ${question.questiontitle}`,
        _id
      );
    }

    res.status(200).json({ message: "successfully deleted.." });
  } catch (error) {
    res.status(404).json({ message: "error in deleting.." });
    return;
  }
};

export const voteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerid, value } = req.body;
  const userid = req.userid;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(404).send("answer unavailable...");
  }

  try {
    const question = await Question.findById(_id);
    const answerIndex = question.answer.findIndex(
      (a) => a._id.toString() === answerid
    );

    if (answerIndex === -1) {
      return res.status(404).send("answer not found...");
    }

    const answer = question.answer[answerIndex];
    const upindex = answer.upvote.findIndex((id) => id === String(userid));
    const downindex = answer.downvote.findIndex((id) => id === String(userid));

    let pointsChange = 0;
    let pointsAction = "";
    let pointsDescription = "";

    if (value === "upvote") {
      if (downindex !== -1) {
        answer.downvote = answer.downvote.filter((id) => id !== String(userid));
        pointsChange +=
          POINT_VALUES.ANSWER_UPVOTE - POINT_VALUES.ANSWER_DOWNVOTE; // Remove downvote penalty and add upvote bonus
        pointsAction = POINT_ACTIONS.ANSWER_UPVOTE;
        pointsDescription = `Answer received upvote (removed downvote)`;
      }
      if (upindex === -1) {
        answer.upvote.push(userid);
        if (downindex === -1) {
          // Only add points if wasn't previously downvoted
          pointsChange = POINT_VALUES.ANSWER_UPVOTE;
          pointsAction = POINT_ACTIONS.ANSWER_UPVOTE;
          pointsDescription = `Answer received upvote`;
        }
      } else {
        answer.upvote = answer.upvote.filter((id) => id !== String(userid));
        pointsChange = -POINT_VALUES.ANSWER_UPVOTE;
        pointsAction = POINT_ACTIONS.ANSWER_UPVOTE;
        pointsDescription = `Answer upvote removed`;
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        answer.upvote = answer.upvote.filter((id) => id !== String(userid));
        pointsChange +=
          POINT_VALUES.ANSWER_DOWNVOTE - POINT_VALUES.ANSWER_UPVOTE; // Remove upvote bonus and add downvote penalty
        pointsAction = POINT_ACTIONS.ANSWER_DOWNVOTE;
        pointsDescription = `Answer received downvote (removed upvote)`;
      }
      if (downindex === -1) {
        answer.downvote.push(userid);
        if (upindex === -1) {
          // Only subtract points if wasn't previously upvoted
          pointsChange = POINT_VALUES.ANSWER_DOWNVOTE;
          pointsAction = POINT_ACTIONS.ANSWER_DOWNVOTE;
          pointsDescription = `Answer received downvote`;
        }
      } else {
        answer.downvote = answer.downvote.filter((id) => id !== String(userid));
        pointsChange = -POINT_VALUES.ANSWER_DOWNVOTE;
        pointsAction = POINT_ACTIONS.ANSWER_DOWNVOTE;
        pointsDescription = `Answer downvote removed`;
      }
    }

    question.answer[answerIndex] = answer;
    await Question.findByIdAndUpdate(_id, question);

    // Award/deduct points to answer author
    if (pointsChange !== 0 && answer.userid) {
      await addPoints(
        answer.userid,
        pointsAction,
        pointsChange,
        pointsDescription,
        _id
      );
    }

    res.status(200).json({ message: "voted successfully.." });
  } catch (error) {
    res.status(404).json({ message: "error in voting" });
    return;
  }
};
