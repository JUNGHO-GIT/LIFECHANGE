// useLanguageSetting.tsx

import { useCommonValue } from "@importHooks";
import { getAllInfoByISO, getCountryForTimezone, moment } from "@importLibs";
import { useEffect } from "@importReacts";
import { fnSetLocal } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const useLanguageSetting = () => {

  // 1. common ----------------------------------------------------------------------------------
  const { localLang } = useCommonValue();

  // 2. useEffect ----------------------------------------------------------------------------------
  useEffect(() => {
    // ex. UTC
    const timeZone = moment.tz.guess();

    // ex. UTC
    const zoneName = moment.tz(timeZone).zoneName();

    // ex. US
    const isoCode = getCountryForTimezone(timeZone)?.id || "";

    // ex. USD
    const currency = getAllInfoByISO(isoCode).currency;

    // 미국인 경우 lbs, 그 외에는 kg 설정
    const unit = isoCode === "US" ? "lbs" : "kg";

    // ex. en
    const lang = localLang || (
      navigator.language.includes("-") ? navigator.language.split("-")[0] : navigator.language
    );

    // Load lang for moment if necessary
    lang && lang !== "en" && require(`moment/locale/${lang}`);

    // Save to local storage
    fnSetLocal("setting", "locale", "", {
      timeZone: timeZone,
      lang: lang,
      zoneName: zoneName,
      isoCode: isoCode,
      currency: currency,
      unit: unit,
    });
  }, [localLang]);
};