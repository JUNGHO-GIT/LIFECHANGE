// useDate.jsx

import React, { useEffect } from "react";
import { useStorage } from "./useStorage.jsx";

// ------------------------------------------------------------------------------------------------>
export const useDate = (
  OBJECT,
  setOBJECT,
  PATH,
  location_date,
  strDate,
  setStrDate,
  strDur,
  setStrDur
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
      [`${strLow}_date`]: strDate
    }));
  }, [strDate]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. work
    if (strLow === "work") {
      const startTime = OBJECT?.work_start;
      const endTime = OBJECT?.work_end;

      if (startTime && endTime) {
        const startDate = new Date(`${strDate}T${startTime}`);
        const endDate = new Date(`${strDate}T${endTime}`);

        if (endDate < startDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        setOBJECT((prev) => ({
          ...prev,
          work_start: startTime,
          work_end: endTime,
          work_time: time,
        }));
      }
    }

    // 2. sleep
    if (strLow === "sleep") {
      const nightTime = OBJECT?.sleep_section.map((item) => item?.sleep_night)?.toString();
      const morningTime = OBJECT?.sleep_section.map((item) => item?.sleep_morning)?.toString();

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
          sleep_section: [{
            sleep_night: nightTime,
            sleep_morning: morningTime,
            sleep_time: time,
          }]
        }));
      }
    }
  }, [
    strDate, strLow,
    OBJECT?.work_start,
    OBJECT?.work_end,
    OBJECT?.sleep_section?.map((item) => (item?.sleep_night))?.toString(),
    OBJECT?.sleep_section?.map((item) => (item?.sleep_morning))?.toString(),
  ]);
};