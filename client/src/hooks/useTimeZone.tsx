// useTimeZone.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { moment, getCountryForTimezone, getAllInfoByISO } from "@imports/ImportLibs";

// -------------------------------------------------------------------------------------------------
export const useTimeZone = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    TITLE
  } = useCommonValue();

  // 2. declare ------------------------------------------------------------------------------------
  let localLangSet:any = {
    timeZone: "",
    zoneName: "",
    locale: "",
    isoCode: "",
    currency: ""
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. Asia/Seoul
      localLangSet.timeZone = moment.tz.guess();

      // ex. KST
      localLangSet.zoneName = moment.tz(localLangSet.timeZone).zoneName();

      // ex. ko-KR
      localLangSet.locale = moment.tz(localLangSet.timeZone).locale();

      // ex. KR
      localLangSet.isoCode = getCountryForTimezone(localLangSet.timeZone)?.id;

      // ex. KRW
      localLangSet.currency = getAllInfoByISO(localLangSet.isoCode).currency;

      if (localLangSet) {
        localStorage.setItem(`${TITLE}_localLangSet`, JSON.stringify(localLangSet));
      }
    }
    catch (err: any) {
      console.error(err);
    }
  }, []);
};