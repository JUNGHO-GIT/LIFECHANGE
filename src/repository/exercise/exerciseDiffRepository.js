// exerciseDiffRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      user_id: user_id_param,
      exercise_plan_dateStart: {
        $lte: dateEnd_param,
      },
      exercise_plan_dateEnd: {
        $gte: dateStart_param,
      },
      ...(dateType_param === "전체" ? {} : {
        exercise_plan_dateType: dateType_param
      }),
    });
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
        exercise_plan_dateStart: {
          $lte: dateEnd_param,
        },
        exercise_plan_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === "전체" ? {} : {
          exercise_plan_dateType: dateType_param
        }),
      }},
      {$sort: {exercise_plan_dateStart: sort_param}},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        ...(dateType_param === "전체" ? {} : {
          exercise_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        exercise_dateType: "$exercise_dateType",
        exercise_dateStart: "$exercise_dateStart",
        exercise_dateEnd: "$exercise_dateEnd",
        exercise_total_count: "$exercise_total_count",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight"
      }},
      {$sort: {exercise_dateStart: 1 }},
      {$limit: 1},
    ]);
    return finalResult;
  },
};