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
    value: item.count
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: item._id,
    value: item.count
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
    value: item.count
  }));
  // title
  finalResultTitle = findResultTitle?.map((item) => ({
    name: item._id,
    value: item.count
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
    const findItemVolume = findResultVolume?.findIndex((item) => (
      new Date(item.exercise_startDt).getDate() === index
    ));
    const findItemCardio = findResultCardio?.findIndex((item) => (
      new Date(item.exercise_startDt).getDate() === index
    ));
    finalResultVolume.push({
      name: item,
      볼륨: findItemVolume !== -1 ? intFormat(findResultVolume[findItemVolume].exercise_total_volume) : 0
    });
    finalResultCardio.push({
      name: item,
      시간: findItemCardio !== -1 ? intFormat(findResultCardio[findItemCardio].exercise_total_cardio) : 0
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
      볼륨: findIndexVolume !== -1 ? intFormat(findResultVolume[findIndexVolume].exercise_total_volume) : 0
    });
    finalResultCardio.push({
      name: data,
      시간: findIndexCardio !== -1 ? intFormat(findResultCardio[findIndexCardio].exercise_total_cardio) : 0
    });
  });

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: 5 }, (_, i) => {
    const weekStart = curWeekStart.clone().add(i * 7, 'days').format("MM-DD");
    const weekEnd = curWeekStart.clone().add((i + 1) * 7 - 1, 'days').format("MM-DD");
    return `${i + 1}주차 (${weekStart} ~ ${weekEnd})`;
  });

  let sumExerciseVolume = Array(5).fill(0);
  let sumExerciseCardio = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultVolume = [];
  let findResultCardio = [];
  let finalResultVolume = [];
  let finalResultCardio = [];

  // volume
  findResultVolume = await repository.avgWeek.listVolume(
    customer_id_param, startDt, endDt
  );
  // cardio
  findResultCardio = await repository.avgWeek.listCardio(
    customer_id_param, startDt, endDt
  );

  // volume
  findResultVolume.forEach((item) => {
    const weekNum = Math.floor(new Date(item.exercise_startDt).getDate() / 7);
    sumExerciseVolume[weekNum] += intFormat(item.exercise_total_volume);
    countRecords[weekNum]++;
  });
  // cardio
  findResultCardio.forEach((item) => {
    const weekNum = Math.floor(new Date(item.exercise_startDt).getDate() / 7);
    sumExerciseCardio[weekNum] += intFormat(item.exercise_total_cardio);
    countRecords[weekNum]++;
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

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

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
  findResultVolume = await repository.avgMonth.listVolume(
    customer_id_param, startDt, endDt
  );
  // cardio
  findResultCardio = await repository.avgMonth.listCardio(
    customer_id_param, startDt, endDt
  );

  // volume
  findResultVolume.forEach((item) => {
    const monthNum = new Date(item.exercise_startDt).getMonth();
    sumExerciseVolume[monthNum] += intFormat(item.exercise_total_volume);
    countRecords[monthNum]++;
  });
  // cardio
  findResultCardio.forEach((item) => {
    const monthNum = new Date(item.exercise_startDt).getMonth();
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