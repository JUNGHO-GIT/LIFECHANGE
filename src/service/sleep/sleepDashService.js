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

  finalResult = [
    {
      name: "취침",
      date: dateStart,
      목표: timeFormat(findPlan?.[0]?.sleep_plan_night),
      실제: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_night)
    },
    {
      name: "수면",
      date: dateStart,
      목표: timeFormat(findPlan?.[0]?.sleep_plan_time),
      실제: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_time)
    },
    {
      name: "기상",
      date: dateStart,
      목표: timeFormat(findPlan?.[0]?.sleep_plan_morning),
      실제: timeFormat(findReal?.[0]?.sleep_section?.[0]?.sleep_morning)
    }
  ];

  return finalResult;
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let sumNight = 0;
  let sumMorning = 0;
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
    !data.sleep_section[0]?.sleep_night ||
    !data.sleep_section[0]?.sleep_morning ||
    !data.sleep_section[0]?.sleep_time
  ));

  // 데이터가 누락되었는지 확인
  if (dataMissing === false) {
    finalResult = [];
  }
  else {
    findResult.forEach((data, index) => {
      sumNight += timeFormat(data.sleep_section[0]?.sleep_night);
      sumMorning += timeFormat(data.sleep_section[0]?.sleep_morning);
      sumTime += timeFormat(data.sleep_section[0]?.sleep_time);
      countRecords++;
    });
    totalSleep = sumNight + sumMorning + sumTime;

    finalResult = [
      {
        name: "취침",
        value: totalSleep > 0 ? Math.round(sumNight / totalSleep * 100) : 0
      },
      {
        name: "기상",
        value: totalSleep > 0 ? Math.round(sumMorning / totalSleep * 100) : 0
      },
      {
        name: "수면",
        value: totalSleep > 0 ? Math.round(sumTime / totalSleep * 100) : 0
      },
    ];
  }

  return finalResult;
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------>
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let sumNight = 0;
  let sumMorning = 0;
  let sumTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieWeek.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    sumNight += timeFormat(data.sleep_section[0]?.sleep_night);
    sumMorning += timeFormat(data.sleep_section[0]?.sleep_morning);
    sumTime += timeFormat(data.sleep_section[0]?.sleep_time);
    countRecords++;
  });
  totalSleep = sumNight + sumMorning + sumTime;

  finalResult = [
    {
      name: "취침",
      value: totalSleep > 0 ? Math.round(sumNight / totalSleep * 100) : 0
    },
    {
      name: "기상",
      value: totalSleep > 0 ? Math.round(sumMorning / totalSleep * 100) : 0
    },
    {
      name: "수면",
      value: totalSleep > 0 ? Math.round(sumTime / totalSleep * 100) : 0
    },
  ];

  return finalResult;
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let sumNight = 0;
  let sumMorning = 0;
  let sumTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  let findResult = [];
  let finalResult = [];

  findResult = await repository.pieMonth.list(
    user_id_param, dateStart, dateEnd
  );
  findResult.forEach((data, index) => {
    sumNight += timeFormat(data.sleep_section[0]?.sleep_night);
    sumMorning += timeFormat(data.sleep_section[0]?.sleep_morning);
    sumTime += timeFormat(data.sleep_section[0]?.sleep_time);
    countRecords++;
  });
  totalSleep = sumNight + sumMorning + sumTime;

  finalResult = [
    {
      name: "취침",
      value: totalSleep > 0 ? Math.round(sumNight / totalSleep * 100) : 0
    },
    {
      name: "기상",
      value: totalSleep > 0 ? Math.round(sumMorning / totalSleep * 100) : 0
    },
    {
      name: "수면",
      value: totalSleep > 0 ? Math.round(sumTime / totalSleep * 100) : 0
    },
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

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndex = findResult?.findIndex((item) => (
      new Date(item.sleep_dateStart).getDay() === index + 1
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
    return `${curMonthStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curMonthStart.clone().add(i * 7 + 6, 'days').format("MM-DD")}`;
  });

  let sumNight = Array(5).fill(0);
  let sumMorning = Array(5).fill(0);
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
      sumNight[weekNum] += timeFormat(data.sleep_section[0]?.sleep_night);
      sumMorning[weekNum] += timeFormat(data.sleep_section[0]?.sleep_morning);
      sumTime[weekNum] += timeFormat(data.sleep_section[0]?.sleep_time);
      countRecords[weekNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      취침: timeFormat(sumNight[index] / countRecords[index]),
      기상: timeFormat(sumMorning[index] / countRecords[index]),
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

  let sumNight = Array(12).fill(0);
  let sumMorning = Array(12).fill(0);
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
    sumNight[monthNum] += timeFormat(data.sleep_section[0]?.sleep_night);
    sumMorning[monthNum] += timeFormat(data.sleep_section[0]?.sleep_morning);
    sumTime[monthNum] += timeFormat(data.sleep_section[0]?.sleep_time);
    countRecords[monthNum]++;
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      취침: timeFormat(sumNight[index] / countRecords[index]),
      기상: timeFormat(sumMorning[index] / countRecords[index]),
      수면: timeFormat(sumTime[index] / countRecords[index]),
    });
  });

  return finalResult;
};