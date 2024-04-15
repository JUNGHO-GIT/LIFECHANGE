// foodDashRepo.js

import {Food} from "../../schema/real/Food.js";
import {FoodPlan} from "../../schema/plan/FoodPlan.js";

// 1-1. aggregate (kcal) -------------------------------------------------------------------------->
export const aggregateKcal = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Food.aggregate([
    {$match: {
      user_id: user_id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$unwind: "$food_section"
    },
    {$group: {
      _id: "$food_section.food_title_val",
      value: {
        $sum: {
          $toDouble: "$food_section.food_kcal"
        }
      }
    }},
    {$sort: {value: -1}},
    {$limit: 10}
  ]);

  return finalResult;
};

// 1-2. aggregate (nut) --------------------------------------------------------------------------->
export const aggregateNut = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Food.aggregate([
    {$match: {
      user_id: user_id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$group: {
      _id: null,
      total_carb: {$sum: "$food_total_carb"},
      total_protein: {$sum: "$food_total_protein"},
      total_fat: {$sum: "$food_total_fat"}
    }},
    {$project: {
      _id: 0,
      food_total_carb: "$total_carb",
      food_total_protein: "$total_protein",
      food_total_fat: "$total_fat"
    }},
  ]);

  console.log("===================================");
  console.log(JSON.stringify(finalResult, null, 2));

  return finalResult;
};

// 2-1. detail (plan) ----------------------------------------------------------------------------->
export const detailPlan = async (
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

// 2-2. detail (real) ----------------------------------------------------------------------------->
export const detailReal = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Food.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
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
  .lean();

  return finalResult;
};