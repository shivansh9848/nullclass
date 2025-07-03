import * as api from "../api";
export const fetchallusers = () => async (dispatch) => {
  try {
    const { data } = await api.getallusers();
    dispatch({ type: "FETCH_USERS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateprofile = (id, updatedata) => async (dispatch) => {
  try {
    const { data } = await api.updateprofile(id, updatedata);
    dispatch({ type: "UPDATE_CURRENT_USER", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const transferPoints = (receiverId, points) => async (dispatch) => {
  try {
    const { data } = await api.transferPoints(receiverId, points);
    dispatch({ type: "TRANSFER_POINTS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: "TRANSFER_POINTS_ERROR",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const getLeaderboard =
  (limit = 10) =>
  async (dispatch) => {
    try {
      const { data } = await api.getLeaderboard(limit);
      dispatch({ type: "FETCH_LEADERBOARD", payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const getUserPoints = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getUserPoints(userId);
    dispatch({ type: "FETCH_USER_POINTS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = (query) => async (dispatch) => {
  try {
    const { data } = await api.searchUsers(query);
    dispatch({ type: "SEARCH_USERS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const voteAnswer = (questionId, answerid, value) => async (dispatch) => {
  try {
    const { data } = await api.voteAnswer(questionId, answerid, value);
    dispatch({ type: "VOTE_ANSWER", payload: data });
  } catch (error) {
    console.log(error);
  }
};
