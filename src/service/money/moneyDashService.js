// moneyDashService.js

import * as repository from "../../repository/money/moneyDashRepository.js";
import {intFormat, curYearStart, curYearEnd, curMonthStart, curMonthEnd, curWeekStart, curWeekEnd, koreanDate} from "../../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  user_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResultIn = [];
  let finalResultOut = [];

  findPlan = await repository.barToday.listPlan(
    user_id_param, startDt, endDt
  );
  findReal = await repository.barToday.list(
    user_id_param, startDt, endDt
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
  user_id_param
) => {

  const startDt = koreanDate;
  const endDt = koreanDate;

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieToday.listIn(
    user_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.pieToday.listOut(
    user_id_param, startDt, endDt
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
    out: finalResultOut,
    date: `${startDt} ~ ${endDt}`
  };
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  user_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieWeek.listIn(
    user_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.pieWeek.listOut(
    user_id_param, startDt, endDt
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
    out: finalResultOut,
    date: `${startDt} ~ ${endDt}`
  };
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  user_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieMonth.listIn(
    user_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.pieMonth.listOut(
    user_id_param, startDt, endDt
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
    out: finalResultOut,
    date: `${startDt} ~ ${endDt}`
  };
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  user_id_param
) => {

  const startDt = curWeekStart.format("YYYY-MM-DD");
  const endDt = curWeekEnd.format("YYYY-MM-DD");

  // ex 월
  const name = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.lineWeek.listIn(
    user_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.lineWeek.listOut(
    user_id_param, startDt, endDt
  );

  name.forEach((data, index) => {
    const findIndexIn = findResultIn.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index
    ));
    const findIndexOut = findResultOut.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index
    ));
    finalResultIn.push({
      name: data,
      date: date[index],
      수입: findIndexIn !== -1 ? intFormat(findResultIn[findIndexIn]?.money_total_in) : 0
    });
    finalResultOut.push({
      name: data,
      date: date[index],
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
  user_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  findResultIn = await repository.lineMonth.listIn(
    user_id_param, startDt, endDt
  );
  findResultOut = await repository.lineMonth.listOut(
    user_id_param, startDt, endDt
  );

  name.forEach((data, index) => {
    const findIndexIn = findResultIn.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index + 1
    ));
    const findIndexOut = findResultOut.findIndex((item) => (
      new Date(item.money_startDt).getDay() === index + 1
    ));

    finalResultIn.push({
      name: data,
      date: date[index],
      수입: findIndexIn !== -1 ? intFormat(findResultIn[findIndexIn]?.money_total_in) : 0
    });
    finalResultOut.push({
      name: data,
      date: date[index],
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
  user_id_param
) => {

  const startDt = curMonthStart.format("YYYY-MM-DD");
  const endDt = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `${i + 1}주차`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curWeekStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curWeekStart.clone().add((i + 1) * 7 - 1, 'days').format("MM-DD")}`;
  });

  let sumIn = Array(5).fill(0);
  let sumOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.avgMonth.listIn(
    user_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.avgMonth.listOut(
    user_id_param, startDt, endDt
  );

  // in
  findResultIn.forEach((item) => {
    const moneyDate = new Date(item.money_startDt);
    const diffTime = Math.abs(moneyDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumIn[weekNum] += intFormat(item.money_total_in);
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
      sumOut[weekNum] += intFormat(item.money_total_out);
      countRecords[weekNum]++;
    }
  });

  name.forEach((data, index) => {
    finalResultIn.push({
      name: data,
      date: date[index],
      수입: intFormat(sumIn[index] / countRecords[index])
    });
    finalResultOut.push({
      name: data,
      date: date[index],
      지출: intFormat(sumOut[index] / countRecords[index])
    });
  });

  return {
    in: finalResultIn,
    out: finalResultOut
  }
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = async (
  user_id_param
) => {

  const startDt = curYearStart.format("YYYY-MM-DD");
  const endDt = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `${i + 1}월`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumIn = Array(5).fill(0);
  let sumOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.avgYear.listIn(
    user_id_param, startDt, endDt
  );
  // out
  findResultOut = await repository.avgYear.listOut(
    user_id_param, startDt, endDt
  );

  // in
  findResultIn.forEach((item) => {
    const moneyDate = new Date(item.money_startDt);
    const monthNum = moneyDate.getMonth();
    sumIn[monthNum] += intFormat(item.money_total_in);
    countRecords[monthNum]++;
  });
  // out
  findResultOut.forEach((item) => {
    const moneyDate = new Date(item.money_startDt);
    const monthNum = moneyDate.getMonth();
    sumOut[monthNum] += intFormat(item.money_total_out);
    countRecords[monthNum]++;
  });

  name.forEach((data, index) => {
    finalResultIn.push({
      name: data,
      date: date[index],
      수입: intFormat(sumIn[index] / countRecords[index])
    });
    finalResultOut.push({
      name: data,
      date: date[index],
      지출: intFormat(sumOut[index] / countRecords[index])
    });
  });

  return {
    in: finalResultIn,
    out: finalResultOut
  }
};