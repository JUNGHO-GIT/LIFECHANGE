/**
 * @file MoneyChartService.test.ts
 * @description MoneyChartService.pieMonth 회귀 테스트 (H-21)
 *              income 데이터가 결과(result.income)에 반영되는지 검증.
 *              과거 버그: 빈 finalResultInCome 를 map 해 income 이 항상 Empty 100% 였음.
 *              MoneyChartRepository 를 mock.module 로 대체해 DB 없이 헤르메틱 실행.
 * @author Jungho
 * @since 2026-06-07
 */

import { describe, expect, mock, test } from "bun:test";

// 1. mock 정의 -------------------------------------------------------------------------------------
// pieIncome / pieExpense 반환을 테스트별로 제어
let incomeRows: any[] = [];
let expenseRows: any[] = [];

mock.module(`@repositories/money/MoneyChartRepository`, () => ({
  pieIncome: mock(async () => incomeRows),
  pieExpense: mock(async () => expenseRows),
}));

const MoneyChartService = await import(`@services/money/MoneyChartService`);

const DATE = { monthStartFmt: `2026-01-01`, monthEndFmt: `2026-01-31` };

// 2. MoneyChartService.pieMonth --------------------------------------------------------------------
describe(`MoneyChartService.pieMonth income 반영`, () => {
  // 2-1. income repository 결과가 result.income 에 그대로 매핑되어야 함 (회귀 핵심)
  test(`income 데이터가 result.income 에 반영된다`, async () => {
    incomeRows = [
      { _id: `salary`, value: 5000 },
      { _id: `bonus`, value: 1500 },
    ];
    expenseRows = [];

    const res = await MoneyChartService.pieMonth(`u1`, DATE);

    expect(res.status).toBe(`success`);
    expect(res.result.income).toEqual([
      { name: `salary`, value: 5000 },
      { name: `bonus`, value: 1500 },
    ]);
    // income 이 Empty 폴백으로 덮어써지지 않았는지 확인
    expect(res.result.income).not.toEqual([{ name: `Empty`, value: 100 }]);
  });

  // 2-2. income 이 비었을 때만 Empty 폴백, expense 는 정상 반영 (분기 독립성)
  test(`income 비면 Empty 폴백, expense 는 정상 반영`, async () => {
    incomeRows = [];
    expenseRows = [{ _id: `food`, value: 300 }];

    const res = await MoneyChartService.pieMonth(`u1`, DATE);

    expect(res.status).toBe(`success`);
    expect(res.result.income).toEqual([{ name: `Empty`, value: 100 }]);
    expect(res.result.expense).toEqual([{ name: `food`, value: 300 }]);
  });
});
