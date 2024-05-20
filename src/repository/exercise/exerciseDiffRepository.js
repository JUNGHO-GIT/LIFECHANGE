// exerciseDiffRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      user_id: user_id_param,
      exercise_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
      exercise_plan_date_start: {
        $lte: dateEnd_param,
      },
      exercise_plan_date_end: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_date_type: !dateType_param ? {$exists:false} : dateType_param,
        exercise_date_start: {
          $lte: dateEnd_param,
        },
        exercise_date_end: {
          $gte: dateStart_param
        }
      }},
      {$project: {
        _id: 1,
        exercise_date_type: "$exercise_date_type",
        exercise_date_start: "$exercise_date_start",
        exercise_date_end: "$exercise_date_end",
        exercise_total_count: "$exercise_total_count",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight"
      }}
    ]);
    return finalResult;
  },

  listPlan: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
        exercise_plan_date_start: {
          $lte: dateEnd_param,
        },
        exercise_plan_date_end: {
          $gte: dateStart_param,
        }
      }},
      {$sort: {
        exercise_plan_date_start: sort_param,
        exercise_plan_date_end: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  }
};