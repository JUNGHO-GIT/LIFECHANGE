// sleepDashService.js

import moment from "moment";
import * as repo from "../../repository/dash/sleepDashRepo.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");

// 0-2. format ------------------------------------------------------------------------------------>
const dateFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const time = data.split(":");
    if (time.length === 2) {
      const hours = parseInt(time[0], 10);
      const minutes = parseInt(time[1], 10) / 60;
      return parseFloat((hours + minutes).toFixed(1));
    }
    else {
      return 0;
    }
  }
  else {
    return parseFloat(data.toFixed(1));
  }
};

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataFields = {
    "취침": {
      plan: "sleep_plan_night",
      real: "sleep_night"
    },
    "기상": {
      plan: "sleep_plan_morning",
      real: "sleep_morning"
    },
    "수면": {
      plan: "sleep_plan_time",
      real: "sleep_time"
    },
  };

  let finalResult = [];

  for (let key in dataFields) {
    const findResultPlan = await repo.detailPlan(
      "", user_id_param, koreanDate, koreanDate
    );
    const findResultReal = await repo.detailReal(
      "", user_id_param, koreanDate, koreanDate
    );

    finalResult.push({
      name: key,
      목표: dateFormat(findResultPlan?.[dataFields[key].plan]),
      실제: dateFormat(findResultReal?.sleep_section?.[0]?.[dataFields[key].real]),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let finalResult = [];

  for (let i in names) {
    const dayNum = moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days");
    const findResult = await repo.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${names[i]} ${dayNum.format("MM/DD")}`,
      취침: dateFormat(findResult?.sleep_section?.[0]?.sleep_night),
      기상: dateFormat(findResult?.sleep_section?.[0]?.sleep_morning),
      수면: dateFormat(findResult?.sleep_section?.[0]?.sleep_time),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumSleepStart = Array(5).fill(0);
  let sumSleepEnd = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  let finalResult = [];

  for (
    let week = curMonthStart.clone();
    week.isBefore(curMonthEnd);
    week.add(1, "days")
  ) {
    const weekNum = week.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await repo.detailReal(
        "", user_id_param, week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
      );

      if (findResult) {
        sumSleepStart[weekNum - 1] += dateFormat(findResult?.sleep_section?.[0]?.sleep_night);
        sumSleepEnd[weekNum - 1] += dateFormat(findResult?.sleep_section?.[0]?.sleep_morning);
        sumSleepTime[weekNum - 1] += dateFormat(findResult?.sleep_section?.[0]?.sleep_time);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      취침: dateFormat(sumSleepStart[i] / countRecords[i]),
      기상: dateFormat(sumSleepEnd[i] / countRecords[i]),
      수면: dateFormat(sumSleepTime[i] / countRecords[i]),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let sumSleepStart = Array(12).fill(0);
  let sumSleepEnd = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  let finalResult = [];

  for (
    let month = curMonthStart.clone();
    month.isBefore(curMonthEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repo.detailReal(
      "", user_id_param, month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
    );

    if (findResult) {
      sumSleepStart[monthNum] += dateFormat(findResult?.sleep_section?.[0]?.sleep_night);
      sumSleepEnd[monthNum] += dateFormat(findResult?.sleep_section?.[0]?.sleep_morning);
      sumSleepTime[monthNum] += dateFormat(findResult?.sleep_section?.[0]?.sleep_time);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      취침: dateFormat(sumSleepStart[i] / countRecords[i]),
      기상: dateFormat(sumSleepEnd[i] / countRecords[i]),
      수면: dateFormat(sumSleepTime[i] / countRecords[i]),
    });
  };

  return {
    result: finalResult,
  };
};