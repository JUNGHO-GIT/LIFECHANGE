// useTime.jsx

import React, { useEffect } from "react";

// ------------------------------------------------------------------------------------------------>
export const useTime = (
  OBJECT, setOBJECT, DATE, setDATE, PATH, type
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.match(/\/([^\/]+)\/[^\/]+$/)[1];

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 1. work
    if (type === "real" && strLow === "work") {
      const startTime = OBJECT?.work_start;
      const endTime = OBJECT?.work_end;

      if (startTime && endTime) {
        const startDate = new Date(`${DATE.strDt}T${startTime}`);
        const endDate = new Date(`${DATE.strDt}T${endTime}`);

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
  }, [
    strLow,
    DATE?.strDt,
    OBJECT?.work_start,
    OBJECT?.work_end,
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 2. sleep
    if (type === "real" && strLow === "sleep") {
      const nightTime = OBJECT?.sleep_section[0]?.sleep_night;
      const morningTime = OBJECT?.sleep_section[0]?.sleep_morning;

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
          sleep_section: [{
            ...prev.sleep_section[0],
            sleep_time: time,
          }],
        }));
      }
    }
  }, [
    strLow,
    OBJECT?.sleep_section[0]?.sleep_night,
    OBJECT?.sleep_section[0]?.sleep_morning,
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 3. sleep
    if (type === "plan" && strLow === "sleep") {
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