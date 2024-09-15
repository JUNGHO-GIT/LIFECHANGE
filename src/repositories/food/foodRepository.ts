// foodRepository.ts

import mongoose from "mongoose";
import { Food } from "@schemas/food/Food";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
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
          $lte: dateEnd_param
        },
        food_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          food_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 0,
        food_dateType: 1,
        food_dateStart: 1,
        food_dateEnd: 1,
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

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Food.countDocuments(
    {
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
  );

  return finalResult;
};

// 1. list -----------------------------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
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
        food_dateStart: sort_param
      }
    },
    {
      $skip: (Number(page_param) - 1)
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

  const finalResult = await Food.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      food_dateStart: {
        $eq: dateStart_param
      },
      food_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        food_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Food.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      food_dummy: "N",
      food_dateType: dateType_param,
      food_dateStart: dateStart_param,
      food_dateEnd: dateEnd_param,
      food_total_kcal: OBJECT_param.food_total_kcal,
      food_total_carb: OBJECT_param.food_total_carb,
      food_total_protein: OBJECT_param.food_total_protein,
      food_total_fat: OBJECT_param.food_total_fat,
      food_section: OBJECT_param.food_section,
      food_regDt: newDate,
      food_updateDt: "",
    }
  );

  return finalResult;
};

// 5. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Food.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      food_dateStart: {
        $eq: dateStart_param
      },
      food_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        food_dateType: dateType_param
      } : {},
    },
    {
      $set: {
        food_dateType: dateType_param,
        food_dateStart: dateStart_param,
        food_dateEnd: dateEnd_param,
        food_total_kcal: OBJECT_param.food_total_kcal,
        food_total_carb: OBJECT_param.food_total_carb,
        food_total_protein: OBJECT_param.food_total_protein,
        food_total_fat: OBJECT_param.food_total_fat,
        food_updateDt: newDate,
      },
      $push: {
        food_section: OBJECT_param.food_section
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

// 6. delete --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Food.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_dateStart: {
        $eq: dateStart_param
      },
      food_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        food_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};