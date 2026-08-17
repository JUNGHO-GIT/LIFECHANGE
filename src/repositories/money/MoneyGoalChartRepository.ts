/**
 * @file MoneyGoalChartRepository.ts
 * @description money goal chart queries
 * @author Jungho
 * @since 2026-08-17
 */

import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { MoneyRecord } from "@schemas/money/MoneyRecord";

// 1-1. chart (pie - goal) -------------------------------------------------------------------------
export const goal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await MoneyGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        money_goal_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        money_goal_income: 1,
        money_goal_expense: 1,
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
  const finalResult: any = await MoneyRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        money_record_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        money_record_total_income: 1,
        money_record_total_expense: 1,
      },
    },
  ]);

  return finalResult;
};
