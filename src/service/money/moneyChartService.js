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

  // findResult, finalResult 변수 선언
  let findResultGoal = [];
  let findResultReal = [];
  let finalResult = [];

  // dateStart, dateEnd 정의
  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  // promise 사용하여 병렬 처리
  [findResultGoal, findResultReal] = await Promise.all([
    repository.barToday.listGoal(
      user_id_param, dateStart, dateEnd
    ),
    repository.barToday.list(
      user_id_param, dateStart, dateEnd
    )
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResult = findResultGoal.map((item) => [
    {
      name: String("income"),
      date: String(dateStart),
      goal: String(findResultGoal?.[0]?.money_goal_income || "0"),
      real: String(findResultReal?.[0]?.money_total_income || "0"),
    },
    {
      name: String("expense"),
      date: String(dateStart),
      goal: String(findResultGoal?.[0]?.money_goal_expense || "0"),
      real: String(findResultReal?.[0]?.money_total_expense || "0"),
    }
  ]).flat();

  return finalResult;
};

// 2-1. chart (pie - today) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieToday = async (
  user_id_param
) => {

  // findResult, finalResult 변수 선언
  let findResultInCome = [];
  let findResultExpense = [];
  let finalResultInCome = [];
  let finalResultExpense = [];

  // dateStart, dateEnd 정의
  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  // promise 사용하여 병렬 처리
  [findResultInCome, findResultExpense] = await Promise.all([
    repository.pieToday.listIncome(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieToday.listExpense(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultInCome = findResultInCome?.map((item) => ({
    name: String(item._id),
    value: Number(item.value) || 0
  }));
  finalResultExpense = findResultExpense?.map((item) => ({
    name: String(item._id),
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

  // findResult, finalResult 변수 선언
  let findResultInCome = [];
  let findResultExpense = [];
  let finalResultInCome = [];
  let finalResultExpense = [];

  // dateStart, dateEnd 정의
  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultInCome, findResultExpense] = await Promise.all([
    repository.pieWeek.listIncome(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieWeek.listExpense(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultInCome = findResultInCome?.map((item) => ({
    name: String(item._id),
    value: Number(item.value) || 0
  }));
  finalResultExpense = findResultExpense?.map((item) => ({
    name: String(item._id),
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

  // findResult, finalResult 변수 선언
  let findResultInCome = [];
  let findResultExpense = [];
  let finalResultInCome = [];
  let finalResultExpense = [];

  // dateStart, dateEnd 정의
  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  [findResultInCome, findResultExpense] = await Promise.all([
    repository.pieMonth.listIncome(
      user_id_param, dateStart, dateEnd
    ),
    repository.pieMonth.listExpense(
      user_id_param, dateStart, dateEnd
    ),
  ]);

  // findResult 배열을 순회하며 결과 저장
  finalResultInCome = findResultInCome?.map((item) => ({
    name: String(item._id),
    value: Number(item.value) || 0
  }));
  finalResultExpense = findResultExpense?.map((item) => ({
    name: String(item._id),
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

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  // dateStart, dateEnd 정의
  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  findResult = await repository.lineWeek.list(
    user_id_param, dateStart, dateEnd
  );

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curWeekStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndex = findResult.findIndex((item) => (
      item.money_dateStart === targetDate
    ));

    finalResult.push({
      name: String(data),
      date: String(date[index]),
      income:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_income)
        : "0",
      expense:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_expense)
        : "0",
    });
  });

  return finalResult;
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => `${i + 1}`);

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  // dateStart, dateEnd 정의
  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // promise 사용하여 병렬 처리
  findResult = await repository.lineMonth.list(
    user_id_param, dateStart, dateEnd
  );

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    const targetDate = curMonthStart.clone().add(index, 'days').format("YYYY-MM-DD");

    const findIndex = findResult.findIndex((item) => (
      item.money_dateStart === targetDate
    ));

    finalResult.push({
      name: String(data),
      date: String(date[index]),
      income:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_income)
        : "0",
      expense:
        findIndex !== -1
        ? String(findResult[findIndex]?.money_total_expense)
        : "0",
    });
  });

  return finalResult;
};

// 4-1. chart (avg - week) ------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param
) => {

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumIncome = Array(5).fill(0);
  let sumExpense = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  // weekStartDate 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) =>
    moment(curMonthStart).tz("Asia/Seoul").startOf("isoWeek").add(i, 'weeks')
  );

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => `week${i + 1}`);

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = weekStartDate[i].format("MM-DD");
    const endOfWeek = weekStartDate[i].clone().endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  // promise 사용하여 병렬 처리
  const parallelResult = await Promise.all(
    weekStartDate.map(async (startDate, i) => {
      const dateStart = startDate.format("YYYY-MM-DD");
      const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

      findResult = await repository.avgWeek.list(
        user_id_param, dateStart, dateEnd
      );

      return {
        findResult,
        index: i
      };
    })
  );

  // sum, count 설정
  parallelResult.forEach(({ findResult, index }) => {
    findResult.forEach((item) => {
      sumIncome[index] += Number(item.money_total_income || "0");
      sumExpense[index] += Number(item.money_total_expense || "0");
      countRecords[index]++;
    });
  });

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    finalResult.push({
      name: String(data),
      date: String(date[index]),
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

  // findResult, finalResult 변수 선언
  let findResult = [];
  let finalResult = [];

  // sum, count 변수 선언
  let sumIncome = Array(12).fill(0);
  let sumExpense = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  // monthStartDate 정의
  const monthStartDate = Array.from({ length: 12 }, (_, i) =>
    moment(curYearStart).tz("Asia/Seoul").startOf("year").add(i, 'months')
  );

  // ex. 00 월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = curYearStart.clone().add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = curYearStart.clone().add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  // promise 사용하여 병렬 처리
  const parallelResult = await Promise.all(
    monthStartDate.map(async (startDate, i) => {
      const dateStart = startDate.format("YYYY-MM-DD");
      const dateEnd = startDate.clone().endOf('month').format("YYYY-MM-DD");

      findResult = await repository.avgMonth.list(
        user_id_param, dateStart, dateEnd
      );

      return {
        findResult,
        index: i
      };
    }
  ));

  // sum, count 설정
  parallelResult.forEach(({ findResult, index }) => {
    findResult.forEach((item) => {
      sumIncome[index] += Number(item.money_total_income || "0");
      sumExpense[index] += Number(item.money_total_expense || "0");
      countRecords[index]++;
    });
  });

  // name 배열을 순회하며 결과 저장
  name.forEach((data, index) => {
    finalResult.push({
      name: String(data),
      date: String(date[index]),
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