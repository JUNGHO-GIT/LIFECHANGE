/**
 * @file FoodGoalChartRepository.ts
 * @description food goal chart queries
 * @author Jungho
 * @since 2026-08-17
 */

import { FoodGoal } from "@schemas/food/FoodGoal";
import { FoodRecord } from "@schemas/food/FoodRecord";

// 1-1. chart (pie - goal) -------------------------------------------------------------------------
export const goal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        food_goal_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1,
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
  const finalResult: any = await FoodRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        food_record_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        food_record_total_kcal: 1,
        food_record_total_carb: 1,
        food_record_total_protein: 1,
        food_record_total_fat: 1,
      },
    },
  ]);

  return finalResult;
};
