// foodDiffRepository.js

import {Food} from "../../schema/food/Food.js";
import {FoodGoal} from "../../schema/food/FoodGoal.js";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await FoodGoal.countDocuments({
      user_id: user_id_param,
      food_goal_dateStart: {
        $lte: dateEnd_param,
      },
      food_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...(dateType_param === "" ? {} : {
        food_goal_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  listGoal: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await FoodGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === "" ? {} : {
          food_goal_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        food_goal_dateType: 1,
        food_goal_dateStart: 1,
        food_goal_dateEnd: 1,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1,
      }},
      {$sort: {food_goal_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
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
        ...(dateType_param === "" ? {} : {
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