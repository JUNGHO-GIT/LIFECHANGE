/**
 * @file SleepGoalChartRepository.ts
 * @description sleep goal chart queries
 * @author Jungho
 * @since 2026-08-17
 */

import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";

// 1-1. chart (pie - goal) -------------------------------------------------------------------------
export const goal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        sleep_goal_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      },
    },
  ]);

  return finalResult;
};

// 1-2. chart (pie - record) ------------------------------------------------------------------------
export const record = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        sleep_record_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        sleep_section: 1,
      },
    },
  ]);

  return finalResult;
};
