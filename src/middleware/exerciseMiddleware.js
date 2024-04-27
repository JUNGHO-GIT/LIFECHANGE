// exerciseMiddleware.js

import {strToDecimal, decimalToStr} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const compareCount = (plan, real) => {
    const diff = Math.abs(real - plan);
    return diff;
  };

  const compareTime = (plan, real) => {
    const hoursPlan = parseInt(plan.split(":")[0], 10);
    const minutesPlan = parseInt(plan.split(":")[1], 10);

    const hoursReal = parseInt(real.split(":")[0], 10);
    const minutesReal = parseInt(real.split(":")[1], 10);

    const hours = Math.abs(hoursPlan - hoursReal);
    const minutes = Math.abs(minutesPlan - minutesReal);

    const diffTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    return diffTime;
  };

  const makeColor = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    if (extra === "count") {
      // 1. ~ 1%
      if (percent <= 1) {
        return "text-danger";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "text-warning";
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return "text-success";
      }
      // 4. 50% ~
      else {
        return "text-primary";
      }
    }
    else if (extra === "volume" || extra === "weight") {
      // 1. ~ 1%
      if (percent <= 1) {
        return "text-primary";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "text-success";
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return "text-warning";
      }
      // 4. 50% ~
      else {
        return "text-danger";
      }
    }
    else if (extra === "time") {
      let diff = 0;
      if (realDate < planDate) {
        diff = planDate.getTime() - realDate.getTime();
      }
      else {
        diff = realDate.getTime() - planDate.getTime();
      }
      // 1. 10분이내
      if (0 <= diff && diff <= 600000) {
        return "text-success";
      }
      // 2. 10분 ~ 20분
      else if (600000 < diff && diff <= 1200000) {
        return "text-warning";
      }
      // 3. 20분 ~
      else if (1200000 < diff) {
        return "text-danger";
      }
      else {
        return "text-primary";
      }
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      exercise_diff_count: compareCount(item?.exercise_plan_count, item?.exercise_total_count),
      exercise_diff_volume: compareCount(item?.exercise_plan_volume, item?.exercise_total_volume),
      exercise_diff_cardio: compareTime(item?.exercise_plan_cardio, item?.exercise_total_cardio),
      exercise_diff_weight: compareCount(item?.exercise_plan_weight, item?.exercise_body_weight),

      exercise_diff_count_color: makeColor(item?.exercise_plan_count, item?.exercise_total_count, "count"),
      exercise_diff_volume_color: makeColor(item?.exercise_plan_volume, item?.exercise_total_volume, "volume"),
      exercise_diff_cardio_color: makeColor(item?.exercise_plan_cardio, item?.exercise_total_cardio, "time"),
      exercise_diff_weight_color: makeColor(item?.exercise_plan_weight, item?.exercise_body_weight, "weight"),
    });
  });

  return object;
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {

  if (object === "deleted") {
    return {};
  }

  console.log("===============================");
  console.log("object : ", JSON.stringify(object));
  console.log("===============================");

  let totalVolume = 0;
  let totalTime = 0.0;

  object?.exercise_section?.map((item) => {
    totalVolume += item?.exercise_set * item?.exercise_rep * item?.exercise_kg;
    totalTime += strToDecimal(item?.exercise_cardio);
  });

  object.exercise_total_volume = totalVolume;
  object.exercise_total_cardio = decimalToStr(totalTime);

  return object;
};