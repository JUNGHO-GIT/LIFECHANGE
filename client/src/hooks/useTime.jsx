// useTime.jsx

import React, {useEffect} from "react";
import moment from "moment-timezone";
import "moment/locale/ko";

// ------------------------------------------------------------------------------------------------>
export const useTime = (
  OBJECT, setOBJECT, PATH, type
) => {

  // 1. common ------------------------------------------------------------------------------------>
  const strLow = PATH.match(/\/([^\/]+)\//)[1];
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1-1. exercise
    if (type === "plan" && strLow === "exercise") {
      const startTime = OBJECT?.exercise_plan_startDt;
      const endTime = OBJECT?.exercise_plan_endDt;

      if (startTime && endTime) {
        const startDate = new Date(`${startTime}T00:00`);
        const endDate = new Date(`${endTime}T00:00`);

        const diff = endDate.getTime() - startDate.getTime();
        const days = Math.floor(diff / 86400000);
        const time = `${String(days).padStart(2, "0")}`;

        setOBJECT((prev) => ({
          ...prev,
          exercise_plan_time: time,
        }));
      }
    }

    // 4-1. sleep
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

    // 4-2. sleep
    if (type === "real" && strLow === "sleep") {

      const nightTime = OBJECT?.sleep_section[0]?.sleep_time;
      const morningTime = OBJECT?.sleep_section[1]?.sleep_time;

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
          sleep_section: prev.sleep_section.map((section, index) => (
            index === 2 ? {
              ...section,
              sleep_time: time
            } : section
          )),
        }));
      }
    }
  }, [
    strLow,
    type === "plan" && strLow === "exercise" ? OBJECT?.exercise_plan_startDt : "",
    type === "plan" && strLow === "exercise" ? OBJECT?.exercise_plan_endDt : "",
    type === "plan" && strLow === "sleep" ? OBJECT?.sleep_plan_night : "",
    type === "plan" && strLow === "sleep" ? OBJECT?.sleep_plan_morning : "",
    type === "real" && strLow === "sleep" ? OBJECT?.sleep_section[0]?.sleep_time : "",
    type === "real" && strLow === "sleep" ? OBJECT?.sleep_section[1]?.sleep_time : "",
  ]);
};