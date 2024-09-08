// useTimezone.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { moment } from "@imports/ImportLibs";
import { getCountryForTimezone } from "countries-and-timezones";
import { getAllInfoByISO } from "iso-country-currency";

// -------------------------------------------------------------------------------------------------
export const useTimezone = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    TITLE
  } = useCommonValue();
  let timeZone: string = "";
  let zoneName: string = "";
  let locale: string = "";
  let isoCode: any = "";
  let currencyCode: string = "";

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
      currencyCode = getAllInfoByISO(isoCode).currency;

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
      if (currencyCode) {
        sessionStorage.setItem(`${TITLE}_currencyCode`, currencyCode);
      }
    }
    catch (error) {
      console.error("useTimezone error:", error);
    }
  }, []);

  // 10. return ------------------------------------------------------------------------------------
  return {
    timeZone,
    zoneName,
    locale,
    isoCode,
    currencyCode
  };
};