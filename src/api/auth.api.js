import axios from "axios";
import { toast } from "react-toastify";
const url = "http://localhost:5001/";
export const login = async (email, password) => {
  if (!email || !password)
    return toast("Fields are required", { type: "error" });
  let result = null;
  await axios
    .post(`${url}login`, {
      username: email,
      password,
    })
    .then((res) => {
      result = { status: "success", token: res.data.token };
    })
    .catch((err) => {
      result = { status: "error" };
    });
  return result;
};
export const singup = async (email, password, firstName, lastName, id) => {
  if (!email || !password || !firstName || !lastName || !id)
    return toast("Fields are required");
  let result = null;
  axios
    .post(`${url}signup`, {
      username: email,
      password,
      firstname: firstName,
      lastname: lastName,
      card_id: id,
    })
    .then((res) => {
      result = { status: "success" };
    })
    .catch((err) => {
      result = { status: "error" };
    });
  return result;
};
