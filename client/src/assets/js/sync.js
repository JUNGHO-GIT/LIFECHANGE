// sync.js

import { moment, axios } from "../../import/ImportLibs.jsx";

// -------------------------------------------------------------------------------------------------
export const sync = async () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const sessionId = sessionStorage.getItem("ID_SESSION");

  // 2-1. useState ---------------------------------------------------------------------------------
  const OBJECT = {
    percent: [],
    property: [],
    scale: [],
  };
  const DATE = {
    dateType: "day",
    dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
  };
  const params = {
    user_id: sessionId,
    DATE: DATE,
  };

  try {
    const [resPercent, resProperty, resScale] = await Promise.all([
      axios.get(`${URL_OBJECT}/sync/percent`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/sync/property`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/sync/scale`, {
        params: params,
      }),
    ]);

    Object.assign(OBJECT, {
      percent: resPercent.data.result,
      property: resProperty.data.result,
      scale: resScale.data.result,
    });

    sessionStorage.setItem("PERCENT", JSON.stringify(resPercent.data.result));
    sessionStorage.setItem("PROPERTY", JSON.stringify(resProperty.data.result));
    sessionStorage.setItem("SCALE", JSON.stringify(resScale.data.result));
  }
  catch (error) {
    console.error(`percent error: ${error}`);
  }
}