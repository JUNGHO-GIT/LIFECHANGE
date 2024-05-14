// sleepDiffMiddleware.js

import {compareTime} from "../../assets/js/date.js";

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = async (object) => {

  if (!object) {
    return [];
  }

  const makeColor = (plan, real, extra) => {
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    let diffVal = 0;
    if (realDate < planDate) {
      diffVal = planDate.getTime() - realDate.getTime();
    }
    else {
      diffVal = realDate.getTime() - planDate.getTime();
    }
    // 1. 10분이내
    if (0 <= diffVal && diffVal <= 600000) {
      return "primary";
    }
    // 2. 10분 ~ 20분
    else if (600000 < diffVal && diffVal <= 1200000) {
      return "success";
    }
    // 3. 20분 ~ 30분
    else if (1200000 < diffVal && diffVal <= 1800000) {
      return "warning";
    }
    // 4. 30분 ~
    else {
      return "danger";
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      sleep_diff_night: compareTime(item?.sleep_plan_night, item?.sleep_night),
      sleep_diff_morning: compareTime(item?.sleep_plan_morning, item?.sleep_morning),
      sleep_diff_time: compareTime(item?.sleep_plan_time, item?.sleep_time),
      sleep_diff_night_color: makeColor(item?.sleep_plan_night, item?.sleep_night, ""),
      sleep_diff_morning_color: makeColor(item?.sleep_plan_morning, item?.sleep_morning, ""),
      sleep_diff_time_color: makeColor(item?.sleep_plan_time, item?.sleep_time, ""),
    });
  });

  return object;
};