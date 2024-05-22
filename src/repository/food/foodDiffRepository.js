// foodDiffRepository.js

import {Food} from "../../schema/food/Food.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await FoodPlan.countDocuments({
      user_id: user_id_param,
      food_plan_dateStart: {
        $lte: dateEnd_param,
      },
      food_plan_dateEnd: {
        $gte: dateStart_param,
      },
      ...(dateType_param === "전체" ? {} : {
        food_plan_dateType: dateType_param
      }),
    });
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
        food_plan_dateStart: {
          $lte: dateEnd_param,
        },
        food_plan_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === "전체" ? {} : {
          food_plan_dateType: dateType_param
        }),
      }},
      {$sort: {food_plan_dateStart: sort_param}},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        ...(dateType_param === "전체" ? {} : {
          food_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        food_dateType: "$food_dateType",
        food_dateStart: "$food_dateStart",
        food_dateEnd: "$food_dateEnd",
        food_total_kcal: "$food_total_kcal",
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat",
      }},
      {$sort: {food_dateStart: 1 }},
      {$limit: 1},
    ]);
    return finalResult;
  },
};