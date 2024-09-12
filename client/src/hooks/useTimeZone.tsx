// useTimeZone.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useTimeZone = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    TITLE, PATH
  } = useCommonValue();

  // 2. declare ------------------------------------------------------------------------------------
  let timeZone: string = "";
  let zoneName: string = "";
  let locale: string = "";
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
      if (isoCode) {
        sessionStorage.setItem(`${TITLE}_isoCode`, isoCode);
      }
      if (currency) {
        sessionStorage.setItem(`${TITLE}_currency`, currency);
      }

      console.log("timeZone:", timeZone);
      console.log("zoneName:", zoneName);
      console.log("locale:", locale);
      console.log("isoCode:", isoCode);
      console.log("currency:", currency);
    }
    catch (err: any) {
      console.error(err);
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    // 언어설정 구하기
    const langSetting = sessionStorage.getItem(`${TITLE}_lang`);

    if (langSetting) {
      return;
    }
    else {
      if (locale.includes("ko")) {
        require("moment/locale/ko");
        sessionStorage.setItem(`${TITLE}_lang`, "ko");
      }
      else {
        sessionStorage.setItem(`${TITLE}_lang`, "en");
      }
    }
  }, []);
};