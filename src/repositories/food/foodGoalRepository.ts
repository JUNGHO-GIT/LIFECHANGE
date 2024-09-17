// foodGoalRepository.ts

import mongoose from "mongoose";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { Food } from "@schemas/food/Food";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { food_goal_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        food_goal_dateType: 1,
        food_goal_dateStart: 1,
        food_goal_dateEnd: 1,
      }
    },
    {
      $sort: {
        food_goal_dateStart: 1
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

  const finalResult:any = await FoodGoal.countDocuments(
    {
      user_id: user_id_param,
      food_goal_dateStart: {
        $lte: dateEnd_param,
      },
      food_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? { food_goal_dateType: dateType_param } : {},
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
  const finalResult:any = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { food_goal_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        food_goal_dateType: 1,
        food_goal_dateStart: 1,
        food_goal_dateEnd: 1,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1,
      }
    },
    {
      $sort: {
        food_goal_dateStart: sort_param
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
  const finalResult:any = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? { food_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        food_dateType: 1,
        food_dateStart: 1,
        food_dateEnd: 1,
        food_total_kcal: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1,
      }
    },
    {
      $sort: {
        food_dateStart: 1
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

  const finalResult:any = await FoodGoal.findOne(
    {
      user_id: user_id_param,
      food_goal_dateStart: dateStart_param,
      food_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { food_goal_dateType: dateType_param } : {},
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

  const finalResult:any = await FoodGoal.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_goal_dummy: "N",
      food_goal_dateType: dateType_param,
      food_goal_dateStart: dateStart_param,
      food_goal_dateEnd: dateEnd_param,
      food_goal_kcal: OBJECT_param.food_goal_kcal,
      food_goal_carb: OBJECT_param.food_goal_carb,
      food_goal_protein: OBJECT_param.food_goal_protein,
      food_goal_fat: OBJECT_param.food_goal_fat,
      food_goal_regDt: newDate,
      food_goal_updateDt: "",
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

  const finalResult:any = await FoodGoal.findOneAndUpdate(
    {
      user_id: user_id_param,
      food_goal_dateStart: dateStart_param,
      food_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { food_goal_dateType: dateType_param } : {},
    },
    {
      $set: {
        food_goal_kcal: OBJECT_param.food_goal_kcal,
        food_goal_carb: OBJECT_param.food_goal_carb,
        food_goal_protein: OBJECT_param.food_goal_protein,
        food_goal_fat: OBJECT_param.food_goal_fat,
        food_goal_updateDt: newDate,
      }
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
  const finalResult:any = await FoodGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      food_goal_dateStart: dateStart_param,
      food_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { food_goal_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};