// workDashService.js

import moment from "moment";
import * as repository from "../../repository/dash/workDashRepository.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");

// 0-2. format ------------------------------------------------------------------------------------>
const intFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const toInt = parseInt(data, 10);
    return Math.round(toInt);
  }
  else {
    return Math.round(data);
  }
};

// 1-1. dash (scatter - week) -------------------------------------------------------------------->
export const scatterWeek = async (
  user_id_param
) => {

  const data = {
    "체중": {
      plan: "work_plan_body_weight",
      real: "work_body_weight"
    }
  };

  let finalResult = [];

  for (
    let day = curWeekStart.clone();
    day.isBefore(curWeekEnd);
    day.add(1, "days")
  ) {

    const findResultPlan = await repository.aggregateWeightPlan(
      user_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    const findResultReal = await repository.aggregateWeightReal(
      user_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    for (let key in data) {
      finalResult.push({
        name: day.format("MM/DD"),
        목표: intFormat(findResultPlan?.[0]?.[data[key].plan]),
        실제: intFormat(findResultReal?.[0]?.[data[key].real])
      });
    };
  };

  return finalResult;
};

// 1-2. dash (scatter - month) -------------------------------------------------------------------->
export const scatterMonth = async (
  user_id_param
) => {

  const data = {
    "체중": {
      plan: "work_plan_body_weight",
      real: "work_body_weight"
    }
  };

  let finalResult = [];

  for (
    let day = curMonthStart.clone();
    day.isBefore(curMonthEnd);
    day.add(1, "days")
  ) {

    const findResultPlan = await repository.aggregateWeightPlan(
      user_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    const findResultReal = await repository.aggregateWeightReal(
      user_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    for (let key in data) {
      finalResult.push({
        name: day.format("MM/DD"),
        목표: intFormat(findResultPlan?.[0]?.[data[key].plan]),
        실제: intFormat(findResultReal?.[0]?.[data[key].real])
      });
    };
  };

  return finalResult;
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  user_id_param
) => {

  // top part
  let finalResultPart = [];

  // top title
  let finalResultTitle = [];

  const findResultPart = await repository.aggregateTopPart(
    user_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
  );
  const findResultTitle = await repository.aggregateTopTitle(
    user_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
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
  user_id_param
) => {

  // top part
  let finalResultPart = [];

  // top title
  let finalResultTitle = [];

  const findResultPart = await repository.aggregateTopPart(
    user_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );
  const findResultTitle = await repository.aggregateTopTitle(
    user_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
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
  user_id_param
) => {

  const data = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let finalResult = [];

  for (let i = 0; i < 7; i++) {
    const dayNum = curWeekStart.clone().add(i, "days");
    const findResult = await repository.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${data[i]} ${dayNum.format("MM/DD")}`,
      볼륨: intFormat(findResult?.work_total_volume || 0),
      시간: intFormat(findResult?.work_total_cardio || 0)
    });
  };

  return finalResult;
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  user_id_param
) => {

  const data = [
    "1일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일",
    "11일", "12일", "13일", "14일", "15일", "16일", "17일", "18일", "19일", "20일",
    "21일", "22일", "23일", "24일", "25일", "26일", "27일", "28일", "29일", "30일", "31일"
  ];

  let finalResult = [];

  for (let i = 0; i < 31; i++) {
    const dayNum = curMonthStart.clone().add(i, "days");
    const findResult = await repository.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${data[i]}`,
      볼륨: intFormat(findResult?.work_total_volume || 0),
      시간: intFormat(findResult?.work_total_cardio || 0)
    });
  }

  return finalResult;
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = async (
  user_id_param
) => {

  let sumWorkVolume = Array(5).fill(0);
  let sumWorkCardio = Array(5).fill(0);
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
      const findResult = await repository.detailReal(
        "", user_id_param, week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
      );

      if (findResult) {
        sumWorkVolume[weekNum - 1] += intFormat(findResult?.work_total_volume);
        sumWorkCardio[weekNum - 1] += intFormat(findResult?.work_total_cardio);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResultVolume.push({
      name: data[i],
      볼륨: intFormat(sumWorkVolume[i] / countRecords[i])
    });
    finalResultCardio.push({
      name: data[i],
      시간: intFormat(sumWorkCardio[i] / countRecords[i])
    });
  };

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  user_id_param
) => {

  let sumWorkVolume = Array(12).fill(0);
  let sumWorkCardio = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const data = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // volume
  let finalResultVolume = [];

  // cardio
  let finalResultCardio = [];

  for (
    let month = curMonthStart.clone();
    month.isBefore(curMonthEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repository.detailReal(
      "", user_id_param, month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
    );

    if (findResult) {
      sumWorkVolume[monthNum] += intFormat(findResult?.work_total_volume);
      sumWorkCardio[monthNum] += intFormat(findResult?.work_total_cardio);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResultVolume.push({
      name: data[i],
      볼륨: intFormat(sumWorkVolume[i] / countRecords[i])
    });
    finalResultCardio.push({
      name: data[i],
      시간: intFormat(sumWorkCardio[i] / countRecords[i])
    });
  };

  return {
    volume: finalResultVolume,
    cardio: finalResultCardio
  };
};