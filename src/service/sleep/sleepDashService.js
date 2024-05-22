// sleepDashService.js

import * as repository from "../../repository/sleep/sleepDashRepository.js";
import {log} from "../../assets/js/utils.js";
import {timeFormat, koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.barToday.listPlan(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  log("findPlan", findPlan);
  log("findReal", findReal);

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
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex 월
  const name = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineWeek.list(
    user_id_param, dateStart, dateEnd
  );

  name.forEach((data, index) => {
    const findIndex = findResult?.findIndex((item) => (
      new Date(item.sleep_dateStart).getDay() === index
    ));

    finalResult.push({
      name: data,
      date: date[index],
      취침: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_night) : 0,
      수면: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_time) : 0,
      기상: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_morning) : 0
    });
  });

  return finalResult;
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineMonth.list(
    user_id_param, dateStart, dateEnd
  );

  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.sleep_dateStart).getDate() === index + 1
    ));

    finalResult.push({
      name: data,
      date: date[index],
      취침: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_night) : 0,
      수면: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_time) : 0,
      기상: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_morning) : 0
    });
  });

  return finalResult;
}

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `${i + 1}주차`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curWeekStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curWeekStart.clone().add((i + 1) * 7 - 1, 'days').format("MM-DD")}`;
  });

  let sumStart = Array(5).fill(0);
  let sumEnd = Array(5).fill(0);
  let sumTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((item) => {
    const sleepDate = new Date(item.sleep_dateStart);
    const diffTime = Math.abs(sleepDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumStart[weekNum] += timeFormat(item.sleep_section[0]?.sleep_night);
      sumEnd[weekNum] += timeFormat(item.sleep_section[0]?.sleep_morning);
      sumTime[weekNum] += timeFormat(item.sleep_section[0]?.sleep_time);
      countRecords[weekNum]++;
    }
  });

  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      취침: timeFormat(sumStart[index] / countRecords[index]),
      기상: timeFormat(sumEnd[index] / countRecords[index]),
      수면: timeFormat(sumTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `${i + 1}월`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumStart = Array(12).fill(0);
  let sumEnd = Array(12).fill(0);
  let sumTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgYear.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((element) => {
    const sleepDate = new Date(element.sleep_dateStart);
    const monthNum = sleepDate.getMonth();
    sumStart[monthNum] += timeFormat(element.sleep_section[0]?.sleep_night);
    sumEnd[monthNum] += timeFormat(element.sleep_section[0]?.sleep_morning);
    sumTime[monthNum] += timeFormat(element.sleep_section[0]?.sleep_time);
    countRecords[monthNum]++;
  });

  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      취침: timeFormat(sumStart[index] / countRecords[index]),
      기상: timeFormat(sumEnd[index] / countRecords[index]),
      수면: timeFormat(sumTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};