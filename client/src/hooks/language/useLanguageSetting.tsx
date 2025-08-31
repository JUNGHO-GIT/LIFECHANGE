// useLanguageSetting.tsx

import { useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@importLibs";
import { setLocal } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useLanguageSetting = () => {

	// --------------------------------------------------------------------------------------------
	// 1. common
	// --------------------------------------------------------------------------------------------
  const { localLang } = useCommonValue();

  // 2. declare ------------------------------------------------------------------------------------
  let timeZone: string = "";
  let zoneName: string = "";
  let isoCode: string = "";
  let currency: string = "";
  let unit: string = "";
  let lang: string = "";

  // 3. useEffect ----------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. UTC
      timeZone = moment.tz.guess();

      // ex. UTC
      zoneName = moment.tz(timeZone).zoneName();

      // ex. US
      isoCode = getCountryForTimezone(timeZone)?.id || "";

      // ex. USD
      currency = getAllInfoByISO(isoCode).currency;

      // 미국인 경우 lbs, 그 외에는 kg 설정
      unit = isoCode === "US" ? "lbs" : "kg";

      // ex. en
      lang = localLang ? localLang : (
        navigator.language.includes("-") ? navigator.language.split("-")[0] : navigator.language
      );

      // Load lang for moment if necessary
      if (lang && lang !== "en") {
        require(`moment/locale/${lang}`);
      }

      // Save to local storage
      setLocal("setting", "locale", "", {
        timeZone: timeZone,
        lang: lang,
        zoneName: zoneName,
        isoCode: isoCode,
        currency: currency,
        unit: unit,
      });
    }
    catch (err: any) {
      console.error(err);
    }

  }, [timeZone, zoneName, isoCode, currency, unit]);
};
