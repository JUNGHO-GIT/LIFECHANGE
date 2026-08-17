/**
 * @file ExerciseGoalChartService.ts
 * @description exercise goal pie comparison
 * @author Jungho
 * @since 2026-08-17
 */

import * as repository from "@repositories/exercise/ExerciseGoalChartRepository";
import { average, createMetric, toMinutes, toNumber, type GoalChartMetric } from "@assets/scripts/utils";

// 2-2. chart (pie - week) -------------------------------------------------------------------------
export const pieWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResultMetrics: GoalChartMetric[] = [];
  let finalResult: any = {};
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.weekStartFmt;
  const dateEnd: string = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.goal(user_id_param, dateStart, dateEnd),
      repository.record(user_id_param, dateStart, dateEnd),
    ]);

    // 항목별 목표/기록 합계 계산
    const sum = (rows: any[], key: string): number => rows.reduce(
      (total: number, row: any) => total + toNumber(row?.[key]),
      0,
    );
    const positive = (rows: any[], key: string): number[] => rows
    .map((row: any) => toNumber(row?.[key]))
    .filter((value: number) => value > 0);

    finalResultMetrics = [
      // 회수 = volume 기록이 있는 record 수 (cardio 전용 기록은 회수에서 제외)
      createMetric(
        `count`,
        sum(findResultGoal, `exercise_goal_count`),
        findResultRecord.filter((row: any) => toNumber(row?.exercise_record_total_volume) > 0).length,
      ),
      createMetric(
        `volume`,
        sum(findResultGoal, `exercise_goal_volume`),
        sum(findResultRecord, `exercise_record_total_volume`),
      ),
      createMetric(
        `cardio`,
        findResultGoal.reduce((sumValue: number, row: any) => sumValue + toMinutes(row?.exercise_goal_cardio), 0),
        findResultRecord.reduce(
          (sumValue: number, row: any) => sumValue + toMinutes(row?.exercise_record_total_cardio), 0,
        ),
      ),
      createMetric(
        `scale`,
        average(positive(findResultGoal, `exercise_goal_scale`)),
        average(positive(findResultRecord, `exercise_record_total_scale`)),
        true,
      ),
    ];

    finalResult = { metrics: finalResultMetrics };
    statusResult = findResultGoal.length > 0 ? `success` : `fail`;
  } catch (error: unknown) {
    console.error(error);
    finalResult = { metrics: [] };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-3. chart (pie - month) ------------------------------------------------------------------------
export const pieMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResultMetrics: GoalChartMetric[] = [];
  let finalResult: any = {};
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.monthStartFmt;
  const dateEnd: string = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.goal(user_id_param, dateStart, dateEnd),
      repository.record(user_id_param, dateStart, dateEnd),
    ]);

    // 항목별 목표/기록 합계 계산
    const sum = (rows: any[], key: string): number => rows.reduce(
      (total: number, row: any) => total + toNumber(row?.[key]),
      0,
    );
    const positive = (rows: any[], key: string): number[] => rows
    .map((row: any) => toNumber(row?.[key]))
    .filter((value: number) => value > 0);

    finalResultMetrics = [
      // 회수 = volume 기록이 있는 record 수 (cardio 전용 기록은 회수에서 제외)
      createMetric(
        `count`,
        sum(findResultGoal, `exercise_goal_count`),
        findResultRecord.filter((row: any) => toNumber(row?.exercise_record_total_volume) > 0).length,
      ),
      createMetric(
        `volume`,
        sum(findResultGoal, `exercise_goal_volume`),
        sum(findResultRecord, `exercise_record_total_volume`),
      ),
      createMetric(
        `cardio`,
        findResultGoal.reduce((sumValue: number, row: any) => sumValue + toMinutes(row?.exercise_goal_cardio), 0),
        findResultRecord.reduce(
          (sumValue: number, row: any) => sumValue + toMinutes(row?.exercise_record_total_cardio), 0,
        ),
      ),
      createMetric(
        `scale`,
        average(positive(findResultGoal, `exercise_goal_scale`)),
        average(positive(findResultRecord, `exercise_record_total_scale`)),
        true,
      ),
    ];

    finalResult = { metrics: finalResultMetrics };
    statusResult = findResultGoal.length > 0 ? `success` : `fail`;
  } catch (error: unknown) {
    console.error(error);
    finalResult = { metrics: [] };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-4. chart (pie - year) -------------------------------------------------------------------------
export const pieYear = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResultMetrics: GoalChartMetric[] = [];
  let finalResult: any = {};
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.yearStartFmt;
  const dateEnd: string = DATE_param.yearEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.goal(user_id_param, dateStart, dateEnd),
      repository.record(user_id_param, dateStart, dateEnd),
    ]);

    // 항목별 목표/기록 합계 계산
    const sum = (rows: any[], key: string): number => rows.reduce(
      (total: number, row: any) => total + toNumber(row?.[key]),
      0,
    );
    const positive = (rows: any[], key: string): number[] => rows
    .map((row: any) => toNumber(row?.[key]))
    .filter((value: number) => value > 0);

    finalResultMetrics = [
      // 회수 = volume 기록이 있는 record 수 (cardio 전용 기록은 회수에서 제외)
      createMetric(
        `count`,
        sum(findResultGoal, `exercise_goal_count`),
        findResultRecord.filter((row: any) => toNumber(row?.exercise_record_total_volume) > 0).length,
      ),
      createMetric(
        `volume`,
        sum(findResultGoal, `exercise_goal_volume`),
        sum(findResultRecord, `exercise_record_total_volume`),
      ),
      createMetric(
        `cardio`,
        findResultGoal.reduce((sumValue: number, row: any) => sumValue + toMinutes(row?.exercise_goal_cardio), 0),
        findResultRecord.reduce(
          (sumValue: number, row: any) => sumValue + toMinutes(row?.exercise_record_total_cardio), 0,
        ),
      ),
      createMetric(
        `scale`,
        average(positive(findResultGoal, `exercise_goal_scale`)),
        average(positive(findResultRecord, `exercise_record_total_scale`)),
        true,
      ),
    ];

    finalResult = { metrics: finalResultMetrics };
    statusResult = findResultGoal.length > 0 ? `success` : `fail`;
  } catch (error: unknown) {
    console.error(error);
    finalResult = { metrics: [] };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
