// exerciseDiffMiddleware.js

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const compareCount = (plan, real) => {
    const diffVal = Math.abs(real - plan);
    return diffVal;
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
        return "danger";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "warning";
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return "success";
      }
      // 4. 50% ~
      else {
        return "primary";
      }
    }
    else if (extra === "volume" || extra === "weight") {
      // 1. ~ 1%
      if (percent <= 1) {
        return "primary";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "success";
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return "warning";
      }
      // 4. 50% ~
      else {
        return "danger";
      }
    }
    else if (extra === "time") {
      let diffVal = 0;
      if (realDate < planDate) {
        diffVal = planDate.getTime() - realDate.getTime();
      }
      else {
        diffVal = realDate.getTime() - planDate.getTime();
      }
      // 1. 10분이내
      if (0 <= diffVal && diffVal <= 600000) {
        return "success";
      }
      // 2. 10분 ~ 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        return "warning";
      }
      // 3. 20분 ~
      else if (1200000 < diffVal) {
        return "danger";
      }
      else {
        return "primary";
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