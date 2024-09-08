// exerciseChartService.ts

import * as repository from "@repositories/exercise/exerciseChartRepository";
import { timeToDecimal } from "@scripts/utils";
import moment from "moment-timezone";

// 1-1. chart (bar - Today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

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
    finalResult = findResultGoal?.map((item: any) => ({
      name: String("weight"),
      date: String(dateStart),
      goal: String(item.exercise_goal_weight|| "0"),
      real: "0"
    }));
    statusResult = "success";
  }
  catch (err) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 1-2. chart (bar - week) -------------------------------------------------------------------------
export const barWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = "";

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;
  const weekStartFmt = DATE_param.weekStartFmt;

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return moment(weekStartFmt).clone().add(i, 'days').format("MM-DD");
  });

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

    // name 배열 순회하며 결과 저장
    name.forEach((data, index) => {
      const targetDay = moment(weekStartFmt).clone().add(index, 'days').format("YYYY-MM-DD");

      const findIndexGoal = findResultGoal?.findIndex((item) => (
        item.exercise_goal_dateStart === targetDay
      ));
      const findIndexReal = findResultReal?.findIndex((item) => (
        item.exercise_dateStart === targetDay
      ));

      finalResult.push({
        name: String(data),
        date: String(date[index]),
        goal:
          findIndexGoal !== -1
          ? String(findResultGoal[findIndexGoal]?.exercise_goal_weight)
          : "0",
        real:
          findIndexReal !== -1
          ? String(findResultReal[findIndexReal]?.exercise_total_weight)
          : "0"
      });
    });
    statusResult = "success";
  }
  catch (err) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 1-3. chart (bar - month) ------------------------------------------------------------------------
export const barMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResult: any[] = [];
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
  const date = Array.from({ length:  moment(monthEndFmt).date() }, (_, i) => (
    moment(monthStartFmt).clone().add(i, 'days').format("MM-DD")
  ));

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

    // name 배열 순회하며 결과 저장
    name.forEach((data, index) => {
      const targetDay = moment(monthStartFmt).clone().add(index, 'days').format("YYYY-MM-DD");

      const findIndexGoal = findResultGoal?.findIndex((item) => (
        item.exercise_goal_dateStart === targetDay
      ));
      const findIndexReal = findResultReal?.findIndex((item) => (
        item.exercise_dateStart === targetDay
      ));

      finalResult.push({
        name: String(data),
        date: String(date[index]),
        goal:
          findIndexGoal !== -1
          ? String(findResultGoal[findIndexGoal]?.exercise_goal_weight)
          : "0",
        real:
          findIndexReal !== -1
          ? String(findResultReal[findIndexReal]?.exercise_total_weight)
          : "0"
      });
    });
    statusResult = "success";
  }
  catch (err) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-1. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultPart, findResultTitle] = await Promise.all([
      repository.piePart(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieTitle(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResultPart = findResultPart?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));
    finalResultTitle = findResultTitle?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));
    statusResult = "success";
  }
  catch (err) {
    finalResultPart = [];
    finalResultTitle = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: {
      part: finalResultPart,
      title: finalResultTitle,
    }
  };
};

// 2-2. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultPart, findResultTitle] = await Promise.all([
      repository.piePart(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieTitle(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResultPart = findResultPart?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));
    finalResultTitle = findResultTitle?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));
    statusResult = "success";
  }
  catch (err) {
    finalResultPart = [];
    finalResultTitle = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: {
      part: finalResultPart,
      title: finalResultTitle,
    }
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
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
    [findResultVolume, findResultCardio] = await Promise.all([
      repository.lineVolume(
        user_id_param, dateStart, dateEnd
      ),
      repository.lineCardio(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // name 배열 순회하며 결과 저장
    name.forEach((data, index) => {
      const targetDay = moment(weekStartFmt).clone().add(index, 'days').format("YYYY-MM-DD");

      const findIndexVolume = findResultVolume?.findIndex((item) => (
        item.exercise_dateStart === targetDay
      ));
      const findIndexCardio = findResultCardio?.findIndex((item) => (
        item.exercise_dateStart === targetDay
      ));

      finalResultVolume.push({
        name: String(data),
        date: String(date[index]),
        volume:
          findIndexVolume !== -1
          ? String(findResultVolume[findIndexVolume]?.exercise_total_volume)
          : "0"
      });
      finalResultCardio.push({
        name: String(data),
        date: String(date[index]),
        cardio:
          findIndexCardio !== -1
          ? String(timeToDecimal(findResultCardio[findIndexCardio]?.exercise_total_cardio))
          : "0"
      });
    });
    statusResult = "success";
  }
  catch (err) {
    finalResultVolume = [];
    finalResultCardio = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: {
      volume: finalResultVolume,
      cardio: finalResultCardio
    }
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
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
    [findResultVolume, findResultCardio] = await Promise.all([
      repository.lineVolume(
        user_id_param, dateStart, dateEnd
      ),
      repository.lineCardio(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // name 배열 순회하며 결과 저장
    name.forEach((data, index) => {
      const targetDay = monthStartFmt.clone().add(index, 'days').format("YYYY-MM-DD");

      const findIndexVolume = findResultVolume?.findIndex((item) => (
        item.exercise_dateStart === targetDay
      ));
      const findIndexCardio = findResultCardio?.findIndex((item) => (
        item.exercise_dateStart === targetDay
      ));

      finalResultVolume.push({
        name: String(data),
        date: String(date[index]),
        volume:
          findIndexVolume !== -1
          ? String(findResultVolume[findIndexVolume]?.exercise_total_volume)
          : "0"
      });
      finalResultCardio.push({
        name: String(data),
        date: String(date[index]),
        cardio:
          findIndexCardio !== -1
          ? String(timeToDecimal(findResultCardio[findIndexCardio]?.exercise_total_cardio))
          : "0"
      });
    });
    statusResult = "success";
  }
  catch (err) {
    finalResultVolume = [];
    finalResultCardio = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: {
      volume: finalResultVolume,
      cardio: finalResultCardio,
    }
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumVolume = Array(5).fill(0);
  let sumCardio = Array(5).fill(0);
  let countRecordsVolume = Array(5).fill(0);
  let countRecordsCardio = Array(5).fill(0);

  // date 변수 정의
  const monthStartFmt = DATE_param.monthStartFmt;

  // weekStartDate 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) => (
    moment(monthStartFmt).clone().startOf("month").add(i, 'weeks')
  ));

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => (
    `week${i + 1}`
  ));

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = weekStartDate[i].format("MM-DD");
    const endOfWeek = weekStartDate[i].clone().endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      weekStartDate.map(async (startDate, i) => {
        const dateStart = startDate.format("YYYY-MM-DD");
        const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

        [findResultVolume, findResultCardio] = await Promise.all([
          repository.avgVolume(
            user_id_param, dateStart, dateEnd
          ),
          repository.avgCardio(
            user_id_param, dateStart, dateEnd
          ),
        ]);

        return {
          findResultVolume,
          findResultCardio,
          index: i
        };
      })
    );

    // sum, count 설정
    parallelResult.forEach(({findResultVolume, findResultCardio, index}) => {
      findResultVolume.forEach((item) => {
        sumVolume[index] += Number(item.exercise_total_volume || "0");
        countRecordsVolume[index]++;
      });
      findResultCardio.forEach((item) => {
        sumCardio[index] += Number(timeToDecimal(item.exercise_total_cardio) || "0");
        countRecordsCardio[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data, index) => {
      finalResultVolume.push({
        name: String(data),
        date: String(date[index]),
        volume:
          countRecordsVolume[index] > 0
          ? String((sumVolume[index] / countRecordsVolume[index]).toFixed(1))
          : "0",
      });
      finalResultCardio.push({
        name: String(data),
        date: String(date[index]),
        cardio:
          countRecordsCardio[index] > 0
          ? String(sumCardio[index] / countRecordsCardio[index])
          : "0",
      });
    });
    statusResult = "success";
  }
  catch (err) {
    finalResultVolume = [];
    finalResultCardio = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: {
      volume: finalResultVolume,
      cardio: finalResultCardio
    }
  };
};

// 4-2. chart (avg - month) ---------------------------------------------------------------------
export const avgMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // result 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumVolume = Array(12).fill(0);
  let sumCardio = Array(12).fill(0);
  let countRecordsVolume = Array(12).fill(0);
  let countRecordsCardio = Array(12).fill(0);

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

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = moment(yearStartFmt).add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = moment(yearStartFmt).add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      monthStartDate.map(async (startDate, i) => {
        const dateStart = startDate.format("YYYY-MM-DD");
        const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

        [findResultVolume, findResultCardio] = await Promise.all([
          repository.avgVolume(
            user_id_param, dateStart, dateEnd
          ),
          repository.avgCardio(
            user_id_param, dateStart, dateEnd
          ),
        ]);

        return {
          findResultVolume,
          findResultCardio,
          index: i
        };
      })
    );

    // sum, count 설정
    parallelResult.forEach(({findResultVolume, findResultCardio, index}) => {
      findResultVolume.forEach((item) => {
        sumVolume[index] += Number(item.exercise_total_volume || "0");
        countRecordsVolume[index]++;
      });
      findResultCardio.forEach((item) => {
        sumCardio[index] += Number(timeToDecimal(item.exercise_total_cardio) || "0");
        countRecordsCardio[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data, index) => {
      finalResultVolume.push({
        name: String(data),
        date: String(date[index]),
        volume:
          countRecordsVolume[index] > 0
          ? String((sumVolume[index] / countRecordsVolume[index]).toFixed(1))
          : "0",
      });
      finalResultCardio.push({
        name: String(data),
        date: String(date[index]),
        cardio:
          countRecordsCardio[index] > 0
          ? String(sumCardio[index] / countRecordsCardio[index])
          : "0",
      });
    });
    statusResult = "success";
  }
  catch (err) {
    finalResultVolume = [];
    finalResultCardio = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: {
      volume: finalResultVolume,
      cardio: finalResultCardio
    }
  };
};