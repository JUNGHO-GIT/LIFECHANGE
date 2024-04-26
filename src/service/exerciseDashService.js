// exerciseDashService.js

import * as repository from "../repository/exerciseDashRepository.js";
import {intFormat, timeFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/common/date.js";

// 1-1. dash (scatter - Today) -------------------------------------------------------------------->
export const scatterToday = async (
  customer_id_param
) => {

  const data = {
    "체중": {
      plan: "exercise_plan_weight",
      real: "exercise_body_weight"
    }
  };

  let finalResult = [];

  const findPlan = await repository.scatterToday.findPlan(
    customer_id_param, koreanDate, koreanDate
  );

  const findReal = await repository.scatterToday.findReal(
    customer_id_param, koreanDate, koreanDate
  );

  for (let key in data) {
    finalResult.push({
      name: koreanDate,
      목표: intFormat(findPlan?.[0]?.[data[key].plan]),
      실제: intFormat(findReal?.[0]?.[data[key].real])
    });
  };

  return finalResult;
};

// 1-2. dash (scatter - week) --------------------------------------------------------------------->
export const scatterWeek = async (
  customer_id_param
) => {

  const data = {
    "체중": {
      plan: "exercise_plan_weight",
      real: "exercise_body_weight"
    }
  };

  let finalResult = [];

  for (
    let day = curWeekStart.clone();
    day.isBefore(curWeekEnd);
    day.add(1, "days")
  ) {

    const findPlan = await repository.scatterWeek.findPlan(
      customer_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    const findReal = await repository.scatterWeek.findReal(
      customer_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    for (let key in data) {
      finalResult.push({
        name: day.format("MM/DD"),
        목표: intFormat(findPlan?.[0]?.[data[key].plan]),
        실제: intFormat(findReal?.[0]?.[data[key].real])
      });
    };
  };

  return finalResult;
};

// 1-3. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = async (
  customer_id_param
) => {

  const data = {
    "체중": {
      plan: "exercise_plan_weight",
      real: "exercise_body_weight"
    }
  };

  let finalResult = [];

  for (
    let day = curMonthStart.clone();
    day.isBefore(curMonthEnd);
    day.add(1, "days")
  ) {

    const findPlan = await  repository.scatterMonth.findPlan(
      customer_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    const findReal = await repository.scatterMonth.findReal(
      customer_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    for (let key in data) {
      finalResult.push({
        name: day.format("MM/DD"),
        목표: intFormat(findPlan?.[0]?.[data[key].plan]),
        실제: intFormat(findReal?.[0]?.[data[key].real])
      });
    };
  };

  return finalResult;
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  customer_id_param
) => {

  // top part
  let finalResultPart = [];

  // top title
  let finalResultTitle = [];

  const findResultPart = await repository.pieWeek.findPart(
    customer_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
  );
  const findResultTitle = await repository.pieWeek.findTitle(
    customer_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
  );

  for (let i = 0; i < findResultPart.length; i++) {
    finalResultPart.push({
      name: findResultPart[i]._id,
      value: findResultPart[i].count
    });
  }

  for (let i = 0; i < findResultTitle.length; i++) {
    finalResultTitle.push({
      name: findResultTitle[i]._id,
      value: findResultTitle[i].count
    });
  }

  return {
    part: finalResultPart,
    title: finalResultTitle
  };
};

// 2-2. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  customer_id_param
) => {

  // top part
  let finalResultPart = [];

  // top title
  let finalResultTitle = [];

  const findResultPart = await repository.pieMonth.findPart(
    customer_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );
  const findResultTitle = await repository.pieMonth.findTitle(
    customer_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );

  for (let i = 0; i < findResultPart.length; i++) {
    finalResultPart.push({
      name: findResultPart[i]._id,
      value: findResultPart[i].count
    });
  }

  for (let i = 0; i < findResultTitle.length; i++) {
    finalResultTitle.push({
      name: findResultTitle[i]._id,
      value: findResultTitle[i].count
    });
  }

  return {
    part: finalResultPart,
    title: finalResultTitle
  };
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  customer_id_param
) => {

  const data = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  // volume
  let finalResultVolume = [];

  // cardio
  let finalResultCardio = [];

  for (let i = 0; i < 7; i++) {
    const dayNum = curWeekStart.clone().add(i, "days");
    const findResult = await repository.lineWeek.find(
      customer_id_param, "", dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResultVolume.push({
      name: `${data[i]} ${dayNum.format("MM/DD")}`,
      볼륨: intFormat(findResult?.exercise_total_volume || 0)
    });

    finalResultCardio.push({
      name: `${data[i]} ${dayNum.format("MM/DD")}`,
      시간: intFormat(findResult?.exercise_total_cardio || 0)
    });
  };

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  customer_id_param
) => {

  const data = [
    "1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일",
    "11일", "12일", "13일", "14일", "15일", "16일", "17일", "18일", "19일", "20일",
    "21일", "22일", "23일", "24일", "25일", "26일", "27일", "28일", "29일", "30일", "31일"
  ];

  // volume
  let finalResultVolume = [];

  // cardio
  let finalResultCardio = [];

  for (let i = 0; i < 31; i++) {
    const dayNum = curMonthStart.clone().add(i, "days");
    const findResult = await repository.lineMonth.find(
      customer_id_param, "", dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResultVolume.push({
      name: `${data[i]}`,
      볼륨: intFormat(findResult?.exercise_total_volume || 0)
    });

    finalResultCardio.push({
      name: `${data[i]}`,
      시간: intFormat(findResult?.exercise_total_cardio || 0)
    });

    if (dayNum.isSame(curMonthEnd, "day")) {
      break;
    }
  };

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = async (
  customer_id_param
) => {

  let sumExerciseVolume = Array(5).fill(0);
  let sumExerciseCardio = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const data = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  // volume
  let finalResultVolume = [];

  // cardio
  let finalResultCardio = [];

  for (
    let week = curMonthStart.clone();
    week.isBefore(curMonthEnd);
    week.add(1, "days")
  ) {
    const weekNum = week.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await repository.lineWeek.find(
        customer_id_param, "", week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
      );

      if (findResult) {
        sumExerciseVolume[weekNum - 1] += intFormat(findResult?.exercise_total_volume);
        sumExerciseCardio[weekNum - 1] += intFormat(findResult?.exercise_total_cardio);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResultVolume.push({
      name: data[i],
      볼륨: intFormat(sumExerciseVolume[i] / countRecords[i])
    });
    finalResultCardio.push({
      name: data[i],
      시간: intFormat(sumExerciseCardio[i] / countRecords[i])
    });
  };

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  customer_id_param
) => {

  let sumExerciseVolume = Array(12).fill(0);
  let sumExerciseCardio = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const data = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // volume
  let finalResultVolume = [];

  // cardio
  let finalResultCardio = [];

  for (
    let month = curYearStart.clone();
    month.isBefore(curYearEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repository.lineMonth.find(
      customer_id_param, "", month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
    );

    if (findResult) {
      sumExerciseVolume[monthNum] += intFormat(findResult?.exercise_total_volume);
      sumExerciseCardio[monthNum] += intFormat(findResult?.exercise_total_cardio);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResultVolume.push({
      name: data[i],
      볼륨: intFormat(sumExerciseVolume[i] / countRecords[i])
    });
    finalResultCardio.push({
      name: data[i],
      시간: intFormat(sumExerciseCardio[i] / countRecords[i])
    });
  };

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};