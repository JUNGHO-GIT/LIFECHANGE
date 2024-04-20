// workMiddleware.js

import {strToDecimal, decimalToStr, compareTime} from "../assets/common/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (object) => {

  console.log("first object : " + JSON.stringify(object));

  const compareCount = (plan, real) => {
    const diff = Math.abs(real - plan);
    return diff;
  };

  const makeColor = (plan, real, extra) => {
    if (extra === "volume") {
      const percent = ((real - plan) / plan) * 100;
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
    else {
      const planDate = new Date(`1970-01-01T${plan}Z`);
      const realDate = new Date(`1970-01-01T${real}Z`);

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

  if (!object) {
    return [];
  }

  object?.result?.map((item) => {

    Object.assign(item, {
      work_diff_count: compareCount(item.work_plan_count, item.work_total_count),
      work_diff_volume: compareCount(item.work_plan_volume, item.work_total_volume),
      work_diff_cardio: compareTime(item.work_plan_cardio, item.work_total_cardio),
      work_diff_weight: compareCount(item.work_plan_weight, item.work_body_weight),

      work_diff_count_color: makeColor(item.work_plan_count, item.work_total_count),
      work_diff_volume_color: makeColor(item.work_plan_volume, item.work_total_volume, "volume"),
      work_diff_cardio_color: makeColor(item.work_plan_cardio, item.work_total_cardio),
      work_diff_weight_color: makeColor(item.work_plan_weight, item.work_body_weight),
    });

  });

  console.log("second object : " + JSON.stringify(object));

  return object;
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {
  if (object === "deleted") {
    return {};
  }
  else {
    let totalVolume = 0;
    let totalTime = 0.0;

    object?.work_section?.map((item) => {
      totalVolume += item.work_set * item.work_rep * item.work_kg;
      totalTime += strToDecimal(item.work_cardio);
    });

    object.work_total_volume = totalVolume;
    object.work_total_time = decimalToStr(totalTime);

    return object;
  }
};