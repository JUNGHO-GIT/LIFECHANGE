// sleepChartService.ts

import * as repository from "@repositories/sleep/sleepChartRepository";
import moment from "moment-timezone";
import { timeToDecimal } from "@assets/scripts/utils";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultGoal:any[] = [];
  let findResultReal:any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultReal] = await Promise.all([
      repository.barGoal(
        user_id_param, dateStart, dateEnd
      ),
      repository.barReal(
        user_id_param, dateStart, dateEnd
      )
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResult = findResultGoal?.map((item: any) => [
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.pieAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // sum, count 설정
    findResult.forEach((data: any, index: number) => {
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.pieAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // sum, count 설정
    findResult.forEach((data: any, _index: number) => {
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-4. chart (pie - year) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieYear = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumBedTime = 0;
  let sumWakeTime = 0;
  let sumSleepTime = 0;
  let countRecords = 0;
  let totalSleep = 0;

  // date 변수 정의
  const dateStart = DATE_param.yearStartFmt;
  const dateEnd = DATE_param.yearEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.pieAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // sum, count 설정
    findResult.forEach((data: any, _index: number) => {
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;
  const weekStartFmt = DATE_param.weekStartFmt;

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return moment(weekStartFmt).clone().add(i, 'days').format("MM-DD");
  });

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.lineAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay = moment(weekStartFmt).clone().add(index, 'days').format("YYYY/MM/DD");

      const findIndex = findResult?.findIndex((item: any) => (
        item.sleep_dateStart === targetDay
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;
  const monthStartFmt = DATE_param.monthStartFmt;
  const monthEndFmt = DATE_param.monthEndFmt;

  // ex. 00일
  const name = Array.from({ length: moment(monthEndFmt).date() }, (_, i) => (
    `${i + 1}`
  ));

  // ex. 00-00
  const date = Array.from({ length: moment(monthEndFmt).date() }, (_, i) => (
    moment(monthStartFmt).clone().add(i, 'days').format("MM-DD")
  ));

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.lineAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay = moment(monthStartFmt).clone().add(index, 'days').format("YYYY/MM/DD");

      const findIndex = findResult?.findIndex((item: any) => (
        item.sleep_dateStart === targetDay
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 4-1. chart (avg - week) ------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumBedTime = Array(5).fill(0);
  let sumWakeTime = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  // date 변수 정의
  const monthStartFmt = DATE_param.monthStartFmt;

  // weekStartDate 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) => (
    moment(monthStartFmt).startOf("month").add(i, 'weeks')
  ));

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => (
    `week${i + 1}`
  ));

  // ex. 00-00 - 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = moment(monthStartFmt).add(i, 'weeks').startOf('isoWeek').format("MM-DD");
    const endOfWeek = moment(monthStartFmt).add(i, 'weeks').endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} - ${endOfWeek}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      weekStartDate.map(async (startDate, i) => {
        const dateStart = startDate.clone().startOf('isoWeek').format("YYYY/MM/DD");
        const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY/MM/DD");

        [findResult] = await Promise.all([
          repository.avgAll(
            user_id_param, dateStart, dateEnd
          )
        ]);

        return {
          findResult,
          index: i
        };
      })
    );

    // sum, count 설정
    parallelResult.forEach(({ findResult, index }) => {
      findResult.forEach((item: any) => {
        sumBedTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_bedTime) || "0");
        sumWakeTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_wakeTime) || "0");
        sumSleepTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_sleepTime) || "0");
        countRecords[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumBedTime = Array(12).fill(0);
  let sumWakeTime = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  // date 변수 정의
  const yearStartFmt = DATE_param.yearStartFmt;

  // monthStartDate 정의
  const monthStartDate = Array.from({ length: 12 }, (_, i) => (
    moment(yearStartFmt).startOf("year").add(i, 'months')
  ));

  // ex. 00 월
  const name = Array.from({ length: 12 }, (_, i) => (
    `month${i + 1}`
  ));

  // ex. 00-00 - 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = moment(yearStartFmt).add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = moment(yearStartFmt).add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} - ${endOfMonth}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      monthStartDate.map(async (startDate, i) => {
        const dateStart = startDate.clone().startOf('month').format("YYYY/MM/DD");
        const dateEnd = startDate.clone().endOf('month').format("YYYY/MM/DD");

        [findResult] = await Promise.all([
          repository.avgAll(
            user_id_param, dateStart, dateEnd
          )
        ]);

        return {
          findResult,
          index: i
        };
      })
    );

    // sum, count 설정
    parallelResult.forEach(({ findResult, index }) => {
      findResult.forEach((item: any) => {
        sumBedTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_bedTime) || "0");
        sumWakeTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_wakeTime) || "0");
        sumSleepTime[index] += Number(timeToDecimal(item.sleep_section[0]?.sleep_sleepTime) || "0");
        countRecords[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};