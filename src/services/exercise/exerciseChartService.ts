// exerciseChartService.ts

import * as repository from "@repositories/exercise/exerciseChartRepository";
import moment from "moment-timezone";
import { timeToDecimal, decimalToTime } from "@assets/scripts/utils";
import { curWeekStart, curWeekEnd } from "@assets/scripts/date";
import { curMonthStart, curMonthEnd } from "@assets/scripts/date";
import { curYearStart, curYearEnd } from "@assets/scripts/date";

// 1-1. chart (bar - Today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResult: any[] = [];

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

  // findResultGoal, findResultReal 배열을 순회하며 결과 저장
  finalResult = findResultGoal?.map((item: any) => ({
    name: String("weight"),
    date: String(dateStart),
    goal: String(item.exercise_goal_weight|| "0"),
    real: "0"
  }));

  return finalResult;
};

// 1-2. chart (bar - week) -------------------------------------------------------------------------
export const barWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResult: any[] = [];

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
  [findResultGoal, findResultReal] = await Promise.all([
    repository.barWeek.listGoal(
      user_id_param, dateStart, dateEnd
    ),
    repository.barWeek.listReal(
      user_id_param, dateStart, dateEnd
    )
  ]);

  // name 배열 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curWeekStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndexGoal = findResultGoal?.findIndex((item) => (
      item.exercise_goal_dateStart === targetDate
    ));
    const findIndexReal = findResultReal?.findIndex((item) => (
      item.exercise_dateStart === targetDate
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

  return finalResult;
};

// 1-3. chart (bar - month) ------------------------------------------------------------------------
export const barMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal: any[] = [];
  let finalResult: any[] = [];

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
  [findResultGoal, findResultReal] = await Promise.all([
    repository.barMonth.listGoal(
      user_id_param, dateStart, dateEnd
    ),
    repository.barMonth.listReal(
      user_id_param, dateStart, dateEnd
    )
  ]);

  // name 배열 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curMonthStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndexGoal = findResultGoal?.findIndex((item) => (
      item.exercise_goal_dateStart === targetDate
    ));
    const findIndexReal = findResultReal?.findIndex((item) => (
      item.exercise_dateStart === targetDate
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

  return finalResult;
};

// 2-1. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultPart, findResultTitle] = await Promise.all([
    repository.pieWeek.listPart(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieWeek.listTitle(
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

  return {
    part: finalResultPart,
    title: finalResultTitle,
  };
};

// 2-2. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];

  // dateStart, dateEnd 정의
  const dateStart
    = moment(DATE_param.dateStart).tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD");
  const dateEnd
    = moment(DATE_param.dateEnd).tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultPart, findResultTitle] = await Promise.all([
    repository.pieMonth.listPart(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieMonth.listTitle(
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

  return {
    part: finalResultPart,
    title: finalResultTitle,
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];

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
  [findResultVolume, findResultCardio] = await Promise.all([
    repository.lineWeek.listVolume(
      user_id_param, dateStart, dateEnd
    ),
    repository.lineWeek.listCardio(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // name 배열 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curWeekStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndexVolume = findResultVolume?.findIndex((item) => (
      item.exercise_dateStart === targetDate
    ));
    const findIndexCardio = findResultCardio?.findIndex((item) => (
      item.exercise_dateStart === targetDate
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

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];

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
  [findResultVolume, findResultCardio] = await Promise.all([
    repository.lineMonth.listVolume(
      user_id_param, dateStart, dateEnd
    ),
    repository.lineMonth.listCardio(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // name 배열 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curMonthStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndexVolume = findResultVolume?.findIndex((item) => (
      item.exercise_dateStart === targetDate
    ));
    const findIndexCardio = findResultCardio?.findIndex((item) => (
      item.exercise_dateStart === targetDate
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

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];

  // sum, count 변수 선언
  let sumVolume = Array(5).fill(0);
  let sumCardio = Array(5).fill(0);
  let countRecordsVolume = Array(5).fill(0);
  let countRecordsCardio = Array(5).fill(0);

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

      [findResultVolume, findResultCardio] = await Promise.all([
        repository.avgWeek.listVolume(
          user_id_param, dateStart, dateEnd
        ),
        repository.avgWeek.listCardio(
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

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-2. chart (avg - month) ---------------------------------------------------------------------
export const avgMonth = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];

  // sum, count 변수 선언
  let sumVolume = Array(12).fill(0);
  let sumCardio = Array(12).fill(0);
  let countRecordsVolume = Array(12).fill(0);
  let countRecordsCardio = Array(12).fill(0);

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
      const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

      [findResultVolume, findResultCardio] = await Promise.all([
        repository.avgMonth.listVolume(
          user_id_param, dateStart, dateEnd
        ),
        repository.avgMonth.listCardio(
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

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};