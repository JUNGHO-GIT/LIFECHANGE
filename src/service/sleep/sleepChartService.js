// sleepChartService.js

import * as repository from "../../repository/sleep/sleepChartRepository.js";
import {log} from "../../assets/js/utils.js";
import {timeFormat} from "../../assets/js/utils.js";
import {koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - today) -------------------------------------------------------------------------
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
      goal: timeFormat(findGoal?.[0]?.sleep_goal_bedTime),
      real: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_bedTime)
    },
    {
      name: "wakeTime",
      date: dateStart,
      goal: timeFormat(findGoal?.[0]?.sleep_goal_sleepTime),
      real: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_sleepTime)
    },
    {
      name: "sleepTime",
      date: dateStart,
      goal: timeFormat(findGoal?.[0]?.sleep_goal_wakeTime),
      real: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_wakeTime)
    }
  ];

  return finalResult;
};

// 2-1. chart (pie - today) -------------------------------------------------------------------------
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumTime = 0;
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
  else {
    findResult.forEach((data, index) => {
      sumBedTime += timeFormat(data.sleep_section[0]?.sleep_bedTime);
      sumWakeTime += timeFormat(data.sleep_section[0]?.sleep_wakeTime);
      sumTime += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
      countRecords++;
    });
    totalSleep = sumBedTime + sumWakeTime + sumTime;

    finalResult = [
      {
        name: "bedTime",
        value: totalSleep > 0 ? Math.round(sumBedTime / totalSleep * 100) : 0
      },
      {
        name: "wakeTime",
        value: totalSleep > 0 ? Math.round(sumWakeTime / totalSleep * 100) : 0
      },
      {
        name: "sleepTime",
        value: totalSleep > 0 ? Math.round(sumTime / totalSleep * 100) : 0
      },
    ];
  }

  return finalResult;
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieWeek.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    sumBedTime += timeFormat(data.sleep_section[0]?.sleep_bedTime);
    sumWakeTime += timeFormat(data.sleep_section[0]?.sleep_wakeTime);
    sumTime += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
    countRecords++;
  });
  totalSleep = sumBedTime + sumWakeTime + sumTime;

  finalResult = [
    {
      name: "bedTime",
      value: totalSleep > 0 ? Math.round(sumBedTime / totalSleep * 100) : 0
    },
    {
      name: "wakeTime",
      value: totalSleep > 0 ? Math.round(sumWakeTime / totalSleep * 100) : 0
    },
    {
      name: "sleepTime",
      value: totalSleep > 0 ? Math.round(sumTime / totalSleep * 100) : 0
    },
  ];

  return finalResult;
};

// 2-3. chart (pie - month) -------------------------------------------------------------------------
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieMonth.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    sumBedTime += timeFormat(data.sleep_section[0]?.sleep_bedTime);
    sumWakeTime += timeFormat(data.sleep_section[0]?.sleep_wakeTime);
    sumTime += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
    countRecords++;
  });
  totalSleep = sumBedTime + sumWakeTime + sumTime;

  finalResult = [
    {
      name: "bedTime",
      value: totalSleep > 0 ? Math.round(sumBedTime / totalSleep * 100) : 0
    },
    {
      name: "wakeTime",
      value: totalSleep > 0 ? Math.round(sumWakeTime / totalSleep * 100) : 0
    },
    {
      name: "sleepTime",
      value: totalSleep > 0 ? Math.round(sumTime / totalSleep * 100) : 0
    },
  ];

  return finalResult;
};

// 3-1. chart (line - week) -------------------------------------------------------------------------
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
      bedTime: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_bedTime) : 0,
      wakeTime: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_wakeTime) : 0,
      sleepTime: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_sleepTime) : 0
    });
  });

  return finalResult;
};

// 3-2. chart (line - month) ------------------------------------------------------------------------
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
      bedTime: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_bedTime) : 0,
      wakeTime: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_wakeTime) : 0,
      sleepTime: findIndex !== -1 ? timeFormat(findResult[findIndex]?.sleep_section[0]?.sleep_sleepTime) : 0,
    });
  });

  return finalResult;
}

// 4-1. chart (avg - month) -------------------------------------------------------------------------
export const avgMonth = async (
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
  let sumTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
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
      sumTime[weekNum] += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
      countRecords[weekNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      bedTime: timeFormat(sumBedTime[index] / countRecords[index]),
      wakeTime: timeFormat(sumWakeTime[index] / countRecords[index]),
      sleepTime: timeFormat(sumTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};

// 4-2. chart (avg - year) -------------------------------------------------------------------------
export const avgYear = async (
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
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumBedTime = Array(12).fill(0);
  let sumWakeTime = Array(12).fill(0);
  let sumTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgYear.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    const sleepDate = new Date(data.sleep_dateStart);
    const monthNum = sleepDate.getMonth();
    sumBedTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_bedTime);
    sumWakeTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_wakeTime);
    sumTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_sleepTime);
    countRecords[monthNum]++;
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      bedTime: timeFormat(sumBedTime[index] / countRecords[index]),
      wakeTime: timeFormat(sumWakeTime[index] / countRecords[index]),
      sleepTime: timeFormat(sumTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};