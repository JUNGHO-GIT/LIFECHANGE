// useDate.jsx

import React, { useState, useEffect } from "react";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  OBJECT, setOBJECT,
  PATH, location_date,
  strDate, setStrDate,
  strDur, setStrDur
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.split("/")[1];

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDur(`${strDate} ~ ${strDate}`);
    setOBJECT((prev) => ({
      ...prev,
      [`${strLow}_date`]: strDur
    }));
  }, [strDate]);
};