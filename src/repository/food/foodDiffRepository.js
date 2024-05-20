// foodDiffRepository.js

import {Food} from "../../schema/food/Food.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await FoodPlan.countDocuments({
      user_id: user_id_param,
      food_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
      food_plan_date_start: {
        $lte: dateEnd_param,
      },
      food_plan_date_end: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_date_type: !dateType_param ? {$exists:false} : dateType_param,
        food_date_start: {
          $lte: dateEnd_param,
        },
        food_date_end: {
          $gte: dateStart_param
        }
      }},
      {$project: {
        _id: 1,
        food_date_type: "$food_date_type",
        food_date_start: "$food_date_start",
        food_date_end: "$food_date_end",
        food_total_kcal: "$food_total_kcal",
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat",
      }}
    ]);
    return finalResult;
  },

  listPlan: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        food_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
        food_plan_date_start: {
          $lte: dateEnd_param,
        },
        food_plan_date_end: {
          $gte: dateStart_param,
        },
      }},
      {$sort: {
        food_plan_date_start: sort_param,
        food_plan_date_end: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  }
};