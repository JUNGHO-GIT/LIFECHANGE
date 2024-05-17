// foodDiffRepository.js

import {Food} from "../../schema/food/Food.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param, startDt_param, endDt_param
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
  },

  list: async (
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
  },

  listPlan: async (
    user_id_param, sort_param, limit_param, page_param, startDt_param, endDt_param
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
  }
};