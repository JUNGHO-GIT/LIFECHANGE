/**
 * @file utils.test.ts
 * @description goal chart 공용 산식 회귀 테스트
 *              toNumber/toMinutes/average/clockAverage 파싱·평균과
 *              createMetric/createClockMetric/createToleranceMetric 퍼센트 산식을
 *              DB 없이 헤르메틱하게 검증.
 * @author Jungho
 * @since 2026-08-18
 */

import { describe, expect, test } from "bun:test";
import {
  average,
  clockAverage,
  createClockMetric,
  createMetric,
  createToleranceMetric,
  toMinutes,
  toNumber,
} from "@assets/scripts/utils";

// 1. 숫자/시간 파싱 ---------------------------------------------------------------------------------
describe(`toNumber / toMinutes 파싱`, () => {
  // 1-1. 콤마·k/m 접미사·비정상 입력 정규화
  test(`toNumber 는 콤마와 k/m 접미사를 정규화한다`, () => {
    expect(toNumber(`1,234`)).toBe(1_234);
    expect(toNumber(`2k`)).toBe(2_000);
    expect(toNumber(`1m`)).toBe(1_000_000);
    expect(toNumber(null)).toBe(0);
    expect(toNumber(`abc`)).toBe(0);
  });

  // 1-2. HH:MM -> 분 변환과 비정상 입력 0 처리
  test(`toMinutes 는 HH:MM 을 분으로 변환한다`, () => {
    expect(toMinutes(`01:30`)).toBe(90);
    expect(toMinutes(`00:00`)).toBe(0);
    expect(toMinutes(null)).toBe(0);
    expect(toMinutes(`bad`)).toBe(0);
  });
});

// 2. 평균 -------------------------------------------------------------------------------------------
describe(`average / clockAverage 평균`, () => {
  // 2-1. 산술 평균과 빈 배열 0 처리
  test(`average 는 산술 평균, 빈 배열은 0`, () => {
    expect(average([])).toBe(0);
    expect(average([ 1, 2, 3 ])).toBe(2);
  });

  // 2-2. 자정 경계를 감싸는 원형 평균 (23:00 과 01:00 의 평균은 00:00)
  test(`clockAverage 는 자정 경계를 원형으로 평균한다`, () => {
    expect(clockAverage([])).toBe(0);
    expect(clockAverage([ 1_380, 60 ])).toBe(0);
    expect(clockAverage([ 600 ])).toBe(600);
  });
});

// 3. 메트릭 산식 -------------------------------------------------------------------------------------
describe(`createMetric 퍼센트 산식`, () => {
  // 3-1. 기본: record/goal 비율, goal 0 이면 0
  test(`기본 산식은 record/goal 비율`, () => {
    expect(createMetric(`kcal`, 2_000, 1_500).percent).toBe(75);
    expect(createMetric(`kcal`, 0, 1_500).percent).toBe(0);
  });

  // 3-2. inverse: 목표 이하 유지형(지출 등)은 record<=goal 이면 100
  test(`inverse 산식은 goal 이하 달성 시 100`, () => {
    expect(createMetric(`expense`, 1_000, 800, true).percent).toBe(100);
    expect(createMetric(`expense`, 1_000, 2_000, true).percent).toBe(50);
  });

  // 3-3. goal/record 는 소수 1자리 반올림 유지
  test(`goal/record 값은 소수 1자리로 반올림`, () => {
    const metric = createMetric(`carb`, 10.16, 20.24);
    expect(metric.goal).toBe(10.2);
    expect(metric.record).toBe(20.2);
  });
});

describe(`createClockMetric / createToleranceMetric 구간 산식`, () => {
  // 3-4. 시계형: 자정 랩어라운드 포함 오차 구간별 점수
  test(`clock 산식은 랩어라운드 오차 구간으로 점수화`, () => {
    expect(createClockMetric(`bedTime`, 1_435, 5).percent).toBe(100);
    expect(createClockMetric(`bedTime`, 600, 615).percent).toBe(80);
    expect(createClockMetric(`bedTime`, 0, 600).percent).toBe(0);
  });

  // 3-5. 허용오차형: 절대 오차 구간별 점수, goal 0 이면 0
  test(`tolerance 산식은 절대 오차 구간으로 점수화`, () => {
    expect(createToleranceMetric(`sleepTime`, 480, 485).percent).toBe(100);
    expect(createToleranceMetric(`sleepTime`, 480, 445).percent).toBe(60);
    expect(createToleranceMetric(`sleepTime`, 0, 480).percent).toBe(0);
  });
});
