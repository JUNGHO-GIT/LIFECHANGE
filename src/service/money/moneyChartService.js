// moneyChartService.js

import * as repository from "../../repository/money/moneyChartRepository.js";
import moment from "moment-timezone";
import {koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
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
      goal: String(findGoal?.[0]?.money_goal_income || "0"),
      real: String(findReal?.[0]?.money_total_income || "0"),
    },
    {
      name: "expense",
      date: dateStart,
      goal: String(findGoal?.[0]?.money_goal_expense || "0"),
      real: String(findReal?.[0]?.money_total_expense || "0"),
    }
  ];

  return finalResult;
};

// 2-1. chart (pie - today) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
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
  findResultInCome = await repository.pieToday.listIncome(
    user_id_param, dateStart, dateEnd
  );
  // expense
  findResultExpense = await repository.pieToday.listExpense(
    user_id_param, dateStart, dateEnd
  );

  // income
  finalResultInCome = findResultInCome?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // expense
  finalResultExpense = findResultExpense?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));

  return {
    income: finalResultInCome,
    expense: finalResultExpense,
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
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
  findResultInCome = await repository.pieWeek.listIncome(
    user_id_param, dateStart, dateEnd
  );
  // expense
  findResultExpense = await repository.pieWeek.listExpense(
    user_id_param, dateStart, dateEnd
  );

  // income
  finalResultInCome = findResultInCome?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // expense
  finalResultExpense = findResultExpense?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));

  return {
    income: finalResultInCome,
    expense: finalResultExpense,
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
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
  findResultInCome = await repository.pieMonth.listIncome(
    user_id_param, dateStart, dateEnd
  );
  // expense
  findResultExpense = await repository.pieMonth.listExpense(
    user_id_param, dateStart, dateEnd
  );

  // income
  finalResultInCome = findResultInCome?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));
  // expense
  finalResultExpense = findResultExpense?.map((item) => ({
    name: String(item._id) || "",
    value: Number(item.value) || 0
  }));

  return {
    income: finalResultInCome,
    expense: finalResultExpense,
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
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

  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.money_dateStart).getDay() === index + 1
    ));
    finalResult.push({
      name: data,
      date: date[index],
      income:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_income || "0")
        : "0",
      expense:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_expense || "0")
        : "0",
    });
  });

  return finalResult;
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
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

  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.money_dateStart).getDate() === index + 1
    ));
    finalResult.push({
      name: data,
      date: date[index],
      income:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_income || "0")
        : "0",
      expense:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_expense || "0")
        : "0",
    });
  });

  return finalResult;
};

// 4-1. chart (avg - week) ------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param
) => {

  const dateStart = moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD");
  const dateEnd = moment(curMonthStart).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD");
  const weekStartDate = Array.from({ length: 5 }, (_, i) =>
    moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks')
  );

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `week${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks').format("MM-DD");
    const endOfWeek = moment(curMonthStart).tz("Asia/Seoul").endOf("isoWeek").add(i, 'weeks').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  let sumIncome = Array(5).fill(0);
  let sumExpense = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgWeek.list(
    user_id_param, dateStart, dateEnd
  );

  findResult.forEach((item) => {
    const startDate = moment(item.money_dateStart).tz("Asia/Seoul");
    weekStartDate.forEach((startOfWeek, index) => {
      const endOfWeek = startOfWeek.clone().endOf('isoWeek');
      if (startDate.isBetween(startOfWeek, endOfWeek, null, '[]')) {
        sumIncome[index] += Number(item.money_total_income || "0");
        sumExpense[index] += Number(item.money_total_expense || "0");
        countRecords[index]++;
      }
    });
  });

  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      income:
        countRecords[index] > 0
        ? String((sumIncome[index] / countRecords[index]).toFixed(2))
        : "0",
      expense:
        countRecords[index] > 0
        ? String((sumExpense[index] / countRecords[index]).toFixed(2))
        : "0",
    });
  });

  return finalResult;
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (
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
    const startOfMonth = curYearStart.clone().add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = curYearStart.clone().add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  let sumIncome = Array(12).fill(0);
  let sumExpense = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
    user_id_param, dateStart, dateEnd
  );

  findResult.forEach((item) => {
    const startDate = moment(item.money_dateStart).tz("Asia/Seoul");
    name.forEach((data, index) => {
      const startOfMonth = curYearStart.clone().add(index, 'months').startOf('month');
      const endOfMonth = curYearStart.clone().add(index, 'months').endOf('month');
      if (startDate.isBetween(startOfMonth, endOfMonth, null, '[]')) {
        sumIncome[index] += Number(item.money_total_income || "0");
        sumExpense[index] += Number(item.money_total_expense || "0");
        countRecords[index]++;
      }
    });
  });

  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      income:
        countRecords[index] > 0
        ? String((sumIncome[index] / countRecords[index]).toFixed(2))
        : "0",
      expense:
        countRecords[index] > 0
        ? String((sumExpense[index] / countRecords[index]).toFixed(2))
        : "0",
    });
  });

  return finalResult;
};