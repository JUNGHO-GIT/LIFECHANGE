// exerciseDiffMiddleware.js

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object) => {

  if (!object) {
    return [];
  }

  const compareValue = (goal, real) => {
    const diffVal = Math.abs(real - goal);
    return diffVal;
  };

  const compareTime = (goal, real) => {
    const hoursGoal = parseInt(goal?.split(":")[0], 10);
    const minutesGoal = parseInt(goal?.split(":")[1], 10);

    const hoursReal = parseInt(real?.split(":")[0], 10);
    const minutesReal = parseInt(real?.split(":")[1], 10);

    const hours = Math.abs(hoursGoal - hoursReal);
    const minutes = Math.abs(minutesGoal - minutesReal);

    const diffTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    return diffTime;
  };

  const makeColor = (goal, real, extra) => {
    if (extra === "count") {
      const percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        return "primary";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "success";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        return "secondary";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        return "warning";
      }
      // 5. 50% ~
      else {
        return "danger";
      }
    }
    else if (extra === "volume") {
      const percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        return "primary";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "success";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        return "secondary";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        return "warning";
      }
      // 5. 50% ~
      else {
        return "danger";
      }
    }
    else if (extra === "cardio") {
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
    else if (extra === "weight") {
      const percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        return "primary";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "success";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        return "secondary";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        return "warning";
      }
      // 5. 50% ~
      else {
        return "danger";
      }
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      exercise_diff_count: compareValue(
        item?.exercise_goal_count, item?.exercise_total_count
      ),
      exercise_diff_volume: compareValue(
        item?.exercise_goal_volume, item?.exercise_total_volume
      ),
      exercise_diff_cardio: compareTime(
        item?.exercise_goal_cardio, item?.exercise_total_cardio
      ),
      exercise_diff_weight: compareValue(
        item?.exercise_goal_weight, item?.exercise_body_weight
      ),
      exercise_diff_count_color: makeColor(
        item?.exercise_goal_count, item?.exercise_total_count, "count"
      ),
      exercise_diff_volume_color: makeColor(
        item?.exercise_goal_volume, item?.exercise_total_volume, "volume"
      ),
      exercise_diff_cardio_color: makeColor(
        item?.exercise_goal_cardio, item?.exercise_total_cardio, "cardio"
      ),
      exercise_diff_weight_color: makeColor(
        item?.exercise_goal_weight, item?.exercise_body_weight, "weight"
      ),
    });
  });

  return object;
};