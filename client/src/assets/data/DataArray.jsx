// DataArray.jsx

import axios from "axios";

// 0. common -------------------------------------------------------------------------------------->
const URL_USER = process.env.REACT_APP_URL_USER;
const user_id = window.sessionStorage.getItem("user_id");

// 1. axios --------------------------------------------------------------------------------------->
const response = await axios.get(`${URL_USER}/dataset`, {
  params: {
    user_id: user_id,
    user_pw: "123"
  },
});

// 2. export -------------------------------------------------------------------------------------->
export const workArray = response.data.result.work;
export const moneyArray = response.data.result.money;