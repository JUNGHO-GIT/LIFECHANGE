// sync.js

import { moment, axios } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const sync = async () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_SERVER_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const TITLE = process.env.REACT_APP_TITLE || "";
  const sessionId = sessionStorage.getItem(`${TITLE}_sessionId`) || "";

  // 2-1. useState ---------------------------------------------------------------------------------
  const OBJECT = {
    percent: [] as any[],
    property: [] as any[],
    scale: [] as any[],
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

    sessionStorage.setItem(`${TITLE}_percent`, JSON.stringify(resPercent.data.result));
    sessionStorage.setItem(`${TITLE}_property`, JSON.stringify(resProperty.data.result));
    sessionStorage.setItem(`${TITLE}_scale`, JSON.stringify(resScale.data.result));
  }
  catch (error) {
    console.error(`sync error: ${error}`);
  }
}