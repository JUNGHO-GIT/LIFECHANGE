// moneyChartService.ts

import * as repository from "@repositories/money/moneyChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const barToday = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultReal:any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultReal] = await Promise.all([
      repository.barGoal(
        user_id_param, dateStart, dateEnd
      ),
      repository.barReal(
        user_id_param, dateStart, dateEnd
      )
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResult = findResultGoal.map((item: any) => [
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultInCome: any[] = [];
  let findResultExpense: any[] = [];
  let finalResultInCome: any[] = [];
  let finalResultExpense: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultInCome, findResultExpense] = await Promise.all([
      repository.pieIncome(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieExpense(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResultInCome 배열을 순회하며 결과 저장
    finalResultInCome = findResultInCome?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));

    // findResultExpense 배열을 순회하며 결과 저장
    finalResultExpense = findResultExpense?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultInCome: any[] = [];
  let findResultExpense: any[] = [];
  let finalResultInCome: any[] = [];
  let finalResultExpense: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultInCome, findResultExpense] = await Promise.all([
      repository.pieIncome(
        user_id_param, dateStart, dateEnd
      ),
      repository.pieExpense(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // findResultInCome 배열을 순회하며 결과 저장
    finalResultInCome = findResultInCome?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));

    // findResultExpense 배열을 순회하며 결과 저장
    finalResultExpense = findResultExpense?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.weekStartFmt;
  const dateEnd = DATE_param.weekEndFmt;
  const weekStartFmt = DATE_param.weekStartFmt;

  // ex. mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return moment(weekStartFmt).clone().add(i, 'days').format("MM-DD");
  });

  try {
    // promise 사용하여 병렬 처리
    findResult = await repository.lineAll(
      user_id_param, dateStart, dateEnd
    );

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay = moment(weekStartFmt).clone().add(index, 'days').format("YYYY-MM-DD");

      const findIndex = findResult.findIndex((item: any) => (
        item.money_dateStart === targetDay
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param.monthStartFmt;
  const dateEnd = DATE_param.monthEndFmt;
  const monthStartFmt = DATE_param.monthStartFmt;
  const monthEndFmt = DATE_param.monthEndFmt;

  // ex. 00일
  const name = Array.from({ length: moment(monthEndFmt).date() }, (_, i) => (
    `${i + 1}`
  ));

  // ex. 00-00
  const date = Array.from({ length: moment(monthEndFmt).date() }, (_, i) => (
    moment(monthStartFmt).clone().add(i, 'days').format("MM-DD")
  ));

  try {
    // promise 사용하여 병렬 처리
    findResult = await repository.lineAll(
      user_id_param, dateStart, dateEnd
    );

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay = moment(monthStartFmt).clone().add(index, 'days').format("YYYY-MM-DD");

      const findIndex = findResult.findIndex((item: any) => (
        item.money_dateStart === targetDay
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

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 4-1. chart (avg - week) ------------------------------------------------------------------------
export const avgWeek = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumIncome = Array(5).fill(0);
  let sumExpense = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  // date 변수 정의
  const monthStartFmt = DATE_param.monthStartFmt;

  // weekStartDate 정의
  const weekStartDate = Array.from({ length: 5 }, (_, i) => (
    moment(monthStartFmt).startOf("month").add(i, 'weeks')
  ));

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => (
    `week${i + 1}`
  ));

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = moment(monthStartFmt).add(i, 'weeks').startOf('isoWeek').format("MM-DD");
    const endOfWeek = moment(monthStartFmt).add(i, 'weeks').endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} ~ ${endOfWeek}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      weekStartDate.map(async (startDate, i) => {
        const dateStart = startDate.format("YYYY-MM-DD");
        const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

        findResult = await repository.avgAll(
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
      findResult.forEach((item: any) => {
        sumIncome[index] += Number(item.money_total_income || "0");
        sumExpense[index] += Number(item.money_total_expense || "0");
        countRecords[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResult.push({
        name: String(data),
        date: String(date[index]),
        income:
          countRecords[index] > 0
          ? String((sumIncome[index] / countRecords[index]).toFixed(0))
          : "0",
        expense:
          countRecords[index] > 0
          ? String((sumExpense[index] / countRecords[index]).toFixed(0))
          : "0",
      });
    });

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // sum, count 변수 선언
  let sumIncome = Array(12).fill(0);
  let sumExpense = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  // date 변수 정의
  const yearStartFmt = DATE_param.yearStartFmt;

  // monthStartDate 정의
  const monthStartDate = Array.from({ length: 12 }, (_, i) => (
    moment(yearStartFmt).startOf("year").add(i, 'months')
  ));

  // ex. 00 월
  const name = Array.from({ length: 12 }, (_, i) => (
    `month${i + 1}`
  ));

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = moment(yearStartFmt).add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = moment(yearStartFmt).add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} ~ ${endOfMonth}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      monthStartDate.map(async (startDate, i) => {
        const dateStart = startDate.format("YYYY-MM-DD");
        const dateEnd = startDate.clone().endOf('month').format("YYYY-MM-DD");

        findResult = await repository.avgAll(
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
      findResult.forEach((item: any) => {
        sumIncome[index] += Number(item.money_total_income || "0");
        sumExpense[index] += Number(item.money_total_expense || "0");
        countRecords[index]++;
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResult.push({
        name: String(data),
        date: String(date[index]),
        income:
          countRecords[index] > 0
          ? String((sumIncome[index] / countRecords[index]).toFixed(0))
          : "0",
        expense:
          countRecords[index] > 0
          ? String((sumExpense[index] / countRecords[index]).toFixed(0))
          : "0",
      });
    });

    statusResult = "success";
  }
  catch (err: any) {
    finalResult = [];
    statusResult = "fail";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};