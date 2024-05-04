// exerciseDashService.js

import * as repository from "../repository/exerciseDashRepository.js";
import {intFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/js/date.js";

// 1-1. dash (scatter - Today) -------------------------------------------------------------------->
export const scatterToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.scatterToday.listPlan(
    customer_id_param, startDt, endDt
  );
  findReal = await repository.scatterToday.listReal(
    customer_id_param, startDt, endDt
  );

  finalResult = [
    {
      name: "체중",
      목표: intFormat(findPlan?.[0]?.exercise_plan_weight),
      실제: intFormat(findReal?.[0]?.exercise_body_weight)
    }
  ];

  return finalResult;
};

// 1-2. dash (scatter - week) --------------------------------------------------------------------->
export const scatterWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.scatterWeek.listPlan(
    customer_id_param, startDt, endDt
  );
  findReal = await repository.scatterWeek.listReal(
    customer_id_param, startDt, endDt
  );

  finalResult = [
    {
      name: "체중",
      목표: intFormat(findPlan?.[0]?.exercise_plan_weight),
      실제: intFormat(findReal?.[0]?.exercise_body_weight)
    }
  ];

  return finalResult;
};

// 1-3. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.scatterMonth.listPlan(
    customer_id_param, startDt, endDt
  );
  findReal = await repository.scatterMonth.listReal(
    customer_id_param, startDt, endDt
  );

  finalResult = [
    {
      name: "체중",
      목표: intFormat(findPlan?.[0]?.exercise_plan_weight),
      실제: intFormat(findReal?.[0]?.exercise_body_weight)
    }
  ];

  return finalResult;
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  let findResultPart = [];
  let findResultTitle = [];
  let finalResultPart = [];
  let finalResultTitle = [];

  // part
  findResultPart = await repository.pieWeek.listPart(
    customer_id_param, startDt, endDt
  );
  // title
  findResultTitle = await repository.pieWeek.listTitle(
    customer_id_param, startDt, endDt
  );

  // part
  finalResultPart = findResultPart?.map((item) => ({
    name: item._id,
    value: intFormat(item.count)
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: item._id,
    value: intFormat(item.count)
  }));

  return {
    part: finalResultPart,
    title: finalResultTitle
  };
};

// 2-2. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  let findResultPart = [];
  let findResultTitle = [];
  let finalResultPart = [];
  let finalResultTitle = [];

  // part
  findResultPart = await repository.pieMonth.listPart(
    customer_id_param, startDt, endDt
  );
  // title
  findResultTitle = await repository.pieMonth.listTitle(
    customer_id_param, startDt, endDt
  );

  // part
  finalResultPart = findResultPart?.map((item) => ({
    name: item._id,
    value: intFormat(item.count)
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: item._id,
    value: intFormat(item.count)
  }));

  return {
    part: finalResultPart,
    title: finalResultTitle
  };
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

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.lineWeek.listVolume(
    customer_id_param, startDt, endDt
  );
  // cardio
  findResultCardio = await repository.lineWeek.listCardio(
    customer_id_param, startDt, endDt
  );

  data.forEach((item, index) => {
    const findIndexVolume = findResultVolume?.findIndex((item) => (
      new Date(item.exercise_startDt).getDate() === index
    ));
    const findIndexCardio = findResultCardio?.findIndex((item) => (
      new Date(item.exercise_startDt).getDate() === index
    ));
    finalResultVolume.push({
      name: item,
      볼륨: findIndexVolume !== -1 ? intFormat(findResultVolume[findIndexVolume]?.exercise_total_volume) : 0
    });
    finalResultCardio.push({
      name: item,
      시간: findIndexCardio !== -1 ? intFormat(findResultCardio[findIndexCardio]?.exercise_total_cardio) : 0
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
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

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.lineMonth.listVolume(
    customer_id_param, startDt, endDt
  );
  // cardio
  findResultCardio = await repository.lineMonth.listCardio(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndexVolume = findResultVolume.findIndex((item) => (
      new Date(item.exercise_startDt).getDate() === index + 1
    ));
    const findIndexCardio = findResultCardio.findIndex((item) => (
      new Date(item.exercise_startDt).getDate() === index + 1
    ));

    finalResultVolume.push({
      name: data,
      볼륨: findIndexVolume !== -1 ? intFormat(findResultVolume[findIndexVolume]?.exercise_total_volume) : 0
    });
    finalResultCardio.push({
      name: data,
      시간: findIndexCardio !== -1 ? intFormat(findResultCardio[findIndexCardio]?.exercise_total_cardio) : 0
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

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

  let sumExerciseVolume = Array(5).fill(0);
  let sumExerciseCardio = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.avgMonth.listVolume(
    customer_id_param, startDt, endDt
  );
  // cardio
  findResultCardio = await repository.avgMonth.listCardio(
    customer_id_param, startDt, endDt
  );

  // volume
  findResultVolume.forEach((item) => {
    const exerciseDate = new Date(item.exercise_startDt);
    const diffTime = Math.abs(exerciseDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumExerciseVolume[weekNum] += intFormat(item.exercise_total_volume);
      countRecords[weekNum]++;
    }
  });

  // cardio
  findResultCardio.forEach((item) => {
    const exerciseDate = new Date(item.exercise_startDt);
    const diffTime = Math.abs(exerciseDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumExerciseCardio[weekNum] += intFormat(item.exercise_total_cardio);
      countRecords[weekNum]++;
    }
  });

  data.forEach((data, index) => {
    finalResultVolume.push({
      name: data,
      볼륨: intFormat(sumExerciseVolume[index] / countRecords[index])
    });
    finalResultCardio.push({
      name: data,
      시간: intFormat(sumExerciseCardio[index] / countRecords[index])
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
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

  let sumExerciseVolume = Array(12).fill(0);
  let sumExerciseCardio = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.avgYear.listVolume(
    customer_id_param, startDt, endDt
  );
  // cardio
  findResultCardio = await repository.avgYear.listCardio(
    customer_id_param, startDt, endDt
  );

  // volume
  findResultVolume.forEach((item) => {
    const exerciseDate = new Date(item.exercise_startDt);
    const monthNum = exerciseDate.getMonth();
    sumExerciseVolume[monthNum] += intFormat(item.exercise_total_volume);
    countRecords[monthNum]++;
  });
  // cardio
  findResultCardio.forEach((item) => {
    const exerciseDate = new Date(item.exercise_startDt);
    const monthNum = exerciseDate.getMonth();
    sumExerciseCardio[monthNum] += intFormat(item.exercise_total_cardio);
    countRecords[monthNum]++;
  });

  data.forEach((data, index) => {
    finalResultVolume.push({
      name: data,
      볼륨: intFormat(sumExerciseVolume[index] / countRecords[index])
    });
    finalResultCardio.push({
      name: data,
      시간: intFormat(sumExerciseCardio[index] / countRecords[index])
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};