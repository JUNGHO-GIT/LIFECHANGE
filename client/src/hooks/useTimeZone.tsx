// useTimeZone.tsx

import { useEffect } from "@imports/ImportReacts";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useTimeZone = () => {

  // 1. common -------------------------------------------------------------------------------------
  let TITLE = process.env.REACT_APP_TITLE || "";
  let timeZone: string = "";
  let zoneName: string = "";
  let locale: string = "";
  let lang: string = "";
  let isoCode: any = "";
  let currency: string = "";

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. Asia/Seoul
      timeZone = moment.tz.guess();

      // ex. KST
      zoneName = moment.tz(timeZone).zoneName();

      // ex. ko-KR
      locale = navigator.language;

      // ex. ko
      lang = locale.includes("-") && locale.split("-")[0] ? locale.split("-")[0] : locale;

      // ex. KR
      isoCode = getCountryForTimezone(timeZone)?.id;

      // ex. KRW
      currency = getAllInfoByISO(isoCode).currency;

      if (timeZone) {
        sessionStorage.setItem(`${TITLE}_timeZone`, timeZone);
      }
      if (zoneName) {
        sessionStorage.setItem(`${TITLE}_zoneName`, zoneName);
      }
      if (locale) {
        sessionStorage.setItem(`${TITLE}_locale`, locale);
      }
      if (lang) {
        sessionStorage.setItem(`${TITLE}_lang`, lang);
      }
      if (isoCode) {
        sessionStorage.setItem(`${TITLE}_isoCode`, isoCode);
      }
      if (currency) {
        sessionStorage.setItem(`${TITLE}_currency`, currency);
      }
    }
    catch (err: any) {
      console.error(err);
    }
  }, []);

  if (lang === "ko") {
    require("moment/locale/ko");
    sessionStorage.setItem(`${TITLE}_lang`, "ko");
  }
  else {
    sessionStorage.setItem(`${TITLE}_lang`, "en");
  }
};