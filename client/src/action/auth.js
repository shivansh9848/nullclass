import * as api from "../api";
import { setcurrentuser } from "./currentuser";
import { fetchallusers } from "./users";
export const signup = (authdata, naviagte) => async (dispatch) => {
  try {
    const { data } = await api.signup(authdata);
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(data));
    dispatch(fetchallusers());
    naviagte("/");
  } catch (error) {
    console.log(error);
  }
};
export const login = (authdata, naviagte) => async (dispatch) => {
  try {
    const { data } = await api.login(authdata);
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(data));
    naviagte("/");
  } catch (error) {
    console.log(error);
  }
};
