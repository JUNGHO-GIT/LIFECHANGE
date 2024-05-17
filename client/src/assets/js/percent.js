// percent.js

import moment from "moment-timezone";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const percent = async () => {

  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const user_id = sessionStorage.getItem("user_id") || "{}";

  try {
    const resList = await axios.get(`${URL_OBJECT}/percent/list`, {
      params: {
        user_id: user_id,
        duration: `${today} ~ ${today}`,
      },
    });
    const resProperty = await axios.get(`${URL_OBJECT}/percent/property`, {
      params: {
        user_id: user_id
      },
    });

    sessionStorage.setItem("percent", JSON.stringify(resList.data.result));
    sessionStorage.setItem("property", JSON.stringify(resProperty.data.result));
  }
  catch (error) {
    console.error(`percent error: ${error}`);
  }
}