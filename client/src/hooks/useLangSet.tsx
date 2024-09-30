// useLangSet.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useLangSet = () => {

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
      const existedLocale = localStorage.getItem(`${TITLE}_localLangSet`) || "{}";
      const parsedLocale = JSON.parse(existedLocale).locale;
      locale = parsedLocale || (navigator.language && navigator.language.split("-")[0]);

      // Load locale for moment if necessary
      if (locale && locale !== "en") {
        require(`moment/locale/${locale}`);
      }

      // Save to local storage
      const localLangSet = {
        timeZone: timeZone,
        locale: locale,
        zoneName: zoneName,
        isoCode: isoCode,
        currency: currency,
      };
      localStorage.setItem(`${TITLE}_localLangSet`, JSON.stringify(localLangSet));

    }
    catch (err: any) {
      console.error(err);
    }
  }, [TITLE]);
};
