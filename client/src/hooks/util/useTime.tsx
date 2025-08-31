// useTime.tsx

import { useEffect } from "@importReacts";
import { useCommonDate } from "@importHooks";

// -------------------------------------------------------------------------------------------------
export const useTime = (
  OBJECT: any,
  setOBJECT: any,
  PATH: string,
  type: string,
) => {

	// --------------------------------------------------------------------------------------------
	// 1. common
	// --------------------------------------------------------------------------------------------
  const { getDayFmt } = useCommonDate();
  const match = PATH.match(/\/([^/]+)\//);
  const strLow = match ? match[1] : null;

	// --------------------------------------------------------------------------------------------
	// 2-3. useEffect
	// --------------------------------------------------------------------------------------------
  useEffect(() => {

    // 1-1. exercise
    if (type === "goal" && strLow === "exercise") {
      const startTime = OBJECT?.exercise_goal_dateStart;
      const endTime = OBJECT?.exercise_goal_dateEnd;

      if (startTime && endTime) {
        const startDate = new Date(`${startTime}T00:00`);
        const endDate = new Date(`${endTime}T00:00`);

        const diff = endDate.getTime() - startDate.getTime();
        const days = Math.floor(diff / 86400000);
        const time = `${String(days).padStart(2, "0")}`;

        setOBJECT((prev: any) => ({
          ...prev,
          exercise_goal_time: time,
        }));
      }
    }

    // 4-1. sleep
    if (type === "goal" && strLow === "sleep") {
      const bedTimeTime = OBJECT?.sleep_goal_bedTime;
      const wakeTimeTime = OBJECT?.sleep_goal_wakeTime;

      if (bedTimeTime && wakeTimeTime) {
        const startDate = new Date(`${getDayFmt()}T${bedTimeTime}`);
        const endDate = new Date(`${getDayFmt()}T${wakeTimeTime}`);

        if (endDate < startDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        setOBJECT((prev: any) => ({
          ...prev,
          sleep_goal_sleepTime: time,
        }));
      }
    }

    // 4-2. sleep
    if (type === "real" && strLow === "sleep") {
      const bedTimeTime = OBJECT?.sleep_section[0]?.sleep_bedTime;
      const wakeTimeTime = OBJECT?.sleep_section[0]?.sleep_wakeTime;

      if (bedTimeTime && wakeTimeTime) {
        const startDate = new Date(`${getDayFmt()}T${bedTimeTime}Z`);
        const endDate = new Date(`${getDayFmt()}T${wakeTimeTime}Z`);

        if (endDate < startDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        const diff = endDate.getTime() - startDate.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

        setOBJECT((prev: any) => ({
          ...prev,
          sleep_section: [{
            ...prev.sleep_section[0],
            sleep_sleepTime: time,
          }],
        }));
      }
    }
  }, [
    strLow,
    type === "goal" && strLow === "exercise" ? OBJECT?.exercise_goal_dateStart : "",
    type === "goal" && strLow === "exercise" ? OBJECT?.exercise_goal_dateEnd : "",
    type === "goal" && strLow === "sleep" ? OBJECT?.sleep_goal_bedTime : "",
    type === "goal" && strLow === "sleep" ? OBJECT?.sleep_goal_wakeTime : "",
    type === "real" && strLow === "sleep" ? OBJECT?.sleep_section[0]?.sleep_bedTime : "",
    type === "real" && strLow === "sleep" ? OBJECT?.sleep_section[0]?.sleep_wakeTime : "",
  ]);
};