// useDate.jsx

import React, { useEffect } from "react";

// ------------------------------------------------------------------------------------------------>
export const useDate  = (
  OBJECT, setOBJECT, DATE, setDATE, PATH, location_date
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.match(/\/([^\/]+)\/[^\/]+$/)[1];

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strDt: location_date,
      strDur: `${location_date} ~ ${location_date}`,
    }));
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setDATE((prev) => ({
      ...prev,
      strDur: `${DATE.strDt} ~ ${DATE.strDt}`,
    }));
    setOBJECT((prev) => ({
      ...prev,
      [`${strLow}_dur`]: `${DATE.strDt} ~ ${DATE.strDt}`,
    }));
  }, [DATE.strDt]);
};