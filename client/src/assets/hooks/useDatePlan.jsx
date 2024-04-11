// useDatePlan.jsx

import React, { useEffect } from "react";

// ------------------------------------------------------------------------------------------------>
export const useDatePlan = (
  OBJECT, setOBJECT, PATH, location_date, strDate, setStrDate, strDur, setStrDur
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.match(/\/([^\/]+)\/[^\/]+$/)[1];

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
      [`${strLow}_dur`]: `${strDate} ~ ${strDate}`,
    }));
  }, [strDate]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. work

    // 2. sleep
    if (strLow === "sleep") {
      const nightTime = OBJECT?.plan_sleep?.plan_night?.toString();
      const morningTime = OBJECT?.plan_sleep?.plan_morning?.toString();

      if (nightTime && morningTime) {
        const startDate = new Date(`${strDate}T${nightTime}`);
        const endDate = new Date(`${strDate}T${morningTime}`);

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
    strDate,
    strLow,
    OBJECT?.work_start,
    OBJECT?.work_end,
    OBJECT?.plan_sleep?.plan_night,
    OBJECT?.plan_sleep?.plan_morning,
  ]);
};