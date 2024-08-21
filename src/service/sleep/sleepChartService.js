// sleepChartService.js

import * as repository from "../../repository/sleep/sleepChartRepository.js";
import moment from "moment-timezone";
import { timeToDecimal } from "../../assets/js/utils.js";
import { curWeekStart, curWeekEnd } from "../../assets/js/date.js";
import { curMonthStart, curMonthEnd } from "../../assets/js/date.js";
import { curYearStart, curYearEnd } from "../../assets/js/date.js";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResultGoal = [];
  let findResultReal = [];
  let finalResult = [];

  // dateStart, dateEnd 정의
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // promise 사용하여 병렬 처리
  [findResultGoal, findResultReal] = await Promise.all([
    repository.barToday.listGoal(
      user_id_param, dateStart, dateEnd
    ),
    repository.barToday.listReal(
      user_id_param, dateStart, dateEnd
    )
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResult = findResultGoal?.map((item) => [
    {
      name: String("bedTime"),
      date: String(dateStart),
      goal: String(timeToDecimal(item?.sleep_goal_bedTime) || "0"),
      real: String(timeToDecimal(findResultReal?.[0]?.sleep_section?.[0]?.sleep_bedTime) || "0")
    },
    {
      name: String("wakeTime"),
      date: String(dateStart),
      goal: String(timeToDecimal(item?.sleep_goal_wakeTime) || "0"),
      real: String(timeToDecimal(findResultReal?.[0]?.sleep_section?.[0]?.sleep_wakeTime) || "0")
    },
    {
      name: String("sleepTime"),
      date: String(dateStart),
      goal: String(timeToDecimal(item?.sleep_goal_sleepTime) || "0"),
      real: String(timeToDecimal(findResultReal?.[0]?.sleep_section?.[0]?.sleep_sleepTime) || "0")
    }
  ]).flat();

  return finalResult;
};

// 2-1. chart (pie - today) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieToday = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  // dateStart, dateEnd 정의
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // promise 사용하여 병렬 처리
  findResult = await repository.pieToday.listReal(
    user_id_param, dateStart, dateEnd
  );

  // sum, count 설정
  findResult.forEach((item) => {
    sumBedTime += Number(timeToDecimal(item?.sleep_section?.[0]?.sleep_bedTime));
    sumWakeTime += Number(timeToDecimal(item?.sleep_section?.[0]?.sleep_wakeTime));
    sumSleepTime += Number(timeToDecimal(item?.sleep_section?.[0]?.sleep_sleepTime));
    countRecords++;
  });

  // totalSleep 계산
  totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

  // finalResult 배열에 결과 저장
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
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  findResult = await repository.pieWeek.listReal(
    user_id_param, dateStart, dateEnd
  );

  // sum, count 설정
  findResult.forEach((data, index) => {
    sumBedTime += Number(timeToDecimal(data.sleep_section[0]?.sleep_bedTime));
    sumWakeTime += Number(timeToDecimal(data.sleep_section[0]?.sleep_wakeTime));
    sumSleepTime += Number(timeToDecimal(data.sleep_section[0]?.sleep_sleepTime));
    countRecords++;
  });

  // totalSleep 계산
  totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

  // finalResult 배열에 결과 저장
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
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  findResult = await repository.pieMonth.listReal(
    user_id_param, dateStart, dateEnd
  );

  // sum, count 설정
  findResult.forEach((data, index) => {
    sumBedTime += Number(timeToDecimal(data.sleep_section[0]?.sleep_bedTime));
    sumWakeTime += Number(timeToDecimal(data.sleep_section[0]?.sleep_wakeTime));
    sumSleepTime += Number(timeToDecimal(data.sleep_section[0]?.sleep_sleepTime));
    countRecords++;
  });

  // totalSleep 계산
  totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

  // finalResult 배열에 결과 저장
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
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  findResult = await repository.lineWeek.listReal(
    user_id_param, dateStart, dateEnd
  );

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curWeekStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndex = findResult?.findIndex((item) => (
      item.sleep_dateStart === targetDate
    ));

    finalResult.push({
      name: String(data),
      date: String(date[index]),
      bedTime:
        findIndex !== -1
        ? String(timeToDecimal(findResult[findIndex]?.sleep_section[0]?.sleep_bedTime))
        : "0",
      wakeTime:
        findIndex !== -1
        ? String(timeToDecimal(findResult[findIndex]?.sleep_section[0]?.sleep_wakeTime))
        : "0",
      sleepTime:
        findIndex !== -1
        ? String(timeToDecimal(findResult[findIndex]?.sleep_section[0]?.sleep_sleepTime))
        : "0",
    });
  });

  return finalResult;
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => `${i + 1}`);

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  findResult = await repository.lineMonth.listReal(
    user_id_param, dateStart, dateEnd
  );

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curMonthStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndex = findResult?.findIndex((item) => (
      item.sleep_dateStart === targetDate
    ));

    finalResult.push({
      name: String(data),
      date: String(date[index]),
      bedTime:
        findIndex !== -1
        ? String(timeToDecimal(findResult[findIndex]?.sleep_section[0]?.sleep_bedTime))
        : "0",
      wakeTime:
        findIndex !== -1
        ? String(timeToDecimal(findResult[findIndex]?.sleep_section[0]?.sleep_wakeTime))
        : "0",
      sleepTime:
        findIndex !== -1
        ? String(timeToDecimal(findResult[findIndex]?.sleep_section[0]?.sleep_sleepTime))
        : "0",
    });
  });

  return finalResult;
};


// 4-1. chart (avg - week) ------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumBedTime = Array(5).fill(0);
  let sumWakeTime = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  // weekStartDate 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) =>
    moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks')
  );

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => `week${i + 1}`);

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = weekStartDate[i].format("MM-DD");
    const endOfWeek = weekStartDate[i].clone().endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  // promise 사용하여 병렬 처리
  const parallelResult = await Promise.all(
    weekStartDate.map(async (startDate, i) => {
      const dateStart = startDate.format("YYYY-MM-DD");
      const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

      findResult = await repository.avgWeek.listReal(
        user_id_param, dateStart, dateEnd
      );

      return {
        findResult,
        index: i
      };
    })
  );

  // sum, count 설정
  parallelResult.forEach(({ findResult, index }) => {
    findResult.forEach((item) => {
      sumBedTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_bedTime) || "0");
      sumWakeTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_wakeTime) || "0");
      sumSleepTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_sleepTime) || "0");
      countRecords[index]++;
    });
  });

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    finalResult.push({
      name: String(data),
      date: String(date[index]),
      bedTime:
        countRecords[index] > 0
        ? String((sumBedTime[index] / countRecords[index]).toFixed(1))
        : "0",
      wakeTime:
        countRecords[index] > 0
        ? String((sumWakeTime[index] / countRecords[index]).toFixed(1))
        : "0",
      sleepTime:
        countRecords[index] > 0
        ? String((sumSleepTime[index] / countRecords[index]).toFixed(1))
        : "0",
    });
  });

  return finalResult;
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (
  user_id_param, DATE_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumBedTime = Array(12).fill(0);
  let sumWakeTime = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  // monthStartDate 정의
  const monthStartDate = Array.from({ length: 12 }, (_, i) =>
    moment(curYearStart).tz("Asia/Seoul").startOf("year").add(i, 'months')
  );

  // ex. 00 월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = curYearStart.clone().add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = curYearStart.clone().add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  // promise 사용하여 병렬 처리
  const parallelResult = await Promise.all(
    monthStartDate.map(async (startDate, i) => {
      const dateStart = startDate.format("YYYY-MM-DD");
      const dateEnd = startDate.clone().endOf('month').format("YYYY-MM-DD");

      findResult = await repository.avgMonth.listReal(
        user_id_param, dateStart, dateEnd
      );

      return {
        findResult,
        index: i
      };
    })
  );

  // sum, count 설정
  parallelResult.forEach(({ findResult, index }) => {
    findResult.forEach((item) => {
      sumBedTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_bedTime) || "0");
      sumWakeTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_wakeTime) || "0");
      sumSleepTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_sleepTime) || "0");
      countRecords[index]++;
    });
  });

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    finalResult.push({
      name: String(data),
      date: String(date[index]),
      bedTime:
        countRecords[index] > 0
        ? String((sumBedTime[index] / countRecords[index]).toFixed(1))
        : "0",
      wakeTime:
        countRecords[index] > 0
        ? String((sumWakeTime[index] / countRecords[index]).toFixed(1))
        : "0",
      sleepTime:
        countRecords[index] > 0
        ? String((sumSleepTime[index] / countRecords[index]).toFixed(1))
        : "0",
    });
  });

  return finalResult;
};