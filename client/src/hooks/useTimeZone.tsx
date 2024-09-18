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
    isoCode: "",
    currency: "",
    locale: "",
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. Asia/Seoul
      localLangSet.timeZone = moment.tz.guess();
    }
    catch (err: any) {
      console.error(err);
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. KST
      localLangSet.zoneName = moment.tz(localLangSet.timeZone).zoneName();

      // ex. KR
      localLangSet.isoCode = getCountryForTimezone(localLangSet.timeZone)?.id;
    }
    catch (err: any) {
      console.error(err);
    }
  }, [localLangSet.timeZone]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. KRW
      localLangSet.currency = getAllInfoByISO(localLangSet.isoCode).currency;
    }
    catch (err: any) {
      console.error(err);
    }
  }, [localLangSet.isoCode]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      // ex. ko
      localLangSet.locale = navigator.language && navigator.language.split("-")[0];
    }
    catch (err: any) {
      console.error(err);
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      if (localLangSet) {
        localStorage.setItem(`${TITLE}_localLangSet`, JSON.stringify(localLangSet));
      }
    }
    catch (err: any) {
      console.error(err);
    }
  }, [localLangSet.timeZone, localLangSet.zoneName, localLangSet.isoCode, localLangSet.currency, localLangSet.locale]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    try {
      if (localLangSet.locale && localLangSet.locale !== "en") {
        require(`moment/locale/${localLangSet.locale}`);
      }
    }
    catch (err: any) {
      console.error(err);
    }
  }, [localLangSet.locale]);
};