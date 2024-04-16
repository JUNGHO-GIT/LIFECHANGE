// moneyDashService.js

import moment from "moment";
import * as repository from "../../repository/dash/moneyDashRepository.js";

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

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  user_id_param
) => {

  const data  = {
    "수입": {
      plan: "money_plan_in",
      real: "money_total_in"
    },
    "지출": {
      plan: "money_plan_out",
      real: "money_total_out"
    }
  };

  let finalResult = [];

  for (let key in data) {
    const findResultPlan = await repository.detailPlan(
      "", user_id_param, koreanDate, koreanDate
    );
    const findResultReal = await repository.detailReal(
      "", user_id_param, koreanDate, koreanDate
    );

    finalResult.push({
      name: key,
      목표: intFormat(findResultPlan?.[data[key].plan] || 0),
      실제: intFormat(findResultReal?.[data[key].real] || 0),
    });
  };

  return finalResult
};

// 2-1. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  user_id_param
) => {

  // in
  const findResultIn = await repository.aggregateIn(
    user_id_param, koreanDate, koreanDate
  );
  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  // out
  const findResultOut = await repository.aggregateOut(
    user_id_param, koreanDate, koreanDate
  );
  const finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut
  };
};

// 2-2. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  user_id_param
) => {

  // in
  const findResultIn = await repository.aggregateIn(
    user_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );

  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  // out
  const findResultOut = await repository.aggregateOut(
    user_id_param, curMonthStart.format("YYYY-MM-DD"), curMonthEnd.format("YYYY-MM-DD")
  );

  const finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut
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
    const dayNum = curWeekStart.clone().day(i);
    const findResult = await repository.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${data[i]} ${dayNum.format("MM/DD")}`,
      수입: intFormat(findResult?.money_total_in || 0),
      지출: intFormat(findResult?.money_total_out || 0),
    });
  };

  return finalResult
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
      수입: intFormat(findResult?.money_total_in || 0),
      지출: intFormat(findResult?.money_total_out || 0),
    });
  }

  return finalResult
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = async (
  user_id_param
) => {

  let sumMoneyIn = Array(5).fill(0);
  let sumMoneyOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const data = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  let finalResult = [];

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
        sumMoneyIn[weekNum - 1] += intFormat(findResult?.money_total_in || 0);
        sumMoneyOut[weekNum - 1] += intFormat(findResult?.money_total_out || 0);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${data[i]}`,
      수입: intFormat(sumMoneyIn[i] / countRecords[i]),
      지출: intFormat(sumMoneyOut[i] / countRecords[i]),
    });
  };

  return finalResult
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  user_id_param
) => {

  let sumMoneyIn = Array(12).fill(0);
  let sumMoneyOut = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const data = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  let finalResult = [];

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
      sumMoneyIn[monthNum] += intFormat(findResult?.money_total_in || 0);
      sumMoneyOut[monthNum] += intFormat(findResult?.money_total_out || 0);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: data[i],
      수입: intFormat(sumMoneyIn[i] / countRecords[i]),
      지출: intFormat(sumMoneyOut[i] / countRecords[i]),
    });
  };

  return finalResult
};