// moneyDashService.js

import * as repository from "../../repository/money/moneyDashRepository.js";
import {log} from "../../assets/js/utils.js";
import {intFormat, koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findGoal = [];
  let findReal = [];
  let finalResult = [];

  findGoal = await repository.barToday.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "income",
      date: dateStart,
      goal: intFormat(findGoal?.[0]?.money_goal_income),
      real: intFormat(findReal?.[0]?.money_total_income)
    },
    {
      name: "expense",
      date: dateStart,
      goal: intFormat(findGoal?.[0]?.money_goal_expense),
      real: intFormat(findReal?.[0]?.money_total_expense)
    }
  ];

  return finalResult;
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findResultInCome = [];
  let findResultExpense = [];
  let finalResultInCome = [];
  let finalResultExpense = [];

  // income
  findResultInCome = await repository.pieToday.listIn(
    user_id_param, dateStart, dateEnd
  );
  // expense
  findResultExpense = await repository.pieToday.listOut(
    user_id_param, dateStart, dateEnd
  );

  // income
  finalResultInCome = findResultInCome?.map((item) => ({
    name: item._id || "",
    value: intFormat(item.value) || 0
  }));
  // expense
  finalResultExpense = findResultExpense?.map((item) => ({
    name: item._id || "",
    value: intFormat(item.value) || 0
  }));

  return {
    income: finalResultInCome,
    expense: finalResultExpense,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let findResultInCome = [];
  let findResultExpense = [];
  let finalResultInCome = [];
  let finalResultExpense = [];

  // income
  findResultInCome = await repository.pieWeek.listIn(
    user_id_param, dateStart, dateEnd
  );
  // expense
  findResultExpense = await repository.pieWeek.listOut(
    user_id_param, dateStart, dateEnd
  );

  // income
  finalResultInCome = findResultInCome?.map((item) => ({
    name: item._id || "",
    value: intFormat(item.value) || 0
  }));
  // expense
  finalResultExpense = findResultExpense?.map((item) => ({
    name: item._id || "",
    value: intFormat(item.value) || 0
  }));

  return {
    income: finalResultInCome,
    expense: finalResultExpense,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let findResultInCome = [];
  let findResultExpense = [];
  let finalResultInCome = [];
  let finalResultExpense = [];

  // income
  findResultInCome = await repository.pieMonth.listIn(
    user_id_param, dateStart, dateEnd
  );
  // expense
  findResultExpense = await repository.pieMonth.listOut(
    user_id_param, dateStart, dateEnd
  );

  // income
  finalResultInCome = findResultInCome?.map((item) => ({
    name: item._id || "",
    value: intFormat(item.value) || 0
  }));
  // expense
  finalResultExpense = findResultExpense?.map((item) => ({
    name: item._id || "",
    value: intFormat(item.value) || 0
  }));

  return {
    income: finalResultInCome,
    expense: finalResultExpense,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineWeek.list(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.money_dateStart).getDay() === index + 1
    ));
    finalResult.push({
      name: data,
      date: date[index],
      income: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_income) : 0,
      expense: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_expense) : 0
    });
  });

  return finalResult;
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineMonth.list(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.money_dateStart).getDate() === index
    ));
    finalResult.push({
      name: data,
      date: date[index],
      income: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_income) : 0,
      expense: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_expense) : 0
    });
  });

  return finalResult;
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `week${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curMonthStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curMonthStart.clone().add(i * 7 + 6, 'days').format("MM-DD")}`;
  });

  let sumIn = Array(5).fill(0);
  let sumOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
    user_id_param, dateStart, dateEnd
  );

  findResult.forEach((item) => {
    const moneyDate = new Date(item.money_dateStart);
    const diffTime = Math.abs(moneyDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumIn[weekNum] += intFormat(item.money_total_income);
      sumOut[weekNum] += intFormat(item.money_total_expense);
      countRecords[weekNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      income: intFormat(sumIn[index] / countRecords[index]),
      expense: intFormat(sumOut[index] / countRecords[index])
    });
  });

  return finalResult;
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumIn = Array(5).fill(0);
  let sumOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgYear.list(
    user_id_param, dateStart, dateEnd
  );

  findResult.forEach((item) => {
    const moneyDate = new Date(item.money_dateStart);
    const monthNum = moneyDate.getMonth();
    sumIn[monthNum] += intFormat(item.money_total_income);
    sumOut[monthNum] += intFormat(item.money_total_expense);
    countRecords[monthNum]++;
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      income: intFormat(sumIn[index] / countRecords[index]),
      expense: intFormat(sumOut[index] / countRecords[index])
    });
  });

  return finalResult;
};