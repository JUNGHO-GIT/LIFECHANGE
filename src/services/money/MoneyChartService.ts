// moneyChartService.ts

import moment from "moment-timezone";
import * as repository from "@repositories/money/MoneyChartRepository";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const bar = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResult: any = [];
  let statusResult: string = "";

  // date 변수 정의
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.barGoal(
        user_id_param, dateStart, dateEnd
      ),
      repository.barRecord(
        user_id_param, dateStart, dateEnd
      )
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResult = findResultGoal.map((item: any) => [
      {
        name: String("income"),
        date: String(dateStart),
        goal: String(findResultGoal?.[0]?.money_goal_income || "0"),
        record: String(findResultRecord?.[0]?.money_record_total_income || "0"),
      },
      {
        name: String("expense"),
        date: String(dateStart),
        goal: String(findResultGoal?.[0]?.money_goal_expense || "0"),
        record: String(findResultRecord?.[0]?.money_record_total_expense || "0"),
      },
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

    // 데이터가 없을 때 기본값 설정
    if (!finalResultInCome || finalResultInCome.length === 0) {
      finalResultInCome = [{ name: "Empty", value: 100 }];
    }
    if (!finalResultExpense || finalResultExpense.length === 0) {
      finalResultExpense = [{ name: "Empty", value: 100 }];
    }

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = {
      income: [{ name: "Empty", value: 100 }],
      expense: [{ name: "Empty", value: 100 }],
    };
    statusResult = "success";
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
    finalResultInCome = finalResultInCome?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));

    // findResultExpense 배열을 순회하며 결과 저장
    finalResultExpense = findResultExpense?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) || 0
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultInCome || finalResultInCome.length === 0) {
      finalResultInCome = [{ name: "Empty", value: 100 }];
    }
    if (!finalResultExpense || finalResultExpense.length === 0) {
      finalResultExpense = [{ name: "Empty", value: 100 }];
    }

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = {
      income: [{ name: "Empty", value: 100 }],
      expense: [{ name: "Empty", value: 100 }],
    };
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 2-4. chart (pie - year) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieYear = async (
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
  const dateStart = DATE_param.yearStartFmt;
  const dateEnd = DATE_param.yearEndFmt;

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

    // 데이터가 없을 때 기본값 설정
    if (!finalResultInCome || finalResultInCome.length === 0) {
      finalResultInCome = [{ name: "Empty", value: 100 }];
    }
    if (!finalResultExpense || finalResultExpense.length === 0) {
      finalResultExpense = [{ name: "Empty", value: 100 }];
    }

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = "success";
  }
  catch (err: any) {
    finalResult = {
      income: [{ name: "Empty", value: 100 }],
      expense: [{ name: "Empty", value: 100 }],
    };
    statusResult = "success";
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

  // date 변수 정의 (현재 월의 전체 범위)
  const monthStartFmt = moment(DATE_param.weekStartFmt).startOf('month').format("YYYY-MM-DD");
  const monthEndFmt = moment(DATE_param.weekStartFmt).endOf('month').format("YYYY-MM-DD");
  const dateStart = monthStartFmt;
  const dateEnd = monthEndFmt;

  // ex. 1주, 2주, 3주, 4주, 5주
  const name = ["1주", "2주", "3주", "4주", "5주"];

  // 해당 월의 1일이 포함된 주의 시작일 (월요일 기준)
  const firstWeekStart = moment(monthStartFmt).startOf('isoWeek');

  // 주차별 날짜 범위 계산 (해당 월의 날짜가 포함된 주만)
  const weekRanges: any[] = [];
  let currentWeekStart = moment(firstWeekStart);
  let weekIndex = 0;

  while (weekIndex < 6) {
    const weekEnd = moment(currentWeekStart).add(6, 'days');
    const weekEndDate = weekEnd.format("YYYY-MM-DD");
    const weekStartDate = currentWeekStart.format("YYYY-MM-DD");

    // 해당 주에 현재 월의 날짜가 하나라도 포함되어 있는지 확인
    const hasMonthDate = (weekStartDate <= monthEndFmt && weekEndDate >= monthStartFmt);

    hasMonthDate && weekRanges.push({
      start: weekStartDate,
      end: weekEndDate,
      label: currentWeekStart.format("MM-DD")
    });

    currentWeekStart.add(7, 'days');
    weekIndex++;

    // 주의 시작일이 다음 달로 넘어가면 중단
    (currentWeekStart.isAfter(moment(monthEndFmt).add(7, 'days'))) && (weekIndex = 6);
  }

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.lineAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // 주차별 총합 계산
    weekRanges.forEach((range: any, index: number) => {
      let weekIncomeSum = 0;
      let weekExpenseSum = 0;

      findResult.forEach((item: any) => {
        const itemDate = item.money_record_dateStart;
        (itemDate >= range.start && itemDate <= range.end) && (
          weekIncomeSum += Number(item.money_record_total_income || 0),
          weekExpenseSum += Number(item.money_record_total_expense || 0)
        );
      });

      finalResult.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        income: String(weekIncomeSum),
        expense: String(weekExpenseSum)
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
    result: finalResult,
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

  // date 변수 정의 (현재 연도 전체 범위)
  const yearStartFmt = moment(DATE_param.monthStartFmt).startOf('year').format("YYYY-MM-DD");
  const yearEndFmt = moment(DATE_param.monthStartFmt).endOf('year').format("YYYY-MM-DD");
  const dateStart = yearStartFmt;
  const dateEnd = yearEndFmt;

  // ex. 1월, 2월, ..., 12월
  const name = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

  // 월별 날짜 범위 계산
  const monthRanges = Array.from({ length: 12 }, (_, i) => {
    const monthStart = moment(yearStartFmt).add(i, 'months').startOf('month');
    const monthEnd = moment(monthStart).endOf('month');
    return {
      start: monthStart.format("YYYY-MM-DD"),
      end: monthEnd.format("YYYY-MM-DD"),
      label: monthStart.format("MM")
    };
  });

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.lineAll(
        user_id_param, dateStart, dateEnd
      ),
    ]);

    // 월별 총합 계산
    monthRanges.forEach((range: any, index: number) => {
      let monthIncomeSum = 0;
      let monthExpenseSum = 0;

      findResult.forEach((item: any) => {
        const itemDate = item.money_record_dateStart;
        (itemDate >= range.start && itemDate <= range.end) && (
          monthIncomeSum += Number(item.money_record_total_income || 0),
          monthExpenseSum += Number(item.money_record_total_expense || 0)
        );
      });

      finalResult.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        income: String(monthIncomeSum),
        expense: String(monthExpenseSum)
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

// 4-1. chart (avg - week) -------------------------------------------------------------------------
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

  // ex. 00-00 - 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek = weekStartDate[i].clone().startOf('isoWeek').format("MM-DD");
    const endOfWeek = weekStartDate[i].clone().endOf('isoWeek').format("MM-DD");
    return `${startOfWeek} - ${endOfWeek}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      weekStartDate.map(async (startDate, i) => {
        const dateStart = startDate.clone().startOf('isoWeek').format("YYYY-MM-DD");
        const dateEnd = startDate.clone().endOf('isoWeek').format("YYYY-MM-DD");

        [findResult] = await Promise.all([
          repository.avgAll(
            user_id_param, dateStart, dateEnd
          ),
        ]);

        return {
          findResult,
          index: i
        };
      })
    );

    // sum, count 설정
    parallelResult.forEach(({ findResult, index }) => {
      findResult.forEach((item: any) => {
        sumIncome[index] += Number(item.money_record_total_income || "0");
        sumExpense[index] += Number(item.money_record_total_expense || "0");
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
    result: finalResult,
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

  // ex. 00-00 - 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth = moment(yearStartFmt).add(i, 'months').startOf('month').format("MM-DD");
    const endOfMonth = moment(yearStartFmt).add(i, 'months').endOf('month').format("MM-DD");
    return `${startOfMonth} - ${endOfMonth}`;
  });

  try {
    // promise 사용하여 병렬 처리
    const parallelResult = await Promise.all(
      monthStartDate.map(async (startDate, i) => {
        const dateStart = startDate.clone().startOf('month').format("YYYY-MM-DD");
        const dateEnd = startDate.clone().endOf('month').format("YYYY-MM-DD");

        [findResult] = await Promise.all([
          repository.avgAll(
            user_id_param, dateStart, dateEnd
          ),
        ]);

        return {
          findResult,
          index: i
        };
      }
    ));

    // sum, count 설정
    parallelResult.forEach(({ findResult, index }) => {
      findResult.forEach((item: any) => {
        sumIncome[index] += Number(item.money_record_total_income || "0");
        sumExpense[index] += Number(item.money_record_total_expense || "0");
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
    result: finalResult,
  };
};