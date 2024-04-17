// useTime.jsx

import React, {useEffect} from "react";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const useTime = (
  OBJECT, setOBJECT, PATH, type
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.match(/\/([^\/]+)\//)[1];
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. work
    if (type === "real" && strLow === "work") {
      const startTime = OBJECT?.work_start;
      const endTime = OBJECT?.work_end;

      if (startTime && endTime) {
        const startDate = new Date(`${koreanDate}T${startTime}Z`);
        const endDate = new Date(`${koreanDate}T${endTime}Z`);

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
    if (type === "real" && strLow === "sleep") {
      const nightTime = OBJECT?.sleep_section[0]?.sleep_night;
      const morningTime = OBJECT?.sleep_section[0]?.sleep_morning;

      if (nightTime && morningTime) {
        const startDate = new Date(`${koreanDate}T${nightTime}Z`);
        const endDate = new Date(`${koreanDate}T${morningTime}Z`);

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

    // 3. sleep
    if (type === "plan" && strLow === "sleep") {
      const nightTime = OBJECT?.sleep_plan_night;
      const morningTime = OBJECT?.sleep_plan_morning;

      if (nightTime && morningTime) {
        const startDate = new Date(`${koreanDate}T${nightTime}`);
        const endDate = new Date(`${koreanDate}T${morningTime}`);

        if (endDate < startDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        setOBJECT((prev) => ({
          ...prev,
          sleep_plan_time: time,
        }));
      }
    }
  }, [
    strLow,
    type === "real" && strLow === "work" ? OBJECT?.work_start : "",
    type === "real" && strLow === "work" ? OBJECT?.work_end : "",
    type === "real" && strLow === "sleep" ? OBJECT?.sleep_section[0]?.sleep_night : "",
    type === "real" && strLow === "sleep" ? OBJECT?.sleep_section[0]?.sleep_morning : "",
    type === "plan" && strLow === "sleep" ? OBJECT?.sleep_plan_night : "",
    type === "plan" && strLow === "sleep" ? OBJECT?.sleep_plan_morning : "",
  ]);
};