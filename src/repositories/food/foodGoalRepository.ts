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

  const finalResult = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          food_goal_dateType: dateType_param
        } : {},
      }
    },
    {
      $match: {
        food_goal_dateType: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        existDate: {
          $addToSet: "$food_goal_dateStart"
        }
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

  const finalResult = await FoodGoal.countDocuments(
    {
      user_id: user_id_param,
      food_goal_dateStart: {
        $lte: dateEnd_param,
      },
      food_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? {
        food_goal_dateType: dateType_param
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
  const finalResult = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          food_goal_dateType: dateType_param
        } : {},
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
  const finalResult = await Food.aggregate([
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
        ...dateType_param ? {
          food_dateType: dateType_param
        } : {},
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
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await FoodGoal.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      food_goal_dateStart: {
        $eq: dateStart_param,
      },
      food_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...dateType_param ? {
        food_goal_dateType: dateType_param
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

  const finalResult = await FoodGoal.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
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

// 4. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await FoodGoal.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
    },
    {
      $set: {
        food_goal_dateType: dateType_param,
        food_goal_dateStart: dateStart_param,
        food_goal_dateEnd: dateEnd_param,
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

// 5. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
) => {
  const finalResult = await FoodGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
    }
  )
  .lean();

  return finalResult;
};