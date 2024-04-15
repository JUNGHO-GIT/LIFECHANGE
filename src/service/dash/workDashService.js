// workDashService.js

import moment from "moment";
import * as repo from "../../repository/dash/workDashRepo.js";

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

// 0-1. dash (scatter) ---------------------------------------------------------------------------->
export const dashScatter = async (
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

    const findResultPlan = await repo.aggregateWeightPlan(
      user_id_param, day.format("YYYY-MM-DD"), day.format("YYYY-MM-DD")
    );

    const findResultReal = await repo.aggregateWeightReal(
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

  return {
    result: finalResult,
  };
};

// 0-2. dash (pie) -------------------------------------------------------------------------------->
export const dashPie = async (
  user_id_param
) => {

  // top part
  let finalResultPart = [];

  // top title
  let finalResultTitle = [];

  const findResultPart = await repo.aggregateTopPart(
    user_id_param, curWeekStart.format("YYYY-MM-DD"), curWeekEnd.format("YYYY-MM-DD")
  );
  const findResultTitle = await repo.aggregateTopTitle(
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
    result: {
      part: finalResultPart,
      title: finalResultTitle
    }
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const data = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let finalResult = [];

  for (let i = 0; i < 7; i++) {
    const dayNum = curWeekStart.clone().add(i, "days");
    const findResult = await repo.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${data[i]} ${dayNum.format("MM/DD")}`,
      볼륨: intFormat(findResult?.work_total_volume || 0),
      시간: intFormat(findResult?.work_total_cardio || 0)
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
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
      const findResult = await repo.detailReal(
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
    result: {
      volume: finalResultVolume,
      cardio: finalResultCardio
    }
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
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

    const findResult = await repo.detailReal(
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
    result: {
      volume: finalResultVolume,
      cardio: finalResultCardio
    }
  };
};