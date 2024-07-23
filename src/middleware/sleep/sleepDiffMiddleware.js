// sleepDiffMiddleware.js

import {differenceInMinutes} from "date-fns";


// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  // ex. 22:00 - 04:00 = 06:00   /  22:00 - 22:30 = 00:30  /  22:09 - 23:00 = 00:51
  const compareTime = (goal, real, extra) => {
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}:00Z`);
      const realDate = new Date(`1970-01-01T${real}:00Z`);

      // 밤을 넘어가는 시간 처리
      let diff = differenceInMinutes(realDate, goalDate);

      // 24시간을 분으로 환산 후, 차이가 음수인 경우 추가
      if (diff < 0) {
        diff += 1440;
      }

      // HH:mm 형식으로 결과 반환
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  };

  const makeColor = (goal, real, extra) => {
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
        return "primary";
      }
      // 2. 10분 ~ 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        return "success";
      }
      // 3. 20분 ~ 40분
      else if (1200000 < diffVal && diffVal <= 2400000) {
        return "secondary";
      }
      // 4. 40분 ~ 60분
      else if (2400000 < diffVal && diffVal <= 3600000) {
        return "warning";
      }
      // 5. 60분 ~
      else {
        return "danger";
      }
    }
    else if (extra === "sleepTime") {
      const hoursGoal = parseInt(goal?.split(":")[0], 10);
      const minutesGoal = parseInt(goal?.split(":")[1], 10);

      const hoursReal = parseInt(real?.split(":")[0], 10);
      const minutesReal = parseInt(real?.split(":")[1], 10);

      const hours = Math.abs(hoursGoal - hoursReal);
      const minutes = Math.abs(minutesGoal - minutesReal);

      const diffVal = (hours * 60) + minutes;

      // 1. ~ 10분
      if (0 <= diffVal && diffVal <= 10) {
        return "primary";
      }
      // 2. 10분 ~ 20분
      else if (10 < diffVal && diffVal <= 20) {
        return "success";
      }
      // 3. 20분 ~ 40분
      else if (20 < diffVal && diffVal <= 40) {
        return "secondary";
      }
      // 4. 40분 ~ 60분
      else if (40 < diffVal && diffVal <= 60) {
        return "warning";
      }
      // 5. 60분 ~
      else {
        return "danger";
      }
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      sleep_diff_bedTime: compareTime(
        item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
      ),
      sleep_diff_wakeTime: compareTime(
        item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
      ),
      sleep_diff_sleepTime: compareTime(
        item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "sleepTime"
      ),
      sleep_diff_bedTime_color: makeColor(
        item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
      ),
      sleep_diff_wakeTime_color: makeColor(
        item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
      ),
      sleep_diff_sleepTime_color: makeColor(
        item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "sleepTime"
      ),
    });
  });

  return object;
};