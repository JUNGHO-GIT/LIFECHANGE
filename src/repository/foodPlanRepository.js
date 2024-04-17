// foodPlanRepository.js

import mongoose from "mongoose";
import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";
import {fmtDate} from "../assets/common/common.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await FoodPlan.countDocuments({
    user_id: user_id_param,
    food_plan_startDt: {
      $lte: endDt_param,
    },
    food_plan_endDt: {
      $gte: startDt_param,
    },
  });

  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  findPlan: async (
    user_id_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        food_plan_startDt: {
          $lte: endDt_param,
        },
        food_plan_endDt: {
          $gte: startDt_param,
        },
      }},
      {$sort: {
        food_plan_startDt: sort_param,
        food_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },
  findReal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        food_startDt: "$food_startDt",
        food_endDt: "$food_endDt",
        food_total_kcal: "$food_total_kcal",
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat",
      }}
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await FoodPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      food_plan_startDt: startDt_param,
      food_plan_endDt: endDt_param,
    })
    .lean();

    return finalResult;
  }
};
// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await FoodPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      food_plan_startDt: startDt_param,
      food_plan_endDt: endDt_param,
    })
    .lean();

    return finalResult;
  },
  create: async (
    user_id_param,
    FOOD_PLAN_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await FoodPlan.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_plan_startDt: startDt_param,
      food_plan_endDt: endDt_param,
      food_plan_kcal: FOOD_PLAN_param.food_plan_kcal,
      food_plan_carb: FOOD_PLAN_param.food_plan_carb,
      food_plan_protein: FOOD_PLAN_param.food_plan_protein,
      food_plan_fat: FOOD_PLAN_param.food_plan_fat,
      food_plan_regDt: fmtDate,
      food_plan_upDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param,
    FOOD_PLAN_param
  ) => {

    const finalResult = await FoodPlan.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...FOOD_PLAN_param,
        food_plan_upDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};
// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {
  deletes: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {

    const updateResult = await FoodPlan.updateOne(
      {_id: _id_param,
        user_id: user_id_param,
        food_plan_startDt: startDt_param,
        food_plan_endDt: endDt_param,
      },
      {$set: {
        food_plan_upDt: fmtDate,
      }},
      {arrayFilters: [{
        "elem._id": _id_param
      }]}
    )
    .lean();

    let finalResult;

    if (updateResult.modifiedCount > 0) {
      const doc = await FoodPlan.findOne({
        user_id: user_id_param,
        food_plan_startDt: startDt_param,
        food_plan_endDt: endDt_param,
      })
      .lean();

      if (doc) {
        finalResult = await FoodPlan.deleteOne({
          _id: doc._id
        })
        .lean();
      }
    }

    return finalResult;
  }
};