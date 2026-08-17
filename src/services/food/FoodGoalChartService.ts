/**
 * @file FoodGoalChartService.ts
 * @description food goal pie comparison
 * @author Jungho
 * @since 2026-08-17
 */

import * as repository from "@repositories/food/FoodGoalChartRepository";
import { createMetric, toNumber, type GoalChartMetric } from "@assets/scripts/utils";

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

    finalResultMetrics = [
      createMetric(
        `kcal`,
        sum(findResultGoal, `food_goal_kcal`),
        sum(findResultRecord, `food_record_total_kcal`),
      ),
      createMetric(
        `carb`,
        sum(findResultGoal, `food_goal_carb`),
        sum(findResultRecord, `food_record_total_carb`),
      ),
      createMetric(
        `protein`,
        sum(findResultGoal, `food_goal_protein`),
        sum(findResultRecord, `food_record_total_protein`),
      ),
      createMetric(
        `fat`,
        sum(findResultGoal, `food_goal_fat`),
        sum(findResultRecord, `food_record_total_fat`),
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

    finalResultMetrics = [
      createMetric(
        `kcal`,
        sum(findResultGoal, `food_goal_kcal`),
        sum(findResultRecord, `food_record_total_kcal`),
      ),
      createMetric(
        `carb`,
        sum(findResultGoal, `food_goal_carb`),
        sum(findResultRecord, `food_record_total_carb`),
      ),
      createMetric(
        `protein`,
        sum(findResultGoal, `food_goal_protein`),
        sum(findResultRecord, `food_record_total_protein`),
      ),
      createMetric(
        `fat`,
        sum(findResultGoal, `food_goal_fat`),
        sum(findResultRecord, `food_record_total_fat`),
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

    finalResultMetrics = [
      createMetric(
        `kcal`,
        sum(findResultGoal, `food_goal_kcal`),
        sum(findResultRecord, `food_record_total_kcal`),
      ),
      createMetric(
        `carb`,
        sum(findResultGoal, `food_goal_carb`),
        sum(findResultRecord, `food_record_total_carb`),
      ),
      createMetric(
        `protein`,
        sum(findResultGoal, `food_goal_protein`),
        sum(findResultRecord, `food_record_total_protein`),
      ),
      createMetric(
        `fat`,
        sum(findResultGoal, `food_goal_fat`),
        sum(findResultRecord, `food_record_total_fat`),
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
