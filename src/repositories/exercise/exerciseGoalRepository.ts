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

  const finalResult:any = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { exercise_goal_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        exercise_goal_dateType: 1,
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
      }
    },
    {
      $sort: {
        exercise_goal_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await ExerciseGoal.countDocuments(
    {
      user_id: user_id_param,
      exercise_goal_dateStart: {
        $lte: dateEnd_param,
      },
      exercise_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? { exercise_goal_dateType: dateType_param } : {},
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

  const finalResult:any = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { exercise_goal_dateType: dateType_param } : {},
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

  const finalResult:any = await Exercise.aggregate([
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
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
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
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await ExerciseGoal.findOne(
    {
      user_id: user_id_param,
      exercise_goal_dateStart: dateStart_param,
      exercise_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_goal_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create (기존항목 제거 + 타겟항목에 생성) -----------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await ExerciseGoal.create(
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

// 4. insert (기존항목 유지 + 타겟항목에 끼워넣기) -------------------------------------------------

// 5. replace (기존항목 유지 + 타겟항목을 대체) ----------------------------------------------------
export const replace = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await ExerciseGoal.findOneAndUpdate(
    {
      user_id: user_id_param,
      exercise_goal_dateStart: dateStart_param,
      exercise_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_goal_dateType: dateType_param } : {},
    },
    {
      $set: {
        exercise_goal_count: OBJECT_param.exercise_goal_count,
        exercise_goal_volume: OBJECT_param.exercise_goal_volume,
        exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
        exercise_goal_weight: OBJECT_param.exercise_goal_weight,
        exercise_goal_updateDt: newDate
      },
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 6. delete (타겟항목 제거) -----------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await ExerciseGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      exercise_goal_dateStart: dateStart_param,
      exercise_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_goal_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};