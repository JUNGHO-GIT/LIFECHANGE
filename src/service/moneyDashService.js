// moneyDashService.js

import * as repository from "../repository/moneyDashRepository.js";
import {intFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResultIn = [];
  let finalResultOut = [];

  findPlan = await repository.barToday.listPlan(
    customer_id_param, startDt, endDt
  );
  findReal = await repository.barToday.listReal(
    customer_id_param, startDt, endDt
  );

  // in
  finalResultIn = [
    {
      name: "수입",
      목표: intFormat(findPlan?.[0]?.money_plan_in),
      실제: intFormat(findReal?.[0]?.money_total_in)
    }
  ];
  // out
  finalResultOut = [
    {
      name: "지출",
      목표: intFormat(findPlan?.[0]?.money_plan_out),
      실제: intFormat(findReal?.[0]?.money_total_out)
    }
  ];

  return {
    in: finalResultIn,
    out: finalResultOut
  };
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = async (
  customer_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieToday.listIn(
    customer_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.pieToday.listOut(
    customer_id_param, startDt, endDt
  );

  // in
  finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // out
  finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut
  };
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieWeek.listIn(
    customer_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.pieWeek.listOut(
    customer_id_param, startDt, endDt
  );

  // in
  finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // out
  finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut
  };
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieMonth.listIn(
    customer_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.pieMonth.listOut(
    customer_id_param, startDt, endDt
  );

  // in
  finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // out
  finalResultOut = findResultOut?.map((item) => ({
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
  customer_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  // ex 월 (00-00)
  const data = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("dd (MM-DD)");
  });

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.lineWeek.listIn(
    customer_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.lineWeek.listOut(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndexIn = findResultIn.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index
    ));
    const findIndexOut = findResultOut.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index
    ));
    finalResultIn.push({
      name: data,
      수입: findIndexIn !== -1 ? intFormat(findResultIn[findIndexIn]?.money_total_in) : 0
    });
    finalResultOut.push({
      name: data,
      지출: findIndexOut !== -1 ? intFormat(findResultOut[findIndexOut]?.money_total_out) : 0
    });
  });

  return {
    in: finalResultIn,
    out: finalResultOut
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

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  findResultIn = await repository.lineMonth.listIn(
    customer_id_param, startDt, endDt
  );
  findResultOut = await repository.lineMonth.listOut(
    customer_id_param, startDt, endDt
  );

  data.forEach((data, index) => {
    const findIndexIn = findResultIn.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index + 1
    ));
    const findIndexOut = findResultOut.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index + 1
    ));

    finalResultIn.push({
      name: data,
      수입: findIndexIn !== -1 ? intFormat(findResultIn[findIndexIn]?.money_total_in) : 0
    });
    finalResultOut.push({
      name: data,
      지출: findIndexOut !== -1 ? intFormat(findResultOut[findIndexOut]?.money_total_out) : 0
    });
  });

  return {
    in: finalResultIn,
    out: finalResultOut
  };
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  customer_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  const data = Array.from({ length: 5 }, (_, i) => {
    const weekStart = curWeekStart.clone().add(i * 7, 'days').format("MM-DD");
    const weekEnd = curWeekStart.clone().add((i + 1) * 7 - 1, 'days').format("MM-DD");
    return `${i + 1}주차 (${weekStart} ~ ${weekEnd})`;
  });

  let sumMoneyIn = Array(5).fill(0);
  let sumMoneyOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.avgMonth.listIn(
    customer_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.avgMonth.listOut(
    customer_id_param, startDt, endDt
  );

  // in
  findResultIn.forEach((item) => {
    const moneyDate = new Date(item.money_startDt);
    const diffTime = Math.abs(moneyDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumMoneyIn[weekNum] += intFormat(item.money_total_in);
      countRecords[weekNum]++;
    }
  });
  // out
  findResultOut.forEach((item) => {
    const moneyDate = new Date(item.money_startDt);
    const diffTime = Math.abs(moneyDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumMoneyOut[weekNum] += intFormat(item.money_total_out);
      countRecords[weekNum]++;
    }
  });

  data.forEach((data, index) => {
    finalResultIn.push({
      name: data,
      수입: intFormat(sumMoneyIn[index] / countRecords[index])
    });
    finalResultOut.push({
      name: data,
      지출: intFormat(sumMoneyOut[index] / countRecords[index])
    });
  });

  return {
    in: finalResultIn,
    out: finalResultOut
  }
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

  let sumMoneyIn = Array(5).fill(0);
  let sumMoneyOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.avgYear.listIn(
    customer_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.avgYear.listOut(
    customer_id_param, startDt, endDt
  );

  // in
  findResultIn.forEach((item) => {
    const foodDate = new Date(item.food_startDt);
    const monthNum = foodDate.getMonth();
    sumMoneyIn[monthNum] += intFormat(item.money_total_in);
    countRecords[monthNum]++;
  });
  // out
  findResultOut.forEach((item) => {
    const foodDate = new Date(item.food_startDt);
    const monthNum = foodDate.getMonth();
    sumMoneyOut[monthNum] += intFormat(item.money_total_out);
    countRecords[monthNum]++;
  });

  data.forEach((data, index) => {
    finalResultIn.push({
      name: data,
      수입: intFormat(sumMoneyIn[index] / countRecords[index])
    });
    finalResultOut.push({
      name: data,
      지출: intFormat(sumMoneyOut[index] / countRecords[index])
    });
  });

  return {
    in: finalResultIn,
    out: finalResultOut
  }
};