// sleepDashService.js

import * as repository from "../repository/sleepDashRepository.js";
import {timeFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.barToday.listPlan(
    customer_id_param, startDt, endDt
  );
  findReal = await repository.barToday.list(
    customer_id_param, startDt, endDt
  );

  finalResult = [
    {
      name: "취침",
      목표: timeFormat(findPlan?.[0]?.sleep_plan_night),
      실제: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_night)
    },
    {
      name: "수면",
      목표: timeFormat(findPlan?.[0]?.sleep_plan_time),
      실제: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_time)
    },
    {
      name: "기상",
      목표: timeFormat(findPlan?.[0]?.sleep_plan_morning),
      실제: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_morning)
    }
  ];

  return finalResult;
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  // ex 월 (00-00)
  const data = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("dd (MM-DD)");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineWeek.list(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndex = findResult?.findIndex((item) => (
      new Date(item.sleep_startDt).getDay() === index
    ));

    finalResult.push({
      name: data,
      취침: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_night) : 0,
      수면: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_time) : 0,
      기상: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_morning) : 0
    });
  });

  return finalResult;
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineMonth.list(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.sleep_startDt).getDate() === index + 1
    ));

    finalResult.push({
      name: data,
      취침: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_night) : 0,
      수면: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_time) : 0,
      기상: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_morning) : 0
    });
  });

  return finalResult;
}

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차 (00-00 ~ 00-00)
  const data  = Array.from({ length: 5 }, (_, i) => {
    return `${i + 1}주차 (${curWeekStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curWeekStart.clone().add((i + 1) * 7 - 1, 'days').format("MM-DD")})`;
  });

  let sumSleepStart = Array(5).fill(0);
  let sumSleepEnd = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
    customer_id_param, startDt, endDt
  );
  findResult.forEach((item) => {
    const sleepDate = new Date(item.sleep_startDt);
    const diffTime = Math.abs(sleepDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumSleepStart[weekNum] += timeFormat(item.sleep_section[0]?.sleep_night);
      sumSleepEnd[weekNum] += timeFormat(item.sleep_section[0]?.sleep_morning);
      sumSleepTime[weekNum] += timeFormat(item.sleep_section[0]?.sleep_time);
      countRecords[weekNum]++;
    }
  });

  data.forEach((data, index) => {
    finalResult.push({
      name: data,
      취침: timeFormat(sumSleepStart[index] / countRecords[index]),
      기상: timeFormat(sumSleepEnd[index] / countRecords[index]),
      수면: timeFormat(sumSleepTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = async (
  customer_id_param
) => {

  const startDt = curYearStart.format("YYYY-MM-DD");
  const endDt = curYearEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: 12 }, (_, i) => {
    return `${i + 1}월`;
  });

  let sumSleepStart = Array(12).fill(0);
  let sumSleepEnd = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgYear.list(
    customer_id_param, startDt, endDt
  );
  findResult.forEach((element) => {
    const sleepDate = new Date(element.sleep_startDt);
    const monthNum = sleepDate.getMonth();
    sumSleepStart[monthNum] += timeFormat(element.sleep_section[0]?.sleep_night);
    sumSleepEnd[monthNum] += timeFormat(element.sleep_section[0]?.sleep_morning);
    sumSleepTime[monthNum] += timeFormat(element.sleep_section[0]?.sleep_time);
    countRecords[monthNum]++;
  });

  data.forEach((data, index) => {
    finalResult.push({
      name: data,
      취침: timeFormat(sumSleepStart[index] / countRecords[index]),
      기상: timeFormat(sumSleepEnd[index] / countRecords[index]),
      수면: timeFormat(sumSleepTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};