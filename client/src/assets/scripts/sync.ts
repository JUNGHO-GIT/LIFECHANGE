// sync.js

import { moment, axios, setSession } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const sync = async (extra?: string) => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_SERVER_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const TITLE = process.env.REACT_APP_TITLE || "";

  const sessionTitle = JSON.parse(sessionStorage.getItem(TITLE) || "{}");
  const sessionId = sessionTitle?.setting?.id?.sessionId;
  const localTitle = JSON.parse(localStorage.getItem(TITLE) || "{}");
  const localTimeZone = localTitle?.setting?.locale?.timeZone || "UTC";

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

  if (extra) {
    const [resExtra] = await Promise.all([
      axios.get(`${URL_OBJECT}/sync/${extra}`, {
        params: params,
      }),
    ]);
    setSession("setting", "sync", "", {
      [extra]: resExtra.data.result,
    });
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
    setSession("setting", "sync", "", {
      category: resCategory.data.result,
      percent: resPercent.data.result,
      scale: resScale.data.result,
      favorite: resFavorite.data.result,
      property: resProperty.data.result,
    });
  }
}