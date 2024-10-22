// useLanguageSetting.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const useLanguageSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, TITLE, localLang, localTitle } = useCommonValue();

  // 2. declare ------------------------------------------------------------------------------------
  let timeZone: string = "";
  let zoneName: string = "";
  let isoCode: string = "";
  let currency: string = "";
  let lang: string = "";

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
      lang = localLang || (navigator.language && navigator.language.split("-")[0]);

      // Load lang for moment if necessary
      if (lang && lang !== "en") {
        require(`moment/locale/${lang}`);
      }

      // Save to local storage
      localStorage.setItem(TITLE, JSON.stringify({
        ...localTitle,
        setting: {
          ...localTitle?.setting,
          locale: {
            timeZone: timeZone,
            lang: lang,
            zoneName: zoneName,
            isoCode: isoCode,
            currency: currency,
          }
        }
      }));
    }
    catch (err: any) {
      console.error(err);
    }

    // 종속성에 locale은 추가하지 않음
  }, [PATH, TITLE, timeZone, zoneName, isoCode, currency]);
};
