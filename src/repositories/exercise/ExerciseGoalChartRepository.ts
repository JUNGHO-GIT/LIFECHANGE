/**
 * @file ExerciseGoalChartRepository.ts
 * @description exercise goal chart queries
 * @author Jungho
 * @since 2026-08-17
 */

import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";

// 1-1. chart (pie - goal) -------------------------------------------------------------------------
export const goal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        exercise_goal_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        exercise_goal_count: 1,
        exercise_goal_volume: 1,
        exercise_goal_cardio: 1,
        exercise_goal_scale: 1,
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
  const finalResult: any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      },
    },
    {
      $sort: {
        exercise_record_dateStart: 1,
      },
    },
    {
      $project: {
        _id: 0,
        exercise_record_total_volume: 1,
        exercise_record_total_cardio: 1,
        exercise_record_total_scale: 1,
      },
    },
  ]);

  return finalResult;
};
