/**
 * @file MoneyChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/money/MoneyChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const bar = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.barGoal(user_id_param, dateStart, dateEnd),
      repository.barRecord(user_id_param, dateStart, dateEnd),
    ]);

    // income/expense 단일 막대 쌍 생성 (goal/record 각 [0] 사용, goal 0건이어도 record 기준 표시)
    finalResult = [
      {
        name: String(`income`),
        date: String(dateStart),
        goal: String(findResultGoal?.[0]?.money_goal_income ?? `0`),
        record: String(findResultRecord?.[0]?.money_record_total_income ?? `0`),
      },
      {
        name: String(`expense`),
        date: String(dateStart),
        goal: String(findResultGoal?.[0]?.money_goal_expense ?? `0`),
        record: String(
          findResultRecord?.[0]?.money_record_total_expense ?? `0`,
        ),
      },
    ];

    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-2. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultInCome: any[] = [];
  let findResultExpense: any[] = [];
  let finalResultInCome: any[] = [];
  let finalResultExpense: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.weekStartFmt;
  const dateEnd: string = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultInCome, findResultExpense] = await Promise.all([
      repository.pieIncome(user_id_param, dateStart, dateEnd),
      repository.pieExpense(user_id_param, dateStart, dateEnd),
    ]);

    // findResultInCome 배열을 순회하며 결과 저장
    finalResultInCome = findResultInCome?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // findResultExpense 배열을 순회하며 결과 저장
    finalResultExpense = findResultExpense?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultInCome || finalResultInCome.length === 0) {
      finalResultInCome = [{ name: `Empty`, value: 100 }];
    }
    if (!finalResultExpense || finalResultExpense.length === 0) {
      finalResultExpense = [{ name: `Empty`, value: 100 }];
    }

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      income: [{ name: `Empty`, value: 100 }],
      expense: [{ name: `Empty`, value: 100 }],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultInCome: any[] = [];
  let findResultExpense: any[] = [];
  let finalResultInCome: any[] = [];
  let finalResultExpense: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.monthStartFmt;
  const dateEnd: string = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultInCome, findResultExpense] = await Promise.all([
      repository.pieIncome(user_id_param, dateStart, dateEnd),
      repository.pieExpense(user_id_param, dateStart, dateEnd),
    ]);

    // findResultInCome 배열을 순회하며 결과 저장
    finalResultInCome = findResultInCome?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // findResultExpense 배열을 순회하며 결과 저장
    finalResultExpense = findResultExpense?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultInCome || finalResultInCome.length === 0) {
      finalResultInCome = [{ name: `Empty`, value: 100 }];
    }
    if (!finalResultExpense || finalResultExpense.length === 0) {
      finalResultExpense = [{ name: `Empty`, value: 100 }];
    }

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      income: [{ name: `Empty`, value: 100 }],
      expense: [{ name: `Empty`, value: 100 }],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-4. chart (pie - year) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieYear = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultInCome: any[] = [];
  let findResultExpense: any[] = [];
  let finalResultInCome: any[] = [];
  let finalResultExpense: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.yearStartFmt;
  const dateEnd: string = DATE_param.yearEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultInCome, findResultExpense] = await Promise.all([
      repository.pieIncome(user_id_param, dateStart, dateEnd),
      repository.pieExpense(user_id_param, dateStart, dateEnd),
    ]);

    // findResultInCome 배열을 순회하며 결과 저장
    finalResultInCome = findResultInCome?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // findResultExpense 배열을 순회하며 결과 저장
    finalResultExpense = findResultExpense?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultInCome || finalResultInCome.length === 0) {
      finalResultInCome = [{ name: `Empty`, value: 100 }];
    }
    if (!finalResultExpense || finalResultExpense.length === 0) {
      finalResultExpense = [{ name: `Empty`, value: 100 }];
    }

    finalResult = {
      income: finalResultInCome,
      expense: finalResultExpense,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      income: [{ name: `Empty`, value: 100 }],
      expense: [{ name: `Empty`, value: 100 }],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // date 변수 정의 (현재 월의 전체 범위)
  const monthStartFmt: string = moment(DATE_param.weekStartFmt)
    .startOf(`month`)
    .format(`YYYY-MM-DD`);
  const monthEndFmt: string = moment(DATE_param.weekStartFmt)
    .endOf(`month`)
    .format(`YYYY-MM-DD`);
  const dateStart: string = monthStartFmt;
  const dateEnd: string = monthEndFmt;

  // ex. 1주, 2주, 3주, 4주, 5주
  const name: string[] = [`1주`, `2주`, `3주`, `4주`, `5주`];

  // 해당 월의 1일이 포함된 주의 시작일 (월요일 기준)
  const firstWeekStart: moment.Moment =
    moment(monthStartFmt).startOf(`isoWeek`);

  // 주차별 날짜 범위 계산 (해당 월의 날짜가 포함된 주만)
  const weekRanges: any[] = [];
  let currentWeekStart: moment.Moment = moment(firstWeekStart);
  let weekIndex: number = 0;

  while (weekIndex < 6) {
    const weekEnd: moment.Moment = moment(currentWeekStart).add(6, `days`);
    const weekEndDate: string = weekEnd.format(`YYYY-MM-DD`);
    const weekStartDate: string = currentWeekStart.format(`YYYY-MM-DD`);

    // 해당 주에 현재 월의 날짜가 하나라도 포함되어 있는지 확인
    const hasMonthDate: boolean =
      weekStartDate <= monthEndFmt && weekEndDate >= monthStartFmt;

    hasMonthDate &&
      weekRanges.push({
        start: weekStartDate,
        end: weekEndDate,
        label: currentWeekStart.format(`MM-DD`),
      });

    currentWeekStart.add(7, `days`);
    weekIndex++;

    // 주의 시작일이 다음 달로 넘어가면 중단
    currentWeekStart.isAfter(moment(monthEndFmt).add(7, `days`)) &&
      (weekIndex = 6);
  }

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.lineAll(user_id_param, dateStart, dateEnd),
    ]);

    // 주차별 총합 계산
    weekRanges.forEach((range: any, index: number) => {
      let weekIncomeSum: number = 0;
      let weekExpenseSum: number = 0;

      findResult.forEach((item: any) => {
        const itemDate: string = item.money_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          ((weekIncomeSum += Number(item.money_record_total_income ?? 0)),
          (weekExpenseSum += Number(item.money_record_total_expense ?? 0)));
      });

      finalResult.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        income: String(weekIncomeSum),
        expense: String(weekExpenseSum),
      });
    });

    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // date 변수 정의 (현재 연도 전체 범위)
  const yearStartFmt: string = moment(DATE_param.monthStartFmt)
    .startOf(`year`)
    .format(`YYYY-MM-DD`);
  const yearEndFmt: string = moment(DATE_param.monthStartFmt)
    .endOf(`year`)
    .format(`YYYY-MM-DD`);
  const dateStart: string = yearStartFmt;
  const dateEnd: string = yearEndFmt;

  // ex. 1월, 2월, ..., 12월
  const name: string[] = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

  // 월별 날짜 범위 계산
  const monthRanges: { start: string; end: string; label: string }[] =
    Array.from({ length: 12 }, (_v, i: number) => {
      const monthStart: moment.Moment = moment(yearStartFmt)
        .add(i, `months`)
        .startOf(`month`);
      const monthEnd: moment.Moment = moment(monthStart).endOf(`month`);
      return {
        start: monthStart.format(`YYYY-MM-DD`),
        end: monthEnd.format(`YYYY-MM-DD`),
        label: monthStart.format(`MM`),
      };
    });

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.lineAll(user_id_param, dateStart, dateEnd),
    ]);

    // 월별 총합 계산
    monthRanges.forEach((range: any, index: number) => {
      let monthIncomeSum: number = 0;
      let monthExpenseSum: number = 0;

      findResult.forEach((item: any) => {
        const itemDate: string = item.money_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          ((monthIncomeSum += Number(item.money_record_total_income ?? 0)),
          (monthExpenseSum += Number(item.money_record_total_expense ?? 0)));
      });

      finalResult.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        income: String(monthIncomeSum),
        expense: String(monthExpenseSum),
      });
    });

    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumIncome: number[] = new Array<number>(5).fill(0);
  let sumExpense: number[] = new Array<number>(5).fill(0);
  let countRecords: number[] = new Array<number>(5).fill(0);

  // date 변수 정의
  const monthStartFmt: string = DATE_param.monthStartFmt;

  // weekStartDate 정의
  const weekStartDate: moment.Moment[] = Array.from(
    { length: 5 },
    (_v, i: number) => moment(monthStartFmt).startOf(`month`).add(i, `weeks`),
  );

  // ex. 00주차
  const name: string[] = Array.from({ length: 5 }, (_, i) => `week${i + 1}`);

  // ex. 00-00 - 00-00
  const date: string[] = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek: string = weekStartDate[i]
      .clone()
      .startOf(`isoWeek`)
      .format(`MM-DD`);
    const endOfWeek: string = weekStartDate[i]
      .clone()
      .endOf(`isoWeek`)
      .format(`MM-DD`);
    return `${startOfWeek} - ${endOfWeek}`;
  });

  // 주차별 조회 범위 (isoWeek 경계) 사전 계산 — 단일 범위 조회 후 JS 분할용
  const weekRanges: { start: string; end: string }[] = weekStartDate.map(
    (startDate: moment.Moment) => ({
      start: startDate.clone().startOf(`isoWeek`).format(`YYYY-MM-DD`),
      end: startDate.clone().endOf(`isoWeek`).format(`YYYY-MM-DD`),
    }),
  );

  // 전체 조회 범위 (첫 주 시작 ~ 마지막 주 끝)
  const dateStart: string = weekRanges[0].start;
  const dateEnd: string = weekRanges[weekRanges.length - 1].end;

  try {
    // 단일 범위 1회 조회 (기존 5쿼리 → 1쿼리)
    [findResult] = await Promise.all([
      repository.avgAll(user_id_param, dateStart, dateEnd),
    ]);

    // sum, count 설정 — JS 에서 주차 구간 분할
    // (기존 avgAll 쿼리와 동일: dateStart·dateEnd 모두 해당 주 범위 [start,end] 포함)
    weekRanges.forEach((range: { start: string; end: string }, index: number) => {
      findResult.forEach((item: any) => {
        const itemStart: string = item.money_record_dateStart;
        const itemEnd: string = item.money_record_dateEnd;
        itemStart >= range.start &&
          itemStart <= range.end &&
          itemEnd >= range.start &&
          itemEnd <= range.end &&
          ((sumIncome[index] += Number(item.money_record_total_income ?? `0`)),
          (sumExpense[index] += Number(item.money_record_total_expense ?? `0`)),
          countRecords[index]++);
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
            : `0`,
        expense:
          countRecords[index] > 0
            ? String((sumExpense[index] / countRecords[index]).toFixed(0))
            : `0`,
      });
    });

    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4-2. chart (avg - month) ------------------------------------------------------------------------
export const avgMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumIncome: number[] = new Array<number>(12).fill(0);
  let sumExpense: number[] = new Array<number>(12).fill(0);
  let countRecords: number[] = new Array<number>(12).fill(0);

  // date 변수 정의
  const yearStartFmt: string = DATE_param.yearStartFmt;

  // monthStartDate 정의
  const monthStartDate: moment.Moment[] = Array.from(
    { length: 12 },
    (_v, i: number) => moment(yearStartFmt).startOf(`year`).add(i, `months`),
  );

  // ex. 00 월
  const name: string[] = Array.from({ length: 12 }, (_, i) => `month${i + 1}`);

  // ex. 00-00 - 00-00
  const date: string[] = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth: string = moment(yearStartFmt)
      .add(i, `months`)
      .startOf(`month`)
      .format(`MM-DD`);
    const endOfMonth: string = moment(yearStartFmt)
      .add(i, `months`)
      .endOf(`month`)
      .format(`MM-DD`);
    return `${startOfMonth} - ${endOfMonth}`;
  });

  // 월별 조회 범위 (month 경계) 사전 계산 — 단일 범위 조회 후 JS 분할용
  const monthRanges: { start: string; end: string }[] = monthStartDate.map(
    (startDate: moment.Moment) => ({
      start: startDate.clone().startOf(`month`).format(`YYYY-MM-DD`),
      end: startDate.clone().endOf(`month`).format(`YYYY-MM-DD`),
    }),
  );

  // 전체 조회 범위 (1월 시작 ~ 12월 끝)
  const dateStart: string = monthRanges[0].start;
  const dateEnd: string = monthRanges[monthRanges.length - 1].end;

  try {
    // 단일 범위 1회 조회 (기존 12쿼리 → 1쿼리)
    [findResult] = await Promise.all([
      repository.avgAll(user_id_param, dateStart, dateEnd),
    ]);

    // sum, count 설정 — JS 에서 월 구간 분할
    // (기존 avgAll 쿼리와 동일: dateStart·dateEnd 모두 해당 월 범위 [start,end] 포함)
    monthRanges.forEach((range: { start: string; end: string }, index: number) => {
      findResult.forEach((item: any) => {
        const itemStart: string = item.money_record_dateStart;
        const itemEnd: string = item.money_record_dateEnd;
        itemStart >= range.start &&
          itemStart <= range.end &&
          itemEnd >= range.start &&
          itemEnd <= range.end &&
          ((sumIncome[index] += Number(item.money_record_total_income ?? `0`)),
          (sumExpense[index] += Number(item.money_record_total_expense ?? `0`)),
          countRecords[index]++);
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
            : `0`,
        expense:
          countRecords[index] > 0
            ? String((sumExpense[index] / countRecords[index]).toFixed(0))
            : `0`,
      });
    });

    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
