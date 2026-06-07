/**
 * @file FoodFavoriteService.test.ts
 * @description FoodFavoriteService.update 회귀 테스트 (H-22)
 *              repository.list 가 null 일 때 크래시 없이 동작하는지 검증.
 *              과거 버그: findResult.some / [...findResult] 직전 null 가드 부재로 TypeError.
 *              FoodFavoriteRepository 를 mock.module 로 대체해 DB 없이 헤르메틱 실행.
 * @author Jungho
 * @since 2026-06-07
 */

import { describe, expect, mock, test } from "bun:test";

// 1. mock 정의 ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// list 반환(null/배열)과 update 성공/실패를 테스트별로 제어
let listResult: any = null;
let updateOk: boolean = true;

mock.module(`@repositories/food/FoodFavoriteRepository`, () => ({
  list: mock(async () => listResult),
  // update 는 저장될 즐겨찾기 배열을 그대로 돌려주되, 실패 케이스는 null 반환
  update: mock(async (_user: string, fav: any) => (updateOk ? fav : null)),
}));

const FoodFavoriteService = await import(`@services/food/FoodFavoriteService`);

// 2. FoodFavoriteService.update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
describe(`FoodFavoriteService.update null 가드`, () => {
  // 2-1. list 가 null 이어도 크래시 없이 새 즐겨찾기 추가 -> success (회귀 핵심)
  test(`list 가 null 이면 크래시 없이 신규 추가 success`, async () => {
    listResult = null;
    updateOk = true;

    const res = await FoodFavoriteService.update(`u1`, {
      food_record_key: `k1`,
    });

    expect(res.status).toBe(`success`);
    // null -> [] 정규화 후 신규 항목 1건이 저장되어야 함
    expect(res.result).toEqual([{ food_record_key: `k1` }]);
  });

  // 2-2. update repository 가 falsy 반환 시 fail (응답 계약 유지)
  test(`update 가 falsy 반환하면 fail`, async () => {
    listResult = null;
    updateOk = false;

    const res = await FoodFavoriteService.update(`u1`, {
      food_record_key: `k1`,
    });

    expect(res.status).toBe(`fail`);
    expect(res.result).toBeNull();
  });

  // 2-3. 기존 배열에 동일 key 존재 시 토글 제거 동작 정상
  test(`기존 즐겨찾기에 같은 key 있으면 제거(toggle) 후 success`, async () => {
    listResult = [{ food_record_key: `k1` }, { food_record_key: `k2` }];
    updateOk = true;

    const res = await FoodFavoriteService.update(`u1`, {
      food_record_key: `k1`,
    });

    expect(res.status).toBe(`success`);
    expect(res.result).toEqual([{ food_record_key: `k2` }]);
  });
});
