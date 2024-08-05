// sleepChartService.js

import * as repository from "../../repository/sleep/sleepChartRepository.js";
import {log} from "../../assets/js/utils.js";
import {timeFormat} from "../../assets/js/utils.js";
import {koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findGoal = [];
  let findReal = [];
  let finalResult = [];

  findGoal = await repository.barToday.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "bedTime",
      date: dateStart,
      goal: String(timeFormat(findGoal?.[0]?.sleep_goal_bedTime) || "0"),
      real: String(timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_bedTime) || "0")
    },
    {
      name: "wakeTime",
      date: dateStart,
      goal: String(timeFormat(findGoal?.[0]?.sleep_goal_wakeTime) || "0"),
      real: String(timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_wakeTime) || "0")
    },
    {
      name: "sleepTime",
      date: dateStart,
      goal: String(timeFormat(findGoal?.[0]?.sleep_goal_sleepTime) || "0"),
      real: String(timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_sleepTime) || "0")
    }
  ];

  return finalResult;
};

// 2-1. chart (pie - today) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieToday.list(
    user_id_param, dateStart, dateEnd
  );

  // 누락된 데이터가 있는지 확인
  let dataMissing = findResult.some((data) => (
    !data.sleep_section[0]?.sleep_bedTime ||
    !data.sleep_section[0]?.sleep_wakeTime ||
    !data.sleep_section[0]?.sleep_sleepTime
  ));

  // 데이터가 누락되었는지 확인
  if (dataMissing === false) {
    finalResult = [];
  }

  findResult.forEach((data, index) => {
    sumBedTime += Number(timeFormat(data.sleep_section[0]?.sleep_bedTime));
    sumWakeTime += Number(timeFormat(data.sleep_section[0]?.sleep_wakeTime));
    sumSleepTime += Number(timeFormat(data.sleep_section[0]?.sleep_sleepTime));
    countRecords++;
  });
  totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

  finalResult = [
    {
      name: String("bedTime"),
      value: Number(Math.round(sumBedTime / totalSleep * 100) || 0)
    },
    {
      name: String("wakeTime"),
      value: Number(Math.round(sumWakeTime / totalSleep * 100) || 0)
    },
    {
      name: String("sleepTime"),
      value: Number(Math.round(sumSleepTime / totalSleep * 100) || 0)
    },
  ];

  return finalResult;
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieWeek.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    sumBedTime += Number(timeFormat(data.sleep_section[0]?.sleep_bedTime));
    sumWakeTime += Number(timeFormat(data.sleep_section[0]?.sleep_wakeTime));
    sumSleepTime += Number(timeFormat(data.sleep_section[0]?.sleep_sleepTime));
    countRecords++;
  });
  totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

  finalResult = [
    {
      name: String("bedTime"),
      value: Number(Math.round(sumBedTime / totalSleep * 100) || 0)
    },
    {
      name: String("wakeTime"),
      value: Number(Math.round(sumWakeTime / totalSleep * 100) || 0)
    },
    {
      name: String("sleepTime"),
      value: Number(Math.round(sumSleepTime / totalSleep * 100) || 0)
    },
  ];

  return finalResult;
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieMonth.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    sumBedTime += Number(timeFormat(data.sleep_section[0]?.sleep_bedTime));
    sumWakeTime += Number(timeFormat(data.sleep_section[0]?.sleep_wakeTime));
    sumSleepTime += Number(timeFormat(data.sleep_section[0]?.sleep_sleepTime));
    countRecords++;
  });
  totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

  finalResult = [
    {
      name: String("bedTime"),
      value: Number(Math.round(sumBedTime / totalSleep * 100) || 0)
    },
    {
      name: String("wakeTime"),
      value: Number(Math.round(sumWakeTime / totalSleep * 100) || 0)
    },
    {
      name: String("sleepTime"),
      value: Number(Math.round(sumSleepTime / totalSleep * 100) || 0)
    },
  ];

  return finalResult;
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
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

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndex = findResult?.findIndex((item) => (
      new Date(item.sleep_dateStart).getDay() === index + 1
    ));

    finalResult.push({
      name: data,
      date: date[index],
      bedTime:
        findIndex !== -1
        ? String(timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_bedTime))
        : "0",
      wakeTime:
        findIndex !== -1
        ? String(timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_wakeTime))
        : "0",
      sleepTime:
        findIndex !== -1
        ? String(timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_sleepTime))
        : "0",
    });
  });

  return finalResult;
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}`;
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

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.sleep_dateStart).getDate() === index
    ));

    finalResult.push({
      name: data,
      date: date[index],
      bedTime:
        findIndex !== -1
        ? String(timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_bedTime))
        : "0",
      wakeTime:
        findIndex !== -1
        ? String(timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_wakeTime))
        : "0",
      sleepTime:
        findIndex !== -1
        ? String(timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_sleepTime))
        : "0",
    });
  });

  return finalResult;
}

// 4-1. chart (avg - week) ------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `week${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curMonthStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curMonthStart.clone().add(i * 7 + 6, 'days').format("MM-DD")}`;
  });

  let sumBedTime = Array(5).fill(0);
  let sumWakeTime = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgWeek.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    const sleepDate = new Date(data.sleep_dateStart);
    const diffTime = Math.abs(sleepDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumBedTime[weekNum] += timeFormat(data.sleep_section[0]?.sleep_bedTime);
      sumWakeTime[weekNum] += timeFormat(data.sleep_section[0]?.sleep_wakeTime);
      sumSleepTime[weekNum] += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
      countRecords[weekNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      bedTime:
        countRecords[index] > 0
        ? String(timeFormat(sumBedTime[index] / countRecords[index]))
        : "0",
      wakeTime:
        countRecords[index] > 0
        ? String(timeFormat(sumWakeTime[index] / countRecords[index]))
        : "0",
      sleepTime:
        countRecords[index] > 0
        ? String(timeFormat(sumSleepTime[index] / countRecords[index]))
        : "0",
    });
  });

  return finalResult;
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = curYearStart.clone().add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = curYearStart.clone().add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  let sumBedTime = Array(12).fill(0);
  let sumWakeTime = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    const sleepDate = new Date(data.sleep_dateStart);
    const monthNum = sleepDate.getMonth();
    if (monthNum >= 0 && monthNum < 12) {
      sumBedTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_bedTime);
      sumWakeTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_wakeTime);
      sumSleepTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
      countRecords[monthNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      bedTime:
        countRecords[index] > 0
        ? String(timeFormat(sumBedTime[index] / countRecords[index]))
        : "0",
      wakeTime:
        countRecords[index] > 0
        ? String(timeFormat(sumWakeTime[index] / countRecords[index]))
        : "0",
      sleepTime:
        countRecords[index] > 0
        ? String(timeFormat(sumSleepTime[index] / countRecords[index]))
        : "0",
    });
  });

  return finalResult;
};