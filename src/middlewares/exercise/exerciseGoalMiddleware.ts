// exerciseDiffMiddleware.ts

import { differenceInMinutes } from "date-fns";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (object: any) => {

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, realParam: string) => {
    const goal = parseFloat(goalParam);
    const real = parseFloat(realParam);
    if (goal > real) {
      return `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
    }
    else {
      return `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
    }
  };

  // 2. compareTime --------------------------------------------------------------------------------
  const compareTime = (goalParam: string, realParam: string) => {
    const goal = goalParam;
    const real = realParam;
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
    const goal = parseFloat(goalParam);
    const real = parseFloat(realParam);

    // 1. count
    if (extra === "count") {
      const percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        return "firstScore";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "secondScore";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        return "thirdScore";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        return "fourthScore";
      }
      // 5. 50% ~
      else {
        return "fifthScore";
      }
    }

    // 2. volume
    else if (extra === "volume") {
      const percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        return "firstScore";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "secondScore";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        return "thirdScore";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        return "fourthScore";
      }
      // 5. 50% ~
      else {
        return "fifthScore";
      }
    }

    // 3. cardio
    else if (extra === "cardio") {
      const hoursGoal = parseFloat(goalParam?.split(":")[0]);
      const minutesGoal = parseFloat(goalParam?.split(":")[1]);

      const hoursReal = parseFloat(realParam?.split(":")[0]);
      const minutesReal = parseFloat(realParam?.split(":")[1]);

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

    // 4. weight
    else if (extra === "weight") {
      const percent = Math.abs(((goal - real) / goal) * 100);

      // 1. ~ 1%
      if (percent > 0 && percent <= 1) {
        return "firstScore";
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return "secondScore";
      }
      // 3. 10% ~ 30%
      else if (percent > 10 && percent <= 30) {
        return "thirdScore";
      }
      // 4. 30% ~ 50%
      else if (percent > 30 && percent <= 50) {
        return "fourthScore";
      }
      // 5. 50% ~
      else {
        return "fifthScore";
      }
    }
  };

  // 4. result -------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    Object.assign(item, {
      exercise_total_count_color: makeNonValueColor(
        item?.exercise_total_count
      ),
      exercise_total_volume_color: makeNonValueColor(
        item?.exercise_total_volume
      ),
      exercise_total_cardio_color: makeNonValueColor(
        item?.exercise_total_cardio
      ),
      exercise_total_weight_color: makeNonValueColor(
        item?.exercise_total_weight
      ),
      exercise_goal_count_color: makeNonValueColor(
        item?.exercise_goal_count
      ),
      exercise_goal_volume_color: makeNonValueColor(
        item?.exercise_goal_volume
      ),
      exercise_goal_cardio_color: makeNonValueColor(
        item?.exercise_goal_cardio
      ),
      exercise_goal_weight_color: makeNonValueColor(
        item?.exercise_goal_weight
      ),
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
        item?.exercise_goal_weight, item?.exercise_total_weight
      ),
      exercise_diff_count_color: makeDiffColor(
        item?.exercise_goal_count, item?.exercise_total_count, "count"
      ),
      exercise_diff_volume_color: makeDiffColor(
        item?.exercise_goal_volume, item?.exercise_total_volume, "volume"
      ),
      exercise_diff_cardio_color: makeDiffColor(
        item?.exercise_goal_cardio, item?.exercise_total_cardio, "cardio"
      ),
      exercise_diff_weight_color: makeDiffColor(
        item?.exercise_goal_weight, item?.exercise_total_weight, "weight"
      ),
    });
  });

  return object;
};