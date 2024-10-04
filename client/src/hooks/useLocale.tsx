// useLocale.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const useLocale = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { TITLE } = useCommonValue();

  // 2. declare ------------------------------------------------------------------------------------
  let timeZone: string = "";
  let zoneName: string = "";
  let isoCode: string = "";
  let currency: string = "";
  let locale: string = "";

  // 3. useEffect ----------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. Asia/Seoul
      timeZone = moment.tz.guess();

      // ex. KST
      zoneName = moment.tz(timeZone).zoneName();

      // ex. KR
      isoCode = getCountryForTimezone(timeZone)?.id || "";

      // ex. KRW
      currency = getAllInfoByISO(isoCode).currency;

      // ex. ko
      const existedLocale = localStorage.getItem(`${TITLE}_localeSetting`) || "{}";
      const parsedLocale = JSON.parse(existedLocale).locale;
      locale = parsedLocale || (navigator.language && navigator.language.split("-")[0]);

      // Load locale for moment if necessary
      if (locale && locale !== "en") {
        require(`moment/locale/${locale}`);
      }

      // Save to local storage
      const localeSetting = {
        timeZone: timeZone,
        locale: locale,
        zoneName: zoneName,
        isoCode: isoCode,
        currency: currency,
      };
      localStorage.setItem(`${TITLE}_localeSetting`, JSON.stringify(localeSetting));

    }
    catch (err: any) {
      console.error(err);
    }

    // 종속성에 locale은 추가하지 않음
  }, [TITLE, timeZone, zoneName, isoCode, currency]);
};
