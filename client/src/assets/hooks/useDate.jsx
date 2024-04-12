// useDate.jsx

import {useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
export const useDate  = (
  DATE, setDATE, location_date
) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strDt: location_date,
      strStartDt: location_date,
      strEndDt: location_date,
    }));
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strDur: `${DATE.strDt} ~ ${DATE.strDt}`,
    }));
  }, [DATE.strDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strDur: `${DATE.strStartDt} ~ ${DATE.strEndDt}`,
    }));
  }, [
    DATE.strStartDt ? DATE.strStartDt : "",
    DATE.strEndDt ? DATE.strEndDt : "",
  ]);
};