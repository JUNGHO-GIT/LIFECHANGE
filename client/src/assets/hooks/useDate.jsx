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
    if (DATE.strStartDt && DATE.strEndDt) {
      setDATE((prev) => ({
        ...prev,
        strDur: `${DATE.strStartDt} ~ ${DATE.strEndDt}`,
      }));
    }
    else {
      setDATE((prev) => ({
        ...prev,
        strDur: `${DATE.strDt} ~ ${DATE.strDt}`,
      }));
    }
  }, [
    DATE.strStartDt ? DATE.strStartDt : "",
    DATE.strEndDt ? DATE.strEndDt : "",
    DATE.strDt ? DATE.strDt : "",
  ]);
};