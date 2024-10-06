// sync.js

import { moment, axios } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const sync = async (extra?: string) => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_SERVER_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const TITLE = process.env.REACT_APP_TITLE || "";
  const sessionId = sessionStorage.getItem(`${TITLE}_sessionId`) || "";
  const localTimeZone = sessionStorage.getItem(`${TITLE}_timeZone`) || "Asia/Seoul";

  // 2-1. useState ---------------------------------------------------------------------------------
  const DATE = {
    dateType: "day",
    dateStart: moment().tz(localTimeZone).format("YYYY-MM-DD"),
    dateEnd: moment().tz(localTimeZone).format("YYYY-MM-DD"),
    monthStart: moment().tz(localTimeZone).startOf("month").format("YYYY-MM-DD"),
    monthEnd: moment().tz(localTimeZone).endOf("month").format("YYYY-MM-DD"),
  };
  const params = {
    user_id: sessionId,
    DATE: DATE,
  };

  try {
    if (extra) {
      const [resExtra] = await Promise.all([
        axios.get(`${URL_OBJECT}/sync/${extra}`, {
          params: params,
        }),
      ]);
      sessionStorage.setItem(`${TITLE}_${extra}`, JSON.stringify(resExtra.data.result));
    }
    else {
      const [resCategory, resPercent, resScale, resFavorite, resProperty] = await Promise.all([
        axios.get(`${URL_OBJECT}/sync/category`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/sync/percent`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/sync/scale`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/sync/favorite`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/sync/property`, {
          params: params,
        }),
      ]);
      sessionStorage.setItem(`${TITLE}_category`, JSON.stringify(resCategory.data.result));
      sessionStorage.setItem(`${TITLE}_percent`, JSON.stringify(resPercent.data.result));
      sessionStorage.setItem(`${TITLE}_scale`, JSON.stringify(resScale.data.result));
      sessionStorage.setItem(`${TITLE}_favorite`, JSON.stringify(resFavorite.data.result));
      sessionStorage.setItem(`${TITLE}_property`, JSON.stringify(resProperty.data.result));
    }
  }
  catch (err: any) {
    console.error(`sync error: ${err}`);
  }
}