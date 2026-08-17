/**
 * @file SleepGoalChartService.ts
 * @description sleep goal pie comparison
 * @author Jungho
 * @since 2026-08-17
 */

import * as repository from "@repositories/sleep/SleepGoalChartRepository";
import {
  average,
  clockAverage,
  createClockMetric,
  createToleranceMetric,
  toMinutes,
  type GoalChartMetric,
} from "@assets/scripts/utils";

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

    // sleep_section 펼침 + 항목별 목표/기록 평균 계산
    const sections: any[] = findResultRecord.flatMap((row: any) => row?.sleep_section ?? []);
    const values = (rows: any[], key: string): number[] => rows
      .map((row: any) => toMinutes(row?.[key]))
      .filter((value: number) => value > 0);

    finalResultMetrics = [
      createClockMetric(
        `bedTime`,
        clockAverage(values(findResultGoal, `sleep_goal_bedTime`)),
        clockAverage(values(sections, `sleep_record_bedTime`)),
      ),
      createClockMetric(
        `wakeTime`,
        clockAverage(values(findResultGoal, `sleep_goal_wakeTime`)),
        clockAverage(values(sections, `sleep_record_wakeTime`)),
      ),
      createToleranceMetric(
        `sleepTime`,
        average(values(findResultGoal, `sleep_goal_sleepTime`)),
        average(values(sections, `sleep_record_sleepTime`)),
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

    // sleep_section 펼침 + 항목별 목표/기록 평균 계산
    const sections: any[] = findResultRecord.flatMap((row: any) => row?.sleep_section ?? []);
    const values = (rows: any[], key: string): number[] => rows
      .map((row: any) => toMinutes(row?.[key]))
      .filter((value: number) => value > 0);

    finalResultMetrics = [
      createClockMetric(
        `bedTime`,
        clockAverage(values(findResultGoal, `sleep_goal_bedTime`)),
        clockAverage(values(sections, `sleep_record_bedTime`)),
      ),
      createClockMetric(
        `wakeTime`,
        clockAverage(values(findResultGoal, `sleep_goal_wakeTime`)),
        clockAverage(values(sections, `sleep_record_wakeTime`)),
      ),
      createToleranceMetric(
        `sleepTime`,
        average(values(findResultGoal, `sleep_goal_sleepTime`)),
        average(values(sections, `sleep_record_sleepTime`)),
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

    // sleep_section 펼침 + 항목별 목표/기록 평균 계산
    const sections: any[] = findResultRecord.flatMap((row: any) => row?.sleep_section ?? []);
    const values = (rows: any[], key: string): number[] => rows
      .map((row: any) => toMinutes(row?.[key]))
      .filter((value: number) => value > 0);

    finalResultMetrics = [
      createClockMetric(
        `bedTime`,
        clockAverage(values(findResultGoal, `sleep_goal_bedTime`)),
        clockAverage(values(sections, `sleep_record_bedTime`)),
      ),
      createClockMetric(
        `wakeTime`,
        clockAverage(values(findResultGoal, `sleep_goal_wakeTime`)),
        clockAverage(values(sections, `sleep_record_wakeTime`)),
      ),
      createToleranceMetric(
        `sleepTime`,
        average(values(findResultGoal, `sleep_goal_sleepTime`)),
        average(values(sections, `sleep_record_sleepTime`)),
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
