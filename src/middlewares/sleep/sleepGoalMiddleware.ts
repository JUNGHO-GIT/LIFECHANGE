// sleepDiffMiddleware.ts

import { differenceInMinutes } from "date-fns";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object: any) => {

  // 1. compareTime --------------------------------------------------------------------------------
  const compareTime = (goalParam: string, realParam: string, extra: string) => {
    const goal = goalParam;
    const real = realParam;
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}:00Z`);
      const realDate = new Date(`1970-01-01T${real}:00Z`);

      // 밤을 넘어가는 시간 처리
      let diff = differenceInMinutes(realDate, goalDate);

      // 차이가 음수인 경우, 절대값을 사용하여 계산
      if (diff < 0) {
        diff = Math.abs(diff);
      }

      // HH:mm 형식으로 결과 반환
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      if (goalDate > realDate) {
        return `-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      else {
        return `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    else if (extra === "sleepTime") {
      const goalDate = new Date(`1970-01-01T${goal}:00Z`);
      const realDate = new Date(`1970-01-01T${real}:00Z`);

      let diff = differenceInMinutes(realDate, goalDate);

      // 시간 차이가 음수인 경우 절대값 적용
      if (diff < 0) {
        diff = Math.abs(diff);
      }

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      if (goalDate > realDate) {
        return `-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      else {
        return `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
  };

  // 3. makeNonValueColor -------------------------------------------------------------------------
  const makeNonValueColor = (param: string) => {
    if (param === "0" || param === "00:00") {
      return "grey";
    }
    else {
      return "";
    }
  };

  // 4. makeDiffColor ------------------------------------------------------------------------------
  const makeDiffColor = (goalParam: string, realParam: string, extra: string) => {
    const goal = goalParam;
    const real = realParam;
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}Z`);
      const realDate = new Date(`1970-01-01T${real}Z`);
      let diffVal = 0;
      if (realDate < goalDate) {
        diffVal = goalDate.getTime() - realDate.getTime();
      }
      else {
        diffVal = realDate.getTime() - goalDate.getTime();
      }
      // 1. ~ 10분
      if (0 <= diffVal && diffVal <= 600000) {
        return "firstScore";
      }
      // 2. 10분 ~ 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        return "secondScore";
      }
      // 3. 20분 ~ 40분
      else if (1200000 < diffVal && diffVal <= 2400000) {
        return "thirdScore";
      }
      // 4. 40분 ~ 60분
      else if (2400000 < diffVal && diffVal <= 3600000) {
        return "fourthScore";
      }
      // 5. 60분 ~
      else {
        return "fifthScore";
      }
    }
    else if (extra === "sleepTime") {
      const hoursGoal = parseFloat(goal?.split(":")[0]);
      const minutesGoal = parseFloat(goal?.split(":")[1]);

      const hoursReal = parseFloat(real?.split(":")[0]);
      const minutesReal = parseFloat(real?.split(":")[1]);

      const hours = Math.abs(hoursGoal - hoursReal);
      const minutes = Math.abs(minutesGoal - minutesReal);

      const diffVal = (hours * 60) + minutes;

      // 1. ~ 10분
      if (0 <= diffVal && diffVal <= 10) {
        return "firstScore";
      }
      // 2. 10분 ~ 20분
      else if (10 < diffVal && diffVal <= 20) {
        return "secondScore";
      }
      // 3. 20분 ~ 40분
      else if (20 < diffVal && diffVal <= 40) {
        return "thirdScore";
      }
      // 4. 40분 ~ 60분
      else if (40 < diffVal && diffVal <= 60) {
        return "fourthScore";
      }
      // 5. 60분 ~
      else {
        return "fifthScore";
      }
    }
  };

  // 4. result -------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    Object.assign(item, {
      sleep_bedTime_color: makeNonValueColor(
        item?.sleep_bedTime
      ),
      sleep_wakeTime_color: makeNonValueColor(
        item?.sleep_wakeTime
      ),
      sleep_sleepTime_color: makeNonValueColor(
        item?.sleep_sleepTime
      ),
      sleep_goal_bedTime_color: makeNonValueColor(
        item?.sleep_goal_bedTime
      ),
      sleep_goal_wakeTime_color: makeNonValueColor(
        item?.sleep_goal_wakeTime
      ),
      sleep_goal_sleepTime_color: makeNonValueColor(
        item?.sleep_goal_sleepTime
      ),
      sleep_diff_bedTime: compareTime(
        item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
      ),
      sleep_diff_wakeTime: compareTime(
        item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
      ),
      sleep_diff_sleepTime: compareTime(
        item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "sleepTime"
      ),
      sleep_diff_bedTime_color: makeDiffColor(
        item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
      ),
      sleep_diff_wakeTime_color: makeDiffColor(
        item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
      ),
      sleep_diff_sleepTime_color: makeDiffColor(
        item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "sleepTime"
      ),
    });
  });

  return object;
};