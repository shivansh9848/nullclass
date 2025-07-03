import * as api from "../api";

export const askquestion = (questiondata, navigate) => async (dispatch) => {
  try {
    let data;

    if (questiondata.video) {
      // If video is included, send as FormData
      const formData = new FormData();
      formData.append("questiontitle", questiondata.questiontitle);
      formData.append("questionbody", questiondata.questionbody);
      formData.append("questiontag", JSON.stringify(questiondata.questiontag));
      formData.append("userposted", questiondata.userposted);
      formData.append("video", questiondata.video);

      const response = await api.postquestionwithvideo(formData);
      data = response.data;
    } else {
      // Regular question without video
      const response = await api.postquestion(questiondata);
      data = response.data;
    }

    dispatch({ type: "POST_QUESTION", payload: data });
    dispatch(fetchallquestion());
    navigate("/");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchallquestion = () => async (dispatch) => {
  try {
    const { data } = await api.getallquestions();
    dispatch({ type: "FETCH_ALL_QUESTIONS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deletequestion = (id, navigate) => async (dispatch) => {
  try {
    await api.deletequestion(id);
    dispatch(fetchallquestion());
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const votequestion = (id, value) => async (dispatch) => {
  try {
    await api.votequestion(id, value);
    dispatch(fetchallquestion());
  } catch (error) {
    console.log(error);
  }
};

export const postanswer = (answerdata) => async (dispatch) => {
  try {
    const { id, noofanswers, answerbody, useranswered, userid } = answerdata;
    const { data } = await api.postanswer(
      id,
      noofanswers,
      answerbody,
      useranswered,
      userid
    );
    dispatch({ type: "POST_ANSWER", payload: data });
    dispatch(fetchallquestion());
  } catch (error) {
    console.log(error);
  }
};

export const deleteanswer = (id, answerid, noofanswers) => async (dispatch) => {
  try {
    await api.deleteanswer(id, answerid, noofanswers);
    dispatch(fetchallquestion());
  } catch (error) {
    console.log(error);
  }
};
