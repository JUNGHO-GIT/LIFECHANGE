// userPercentRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExerciseGoal} from "../../schema/exercise/ExerciseGoal.js";
import {Food} from "../../schema/food/Food.js";
import {FoodGoal} from "../../schema/food/FoodGoal.js";
import {Money} from "../../schema/money/Money.js";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepGoal} from "../../schema/sleep/SleepGoal.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = {

  // 1-1. exercise (goal)
  listExerciseGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }},
      {$project: {
        _id: 0,
        exercise_goal_count: "$exercise_goal_count",
        exercise_goal_volume: "$exercise_goal_volume",
        exercise_goal_cardio: "$exercise_goal_cardio",
        exercise_goal_weight: "$exercise_goal_weight",
      }}
    ]);
    return finalResult[0];
  },

  // 1-2. exercise
  listExercise: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }},
      {$project: {
        _id: 0,
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight",
      }}
    ]);
    return finalResult[0];
  },

  // 2-1. food (goal)
  listFoodGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await FoodGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        _id: 0,
        food_goal_kcal: "$food_goal_kcal",
        food_goal_carb: "$food_goal_carb",
        food_goal_protein: "$food_goal_protein",
        food_goal_fat: "$food_goal_fat",
      }}
    ]);
    return finalResult[0];
  },

  // 2-2. food
  listFood: async (
    user_id_param, dateStart_param, dateEnd_param
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
        }
      }},
      {$project: {
        _id: 0,
        food_total_kcal: "$food_total_kcal",
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat",
      }}
    ]);
    return finalResult[0];
  },

  // 3-1. money (goal)
  listMoneyGoal: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }},
      {$project: {
        _id: 0,
        money_goal_in: "$money_goal_in",
        money_goal_out: "$money_goal_out",
      }}
    ]);
    return finalResult[0];
  },

  // 3-2. money
  listMoney: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }},
      {$project: {
        _id: 0,
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }}
    ]);
    return finalResult[0];
  },

  // 4-1. sleep (goal)
  listSleepGoal: async (
    user_id_param, dateStart_param,  dateEnd_param,
  ) => {
    const finalResult = await SleepGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }},
      {$project: {
        _id: 0,
        sleep_goal_night: "$sleep_goal_night",
        sleep_goal_morning: "$sleep_goal_morning",
        sleep_goal_time: "$sleep_goal_time",
      }}
    ]);
    return finalResult[0];
  },

  // 4-2. sleep
  listSleep: async (
    user_id_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        _id: 0,
        sleep_night: { $arrayElemAt: ["$sleep_section.sleep_night", 0] },
        sleep_morning: { $arrayElemAt: ["$sleep_section.sleep_morning", 0] },
        sleep_time: { $arrayElemAt: ["$sleep_section.sleep_time", 0] },
      }}
    ]);
    return finalResult[0];
  },
};

// 2. property ------------------------------------------------------------------------------------>
export const property = {
  listMoney: async (
    user_id_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param
      }},
      {$group: {
        _id: null,
        money_total_in: { $sum: "$money_total_in" },
        money_total_out: { $sum: "$money_total_out" },
        property_dateStart: { $min: "$money_dateStart" },
        property_dateEnd: { $max: "$money_dateEnd" },
      }},
      {$project: {
        _id: 0,
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
        property_dateStart: "$property_dateStart",
        property_dateEnd: "$property_dateEnd",
      }}
    ]);
    return finalResult[0];
  }
};