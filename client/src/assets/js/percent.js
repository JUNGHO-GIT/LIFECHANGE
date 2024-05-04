// percent.js

import axios from "axios";
import moment from "moment-timezone";

export const percent = async () => {

  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CUSTOMER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

  const response = await axios.get(`${URL_OBJECT}/plan/percent`, {
    params: {
      user_id: sessionStorage.getItem("user_id"),
      duration: `${today} ~ ${today}`,
    },
  });
  sessionStorage.setItem("percent", JSON.stringify(response.data.result));
};