// sync.js

import {moment, axios} from "../../import/ImportLibs.jsx";

// -------------------------------------------------------------------------------------------------
export const sync = async () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage -------------------------------------------------------------------------------
  const DATE = {
    dateType: "day",
    dateStart: moment().format("YYYY-MM-DD"),
    dateEnd: moment().format("YYYY-MM-DD"),
  };

  try {
    const resPercent = await axios.get(`${URL_OBJECT}/sync/percent`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    });
    const resProperty = await axios.get(`${URL_OBJECT}/sync/property`, {
      params: {
        user_id: sessionId,
      },
    });

    sessionStorage.setItem("percent", JSON.stringify(resPercent.data.result));
    sessionStorage.setItem("property", JSON.stringify(resProperty.data.result));
  }
  catch (error) {
    console.error(`percent error: ${error}`);
  }
}