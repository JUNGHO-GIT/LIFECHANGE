// exerciseDiffRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExerciseGoal} from "../../schema/exercise/ExerciseGoal.js";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await ExerciseGoal.countDocuments({
      user_id: user_id_param,
      exercise_goal_dateStart: {
        $lte: dateEnd_param,
      },
      exercise_goal_dateEnd: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  listGoal: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
        },
      }},
      {$project: {
        _id: 1,
        exercise_goal_dateType: 1,
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_count: 1,
        exercise_goal_volume: 1,
        exercise_goal_cardio: 1,
        exercise_goal_weight: 1,
      }},
      {$sort: {exercise_goal_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
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