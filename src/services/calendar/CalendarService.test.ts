/**
 * @file CalendarService.test.ts
 * @description CalendarService.deletes 합산 규칙 회귀 테스트 (H-9)
 *              일부 도메인 부재 시에도 성공으로 판정되는지 검증.
 *              repository / 도메인 RecordService 를 mock.module 로 대체해 DB 없이 헤르메틱 실행.
 * @author Jungho
 * @since 2026-06-07
 */

import { describe, expect, mock, test } from "bun:test";

// 1. mock 정의 ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// detail 은 섹션 존재 여부를 도메인별로 제어할 수 있게 가변 row 를 반환
let detailRows: any[] = [];
const detailMock = mock(async () => detailRows);

// 각 도메인 deletes 의 성공/실패를 테스트별로 제어
let exerciseStatus: string = `success`;
let foodStatus: string = `success`;
let moneyStatus: string = `success`;
let sleepStatus: string = `success`;

const makeDelete = (getStatus: () => string) =>
  mock(async () => ({
    status: getStatus(),
    result: getStatus() === `success` ? { ok: true } : null,
  }));

mock.module(`@repositories/calendar/CalendarRepository`, () => ({
  detail: detailMock,
}));
mock.module(`@services/exercise/ExerciseRecordService`, () => ({
  deletes: makeDelete(() => exerciseStatus),
}));
mock.module(`@services/food/FoodRecordService`, () => ({
  deletes: makeDelete(() => foodStatus),
}));
mock.module(`@services/money/MoneyRecordService`, () => ({
  deletes: makeDelete(() => moneyStatus),
}));
mock.module(`@services/sleep/SleepRecordService`, () => ({
  deletes: makeDelete(() => sleepStatus),
}));

const CalendarService = await import(`@services/calendar/CalendarService`);

const DATE = {
  dateType: `day`,
  dateStart: `2026-01-01`,
  dateEnd: `2026-01-01`,
};

// 2. CalendarService.deletes ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
describe(`CalendarService.deletes 합산 규칙`, () => {
  // 2-1. 한 도메인(exercise)만 존재 -> 부재 도메인의 fail 은 무시되고 전체 success
  test(`일부 도메인만 존재하면 부재 도메인 fail 을 무시하고 success 반환`, async () => {
    detailRows = [
      { calendar_exercise_section: [{ exercise_record_part: `chest` }] },
    ];
    exerciseStatus = `success`;
    // 부재 도메인 RecordService 들은 삭제 대상이 없어 fail 을 돌려준다 (실제 동작 재현)
    foodStatus = `fail`;
    moneyStatus = `fail`;
    sleepStatus = `fail`;

    const res = await CalendarService.deletes(`u1`, DATE);

    expect(res.status).toBe(`success`);
    expect(res.result.exercise.status).toBe(`success`);
  });

  // 2-2. 존재했던 도메인 삭제가 실제로 실패하면 전체 fail
  test(`존재했던 도메인의 삭제가 실패하면 전체 fail 반환`, async () => {
    detailRows = [{ calendar_food_section: [{ food_record_name: `rice` }] }];
    exerciseStatus = `fail`;
    foodStatus = `fail`;
    moneyStatus = `fail`;
    sleepStatus = `fail`;

    const res = await CalendarService.deletes(`u1`, DATE);

    expect(res.status).toBe(`fail`);
  });

  // 2-3. 모든 도메인이 부재(섹션 0개)면 기존 의미대로 fail 유지
  test(`모든 도메인이 부재면 fail 유지`, async () => {
    detailRows = [];
    exerciseStatus = `fail`;
    foodStatus = `fail`;
    moneyStatus = `fail`;
    sleepStatus = `fail`;

    const res = await CalendarService.deletes(`u1`, DATE);

    expect(res.status).toBe(`fail`);
  });

  // 2-4. 여러 도메인 존재 + 모두 삭제 성공 -> success
  test(`여러 도메인 존재하고 모두 삭제 성공하면 success`, async () => {
    detailRows = [
      {
        calendar_exercise_section: [{ exercise_record_part: `chest` }],
        calendar_money_section: [{ money_record_amount: `1000` }],
      },
    ];
    exerciseStatus = `success`;
    foodStatus = `fail`;
    moneyStatus = `success`;
    sleepStatus = `fail`;

    const res = await CalendarService.deletes(`u1`, DATE);

    expect(res.status).toBe(`success`);
  });
});
