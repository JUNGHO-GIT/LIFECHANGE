// useDate.jsx

// 1. compare = X
// 2. list = X

// 3. detail = O
// 4. save = O

import {useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
export const useDate  = (
  DATE, setDATE, location_date
) => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strDt: location_date
    }));
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strStartDt: DATE.strDt,
      strEndDt: DATE.strDt
    }));
  }, [DATE.strDt]);
};