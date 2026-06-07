/**
 * @file utils.test.ts
 * @description utils.calcDate 회귀 테스트 (L-7: 자정 넘김 보정 규칙)
 * @author Jungho
 * @since 2026-06-07
 */

import { describe, expect, test } from "bun:test";
import { calcDate } from "@assets/scripts/utils";

// 1. calcDate ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
describe(`utils.calcDate`, () => {
  // 1-1. 일반(같은 날) 케이스는 24h 보정 없이 순수 차이만 반환
  test(`같은 날 범위는 24시간을 더하지 않는다`, () => {
    expect(calcDate(`01:00`, `02:30`)).toBe(`01:30`);
    expect(calcDate(`09:00`, `17:00`)).toBe(`08:00`);
    expect(calcDate(`00:00`, `00:00`)).toBe(`00:00`);
  });

  // 1-2. 자정 넘김(end < start) 케이스만 24h 보정
  test(`자정 넘김 범위는 24시간을 더해 보정한다`, () => {
    // 23:00 -> 07:00 은 8시간 수면
    expect(calcDate(`23:00`, `07:00`)).toBe(`08:00`);
    // 22:30 -> 06:15 은 7시간 45분
    expect(calcDate(`22:30`, `06:15`)).toBe(`07:45`);
  });

  // 1-3. 정확히 1분 자정 넘김도 보정 (분 단위 경계)
  test(`1분 단위 자정 넘김 경계도 정확히 보정한다`, () => {
    // 23:59 -> 00:01 은 2분
    expect(calcDate(`23:59`, `00:01`)).toBe(`00:02`);
  });
});
