// foodPlanRepo.js

import mongoose from "mongoose";
import moment from "moment";
import {Food} from "../../schema/real/Food.js";
import {FoodPlan} from "../../schema/plan/FoodPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await FoodPlan.countDocuments({
    user_id: user_id_param,
    food_plan_startDt: {
      $gte: startDt_param,
    },
    food_plan_endDt: {
      $lte: endDt_param,
    },
  });

  return finalResult;
};

// 1-1. find (plan) ------------------------------------------------------------------------------->
export const findPlan = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param,
  startDt_param,
  endDt_param,
) => {

  const finalResult = await FoodPlan.find({
    user_id: user_id_param,
    food_plan_startDt: {
      $gte: startDt_param,
    },
    food_plan_endDt: {
      $lte: endDt_param,
    },
  })
  .sort({food_plan_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 1-2. find (real) ------------------------------------------------------------------------------->
export const findReal = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param,
  startDt_param,
  endDt_param,
) => {

  const finalResult = await Food.find({
    user_id: user_id_param,
    food_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    food_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    }
  })
  .sort({food_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await FoodPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    food_plan_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    food_plan_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    }
  })
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
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
    food_plan_regdate: fmtDate,
    food_plan_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  FOOD_PLAN_param
) => {

  const finalResult = await FoodPlan.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...FOOD_PLAN_param,
      food_plan_update: fmtDate,
    }},
    {upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 4-1. delete ------------------------------------------------------------------------------------>
export const deletes = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const updateResult = await FoodPlan.updateOne(
    {_id: _id_param,
      user_id: user_id_param,
      food_plan_startDt: {
        $gte: startDt_param,
      },
      food_plan_endDt: {
        $lte: endDt_param,
      },
    },
    {$set: {
      food_plan_update: fmtDate,
    }},
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await FoodPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await FoodPlan.deleteOne({
        _id: doc._id
      })
    }
  }

  return finalResult;
};

