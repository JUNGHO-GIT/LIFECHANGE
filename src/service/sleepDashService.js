// sleepDashService.js

import * as repository from "../repository/sleepDashRepository.js";
import {timeFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  const data = {
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

  let findPlan = [];
  let findReal = [];
  let finalResult;

  findPlan = await repository.barToday.listPlan(
    customer_id_param, startDt, endDt
  );

  findReal = await repository.barToday.listReal(
    customer_id_param, startDt, endDt
  );

  console.log("===================================");
  console.log("findPlan: ", JSON.stringify(findPlan, null, 3));

  console.log("===================================");
  console.log("findReal: ", JSON.stringify(findReal, null, 3));
};


// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  const data = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineWeek.list(
    customer_id_param, startDt, endDt
  );

  findResult.forEach((element) => {
    finalResult.push({
      name: `${element.sleep_startDt.slice(5, 10)}(${data[new Date(element.sleep_startDt).getDay()]})`,
      취침: timeFormat(element.sleep_section[0].sleep_night),
      수면: timeFormat(element.sleep_section[0].sleep_time),
      기상: timeFormat(element.sleep_section[0].sleep_morning)
    });
  });

  return finalResult;
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  customer_id_param
) => {

  const data = [
    "1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일",
    "11일", "12일", "13일", "14일", "15일", "16일", "17일", "18일", "19일", "20일",
    "21일", "22일", "23일", "24일", "25일", "26일", "27일", "28일", "29일", "30일", "31일"
  ];

  let finalResult = [];

  for (let i = 0; i < 31; i++) {
    const dayNum = curMonthStart.clone().add(i, "days");
    const findResult = await repository.lineMonth.list(
      customer_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${data[i]}`,
      취침: timeFormat(findResult?.sleep_section?.[0]?.sleep_night),
      수면: timeFormat(findResult?.sleep_section?.[0]?.sleep_time),
      기상: timeFormat(findResult?.sleep_section?.[0]?.sleep_morning)
    });
  }

  return finalResult;
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = async (
  customer_id_param
) => {

  let sumSleepStart = Array(5).fill(0);
  let sumSleepEnd = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const data = [
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
      const findResult = await repository.avgWeek.list(
        customer_id_param, week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
      );

      if (findResult) {
        sumSleepStart[weekNum - 1] += timeFormat(findResult?.sleep_section?.[0]?.sleep_night);
        sumSleepEnd[weekNum - 1] += timeFormat(findResult?.sleep_section?.[0]?.sleep_morning);
        sumSleepTime[weekNum - 1] += timeFormat(findResult?.sleep_section?.[0]?.sleep_time);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${data[i]}`,
      취침: timeFormat(sumSleepStart[i] / countRecords[i]),
      기상: timeFormat(sumSleepEnd[i] / countRecords[i]),
      수면: timeFormat(sumSleepTime[i] / countRecords[i]),
    });
  };

  return finalResult;
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  customer_id_param
) => {

  let sumSleepStart = Array(12).fill(0);
  let sumSleepEnd = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const data = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  let finalResult = [];

  for (
    let month = curYearStart.clone();
    month.isBefore(curYearEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repository.avgMonth.list(
      customer_id_param, month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
    );

    if (findResult) {
      sumSleepStart[monthNum] += timeFormat(findResult?.sleep_section?.[0]?.sleep_night);
      sumSleepEnd[monthNum] += timeFormat(findResult?.sleep_section?.[0]?.sleep_morning);
      sumSleepTime[monthNum] += timeFormat(findResult?.sleep_section?.[0]?.sleep_time);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: data[i],
      취침: timeFormat(sumSleepStart[i] / countRecords[i]),
      기상: timeFormat(sumSleepEnd[i] / countRecords[i]),
      수면: timeFormat(sumSleepTime[i] / countRecords[i]),
    });
  };

  return finalResult;
};