// sleepDiffMiddleware.ts

import { differenceInMinutes } from "date-fns";

// 1. list -----------------------------------------------------------------------------------------
export const list = async (object: any) => {

  // 0. calcOverTenMillion -------------------------------------------------------------------------
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = "";

    if (!param || param === "0" || param === "00:00" || String(param).includes(":")) {
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
      finalResult = "grey";
    }
    else {
      finalResult = "light-black";
    }

    return finalResult;
  };

  // 1. compareTime --------------------------------------------------------------------------------
  const compareTime = (goalParam: string, realParam: string, extra: string) => {

    let goal: string = goalParam;
    let real: string = realParam;
    let diffVal: number = 0;
    let finalResult: string = "";

    // 1. bedTime, wakeTime
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}:00Z`);
      const realDate = new Date(`1970-01-01T${real}:00Z`);

      diffVal = differenceInMinutes(realDate, goalDate);

      // 차이가 음수인 경우, 절대값을 사용하여 계산
      if (diffVal < 0) {
        diffVal = Math.abs(diffVal);
      }

      // HH:mm 형식으로 결과 반환
      const hours = Math.floor(diffVal / 60);
      const minutes = diffVal % 60;

      if (goalDate > realDate) {
        finalResult = `-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      else {
        finalResult = `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
    // 2. sleepTime
    else if (extra === "sleepTime") {
      const goalDate = new Date(`1970-01-01T${goal}:00Z`);
      const realDate = new Date(`1970-01-01T${real}:00Z`);

      diffVal = differenceInMinutes(realDate, goalDate);

      // 시간 차이가 음수인 경우 절대값 적용
      if (diffVal < 0) {
        diffVal = Math.abs(diffVal);
      }

      const hours = Math.floor(diffVal / 60);
      const minutes = diffVal % 60;

      if (goalDate > realDate) {
        finalResult = `-${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      else {
        finalResult = `+${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }

    return finalResult;
  };

  // 4. calcDiffColor ------------------------------------------------------------------------------
  const calcDiffColor = (goalParam: string, realParam: string, extra: string) => {

    let goal: string = goalParam;
    let real: string = realParam;
    let diffVal: number = 0;
    let finalResult: string = "";

    // 1. bedTime, wakeTime
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}:00Z`);
      const realDate = new Date(`1970-01-01T${real}:00Z`);

      if (realDate < goalDate) {
        diffVal = goalDate.getTime() - realDate.getTime();
      }
      else {
        diffVal = realDate.getTime() - goalDate.getTime();
      }

      // 1. - 10분
      if (0 <= diffVal && diffVal <= 600000) {
        finalResult += " firstScore";
      }
      // 2. 10분 - 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        finalResult += " secondScore";
      }
      // 3. 20분 - 40분
      else if (1200000 < diffVal && diffVal <= 2400000) {
        finalResult += " thirdScore";
      }
      // 4. 40분 - 60분
      else if (2400000 < diffVal && diffVal <= 3600000) {
        finalResult += " fourthScore";
      }
      // 5. 60분 -
      else {
        finalResult += " fifthScore";
      }
    }
    // 2. sleepTime
    else if (extra === "sleepTime") {
      const hoursGoal = parseFloat(goalParam?.split(":")[0]);
      const hoursReal = parseFloat(realParam?.split(":")[0]);
      const hours = Math.abs(hoursGoal - hoursReal);
      const minutesGoal = parseFloat(goalParam?.split(":")[1]);
      const minutesReal = parseFloat(realParam?.split(":")[1]);
      const minutes = Math.abs(minutesGoal - minutesReal);

      diffVal = (hours * 60) + minutes;

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

    return finalResult;
  };

  // 10. return ------------------------------------------------------------------------------------
  object?.result?.forEach((item: any) => {
    item.sleep_bedTime = calcOverTenMillion(
      item?.sleep_bedTime
    );
    item.sleep_wakeTime = calcOverTenMillion(
      item?.sleep_wakeTime
    );
    item.sleep_sleepTime = calcOverTenMillion(
      item?.sleep_sleepTime
    );

    item.sleep_goal_bedTime = calcOverTenMillion(
      item?.sleep_goal_bedTime
    );
    item.sleep_goal_wakeTime = calcOverTenMillion(
      item?.sleep_goal_wakeTime
    );
    item.sleep_goal_sleepTime = calcOverTenMillion(
      item?.sleep_goal_sleepTime
    );

    item.sleep_bedTime_color = calcNonValueColor(
      item?.sleep_bedTime
    );
    item.sleep_wakeTime_color = calcNonValueColor(
      item?.sleep_wakeTime
    );
    item.sleep_sleepTime_color = calcNonValueColor(
      item?.sleep_sleepTime
    );

    item.sleep_goal_bedTime_color = calcNonValueColor(
      item?.sleep_goal_bedTime
    );
    item.sleep_goal_wakeTime_color = calcNonValueColor(
      item?.sleep_goal_wakeTime
    );
    item.sleep_goal_sleepTime_color = calcNonValueColor(
      item?.sleep_goal_sleepTime
    );

    item.sleep_diff_bedTime = calcOverTenMillion(compareTime(
      item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
    ));
    item.sleep_diff_wakeTime = calcOverTenMillion(compareTime(
      item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
    ));
    item.sleep_diff_sleepTime = calcOverTenMillion(compareTime(
      item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "sleepTime"
    ));

    item.sleep_diff_bedTime_color = calcDiffColor(
      item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
    );
    item.sleep_diff_wakeTime_color = calcDiffColor(
      item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
    );
    item.sleep_diff_sleepTime_color = calcDiffColor(
      item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "sleepTime"
    );
  });

  return object;
};