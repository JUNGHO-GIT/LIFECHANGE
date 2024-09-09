// exerciseGoalRepository.ts

import mongoose from "mongoose";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { Exercise } from "@schemas/exercise/Exercise";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          exercise_goal_dateType: dateType_param
        } : {},
      }
    },
    {
      $match: {
        exercise_goal_dateType: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        existDate: {
          $addToSet: "$exercise_goal_dateStart"
        }
      }
    }
  ]);

  return finalResult;
}

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await ExerciseGoal.countDocuments(
    {
      user_id: user_id_param,
      exercise_goal_dateStart: {
        $lte: dateEnd_param,
      },
      exercise_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? {
        exercise_goal_dateType: dateType_param
      } : {},
    }
  );

  return finalResult;
};

// 1-1. list (goal) --------------------------------------------------------------------------------
export const listGoal = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {

  const finalResult = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          exercise_goal_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 1,
        exercise_goal_dateType: 1,
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_count: 1,
        exercise_goal_volume: 1,
        exercise_goal_cardio: 1,
        exercise_goal_weight: 1,
      }
    },
    {
      $sort: {
        exercise_goal_dateStart: sort_param
      }
    },
    {
      $skip: Number(page_param - 1)
    }
  ]);

  return finalResult;
};

// 1-2. list (real) --------------------------------------------------------------------------------
export const listReal = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          exercise_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 1,
        exercise_dateType: 1,
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1,
        exercise_total_cardio: 1,
        exercise_total_weight: 1,
      }
    },
    {
      $sort: {
        exercise_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await ExerciseGoal.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      exercise_goal_dateStart: {
        $eq: dateStart_param,
      },
      exercise_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...dateType_param ? {
        exercise_goal_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await ExerciseGoal.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      exercise_goal_dummy: "N",
      exercise_goal_dateType: dateType_param,
      exercise_goal_dateStart: dateStart_param,
      exercise_goal_dateEnd: dateEnd_param,
      exercise_goal_count: OBJECT_param.exercise_goal_count,
      exercise_goal_volume: OBJECT_param.exercise_goal_volume,
      exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
      exercise_goal_weight: OBJECT_param.exercise_goal_weight,
      exercise_goal_regDt: newDate,
      exercise_goal_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await ExerciseGoal.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param
    },
    {
      $set: {
        exercise_goal_dateType: dateType_param,
        exercise_goal_dateStart: dateStart_param,
        exercise_goal_dateEnd: dateEnd_param,
        exercise_goal_count: OBJECT_param.exercise_goal_count,
        exercise_goal_volume: OBJECT_param.exercise_goal_volume,
        exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
        exercise_goal_weight: OBJECT_param.exercise_goal_weight,
        exercise_goal_updateDt: newDate
      }
    },
    {
      upsert: true,
      new: false
    }
  )
  .lean();

  return finalResult;
};

// 5. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
) => {

  const finalResult = await ExerciseGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
    }
  )
  .lean();

  return finalResult;
};