// percent.js

import "moment/locale/ko";
import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const percent = async () => {

  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const user_id = sessionStorage.getItem("user_id");

  try {
    const res = await axios.get(`${URL_OBJECT}/plan/percent`, {
      params: {
        user_id: user_id,
        duration: `${today} ~ ${today}`,
      },
    });
    sessionStorage.setItem("percent", JSON.stringify(res.data.result));
  }
  catch (error) {
    console.error(`percent error: ${error}`);
  }
}