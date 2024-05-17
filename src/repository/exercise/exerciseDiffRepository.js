// exerciseDiffRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      user_id: user_id_param,
      exercise_plan_startDt: {
        $lte: endDt_param,
      },
      exercise_plan_endDt: {
        $gte: startDt_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_startDt: {
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        exercise_startDt: "$exercise_startDt",
        exercise_endDt: "$exercise_endDt",
        exercise_total_count: "$exercise_total_count",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight"
      }}
    ]);
    return finalResult;
  },

  listPlan: async (
    user_id_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_startDt: {
          $lte: endDt_param,
        },
        exercise_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$sort: {
        exercise_plan_startDt: sort_param,
        exercise_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  }
};