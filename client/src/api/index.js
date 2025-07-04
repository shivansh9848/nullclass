import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

export const login = (authdata) => API.post("user/login", authdata);
export const signup = (authdata) => API.post("user/signup", authdata);
export const getallusers = () => API.get("/user/getallusers");
export const updateprofile = (id, updatedata) =>
  API.patch(`user/update/${id}`, updatedata);

export const postquestion = (questiondata) =>
  API.post("/questions/Ask", questiondata);
export const postquestionwithvideo = (formData) =>
  API.post("/questions/Ask/video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) =>
  API.patch(`/questions/vote/${id}`, { value });

export const postanswer = (id, noofanswers, answerbody, useranswered, userid) =>
  API.patch(`/answer/post/${id}`, {
    noofanswers,
    answerbody,
    useranswered,
    userid,
  });
export const deleteanswer = (id, answerid, noofanswers) =>
  API.patch(`/answer/delete/${id}`, { answerid, noofanswers });

// OTP verification endpoints
export const sendOTP = (email) => API.post("/api/send-otp", { email });
export const verifyOTP = (email, otp) =>
  API.post("/api/verify-otp", { email, otp });

// Points and rewards API
export const transferPoints = (receiverId, points) =>
  API.post("/user/transfer-points", { receiverId, points });

export const getLeaderboard = (limit = 10) =>
  API.get(`/user/leaderboard?limit=${limit}`);

export const getUserPoints = (userId) => API.get(`/user/points/${userId}`);

export const searchUsers = (query) => API.get(`/user/search?query=${query}`);

export const voteAnswer = (questionId, answerid, value) =>
  API.patch(`/answer/vote/${questionId}`, { answerid, value });
