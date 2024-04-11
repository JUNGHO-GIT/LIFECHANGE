// useDatePlan.jsx

import React, { useEffect } from "react";

// ------------------------------------------------------------------------------------------------>
export const useDatePlan = (
  OBJECT, setOBJECT, DATE, setDATE, PATH, location_date,
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. work

    // 2. sleep
    if (strLow === "sleep") {
      const nightTime = OBJECT?.plan_sleep?.plan_night?.toString();
      const morningTime = OBJECT?.plan_sleep?.plan_morning?.toString();

      if (nightTime && morningTime) {
        const startDate = new Date(`${DATE.strDt}T${nightTime}`);
        const endDate = new Date(`${DATE.strDt}T${morningTime}`);

        if (endDate < startDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        setOBJECT((prev) => ({
          ...prev,
          plan_sleep: {
            plan_night: nightTime,
            plan_morning: morningTime,
            plan_time: time,
          },
        }));
      }
    }
  }, [
    strLow,
    DATE.strDt,
    OBJECT?.plan_sleep?.plan_night,
    OBJECT?.plan_sleep?.plan_morning,
  ]);
};