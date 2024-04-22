// foodPlanRepository.js

import mongoose from "mongoose";
import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";
import {fmtDate} from "../assets/common/date.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  customer_id_param, startDt_param, endDt_param
) => {

  const finalResult = await FoodPlan.countDocuments({
    customer_id: customer_id_param,
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
    customer_id_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {

    const finalResult = await FoodPlan.findOne({
      !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      food_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};
// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {

    const finalResult = await FoodPlan.findOne({
      !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      food_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },
  create: async (
    customer_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {

    const finalResult = await FoodPlan.create({
      _id: new mongoose.Types.ObjectId(),
      customer_id: customer_id_param,
      food_plan_startDt: startDt_param,
      food_plan_endDt: endDt_param,
      food_plan_kcal: OBJECT_param.food_plan_kcal,
      food_plan_carb: OBJECT_param.food_plan_carb,
      food_plan_protein: OBJECT_param.food_plan_protein,
      food_plan_fat: OBJECT_param.food_plan_fat,
      food_plan_regDt: fmtDate,
      food_plan_updateDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param,
    OBJECT_param
  ) => {

    const finalResult = await FoodPlan.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...OBJECT_param,
        food_plan_updateDt: fmtDate,
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
  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await FoodPlan.findOne({
      !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      food_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    _id_param
  ) => {
    const deleteResult = await FoodPlan.deleteOne({
      _id: _id_param
    })
    .lean();
    return deleteResult;
  }
};