// exerciseDiffMiddleware.ts

import { differenceInMinutes } from "date-fns";

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 0. calcOverTenMillion -------------------------------------------------------------------------
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = "";

    if (!param || param === "0" || param === "00:00" || param.includes(":")) {
      finalResult = param;
    }
    // 12300000 -> 1.23M / 10000000 -> 10M
    else if (Number(param) >= 10_000_000) {
      finalResult = `${(parseFloat((Number(param) / 1_000_000).toFixed(2)).toString())}M`;
    }
    else {
      finalResult = parseFloat(Number(param).toFixed(2)).toString();
    }

    return finalResult;
  };

  // 0. calcNonValueColor --------------------------------------------------------------------------
  const calcNonValueColor = (param: string) => {

    let finalResult: string = "";

    if (!param) {
      finalResult = param;
    }
    else if (param === "0" || param === "00:00") {
      finalResult += " grey";
    }
    else {
      finalResult += " light-black";
    }

    return finalResult;
  };

  // 1. compareValue -------------------------------------------------------------------------------
  const compareValue = (goalParam: string, realParam: string) => {

    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);
    let finalResult: string = "";

    if (goal > real) {
      finalResult = `-${(parseFloat(Math.abs(goal - real).toFixed(2)).toString())}`;
    }
    else {
      finalResult = `+${(parseFloat(Math.abs(real - goal).toFixed(2)).toString())}`;
    }

    return finalResult;
  };

  // 2. compareTime --------------------------------------------------------------------------------
  const compareTime = (goalParam: string, realParam: string) => {

    let goal: string = goalParam;
    let real: string = realParam;
    let finalResult: string = "";

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
      finalResult = `-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    else {
      finalResult = `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return finalResult;
  };

  // 4. calcDiffColor ------------------------------------------------------------------------------
  const calcDiffColor = (goalParam: string, realParam: string, extra: string) => {

    let goal: number = parseFloat(goalParam);
    let real: number = parseFloat(realParam);
    let percent: number = 0;
    let finalResult: string = "";

    // 1. count
    if (extra === "count") {
      percent = Math.abs(((goal - real) / goal) * 100);

      // 1. - 1%
      if (percent > 0 && percent <= 1) {
        finalResult += " firstScore";
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        finalResult += " secondScore";
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        finalResult += " thirdScore";
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        finalResult += " fourthScore";
      }
      // 5. 50% -
      else {
        finalResult += " fifthScore";
      }
    }

    // 2. volume
    else if (extra === "volume") {
      percent = Math.abs(((goal - real) / goal) * 100);

      // 1. - 1%
      if (percent > 0 && percent <= 1) {
        finalResult += " firstScore";
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        finalResult += " secondScore";
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        finalResult += " thirdScore";
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        finalResult += " fourthScore";
      }
      // 5. 50% -
      else {
        finalResult += " fifthScore";
      }
    }

    // 3. cardio
    else if (extra === "cardio") {
      const hoursGoal = parseFloat(goalParam?.split(":")[0]);
      const hoursReal = parseFloat(realParam?.split(":")[0]);
      const hours = Math.abs(hoursGoal - hoursReal);
      const minutesGoal = parseFloat(goalParam?.split(":")[1]);
      const minutesReal = parseFloat(realParam?.split(":")[1]);
      const minutes = Math.abs(minutesGoal - minutesReal);

      const diffVal = (hours * 60) + minutes;

      // 1. - 10분
      if (0 <= diffVal && diffVal <= 10) {
        finalResult += " firstScore";
      }
      // 2. 10분 - 20분
      else if (10 < diffVal && diffVal <= 20) {
        finalResult += " secondScore";
      }
      // 3. 20분 - 40분
      else if (20 < diffVal && diffVal <= 40) {
        finalResult += " thirdScore";
      }
      // 4. 40분 - 60분
      else if (40 < diffVal && diffVal <= 60) {
        finalResult += " fourthScore";
      }
      // 5. 60분 -
      else {
        finalResult += " fifthScore";
      }
    }

    // 4. scale
    else if (extra === "scale") {
      percent = Math.abs(((goal - real) / goal) * 100);

      // 1. - 1%
      if (percent > 0 && percent <= 1) {
        finalResult += " firstScore";
      }
      // 2. 1% - 10%
      else if (percent > 1 && percent <= 10) {
        finalResult += " secondScore";
      }
      // 3. 10% - 30%
      else if (percent > 10 && percent <= 30) {
        finalResult += " thirdScore";
      }
      // 4. 30% - 50%
      else if (percent > 30 && percent <= 50) {
        finalResult += " fourthScore";
      }
      // 5. 50% -
      else {
        finalResult += " fifthScore";
      }
    }

    return finalResult;
  };

  // 10. result ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.exercise_total_count = calcOverTenMillion(
      item?.exercise_total_count
    );
    item.exercise_total_volume = calcOverTenMillion(
      item?.exercise_total_volume
    );
    item.exercise_total_cardio = calcOverTenMillion(
      item?.exercise_total_cardio
    );
    item.exercise_total_scale = calcOverTenMillion(
      item?.exercise_total_scale
    );

    item.exercise_goal_count = calcOverTenMillion(
      item?.exercise_goal_count
    );
    item.exercise_goal_volume = calcOverTenMillion(
      item?.exercise_goal_volume
    );
    item.exercise_goal_cardio = calcOverTenMillion(
      item?.exercise_goal_cardio
    );
    item.exercise_goal_scale = calcOverTenMillion(
      item?.exercise_goal_scale
    );

    item.exercise_total_count_color = calcNonValueColor(
      item?.exercise_total_count
    );
    item.exercise_total_volume_color = calcNonValueColor(
      item?.exercise_total_volume
    );
    item.exercise_total_cardio_color = calcNonValueColor(
      item?.exercise_total_cardio
    );
    item.exercise_total_scale_color = calcNonValueColor(
      item?.exercise_total_scale
    );

    item.exercise_goal_count_color = calcNonValueColor(
      item?.exercise_goal_count
    );
    item.exercise_goal_volume_color = calcNonValueColor(
      item?.exercise_goal_volume
    );
    item.exercise_goal_cardio_color = calcNonValueColor(
      item?.exercise_goal_cardio
    );
    item.exercise_goal_scale_color = calcNonValueColor(
      item?.exercise_goal_scale
    );

    item.exercise_diff_count = calcOverTenMillion(compareValue(
      item?.exercise_goal_count, item?.exercise_total_count
    ));
    item.exercise_diff_volume = calcOverTenMillion(compareValue(
      item?.exercise_goal_volume, item?.exercise_total_volume
    ));
    item.exercise_diff_cardio = calcOverTenMillion(compareTime(
      item?.exercise_goal_cardio, item?.exercise_total_cardio
    ));
    item.exercise_diff_scale = calcOverTenMillion(compareValue(
      item?.exercise_goal_scale, item?.exercise_total_scale
    ));

    item.exercise_diff_count_color = calcDiffColor(
      item?.exercise_goal_count, item?.exercise_total_count, "count"
    );
    item.exercise_diff_volume_color = calcDiffColor(
      item?.exercise_goal_volume, item?.exercise_total_volume, "volume"
    );
    item.exercise_diff_cardio_color = calcDiffColor(
      item?.exercise_goal_cardio, item?.exercise_total_cardio, "cardio"
    );
    item.exercise_diff_scale_color = calcDiffColor(
      item?.exercise_goal_scale, item?.exercise_total_scale, "scale"
    );
  });

  return object;
};