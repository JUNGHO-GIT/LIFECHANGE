// customerPlanRepository.js

import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";
import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";
import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";
import {Exercise} from "../schema/Exercise.js";
import {ExercisePlan} from "../schema/ExercisePlan.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = {

  // 1. food
  findFoodPlan: async (
    customer_id_param, startDt_param, endDt_param
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
      {$project: {
        _id: 1,
        food_plan_startDt: "$food_plan_startDt",
        food_plan_endDt: "$food_plan_endDt",
        food_plan_kcal: "$food_plan_kcal",
        food_plan_carb: "$food_plan_carb",
        food_plan_protein: "$food_plan_protein",
        food_plan_fat: "$food_plan_fat",
      }}
    ]);
    return finalResult;
  },

  findFoodReal: async (
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
  },

  // 2. money
  findMoneyPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_plan_startDt: {
          $lte: endDt_param,
        },
        money_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$project: {
        _id: 1,
        money_plan_startDt: "$money_plan_startDt",
        money_plan_endDt: "$money_plan_endDt",
        money_plan_in: "$money_plan_in",
        money_plan_out: "$money_plan_out",
      }}
    ]);
    return finalResult;
  },

  findMoneyReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        money_startDt: "$money_startDt",
        money_endDt: "$money_endDt",
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }}
    ]);
    return finalResult;
  },

  // 3. sleep
  findSleepPlan: async (
    customer_id_param, startDt_param,  endDt_param,
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        sleep_plan_startDt: {
          $lte: endDt_param,
        },
        sleep_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$project: {
        _id: 1,
        sleep_plan_startDt: "$sleep_plan_startDt",
        sleep_plan_endDt: "$sleep_plan_endDt",
        sleep_plan_night: "$sleep_plan_night",
        sleep_plan_morning: "$sleep_plan_morning",
        sleep_plan_time: "$sleep_plan_time",
      }},
    ]);
    return finalResult;
  },

  findSleepReal: async (
    customer_id_param, startDt_param, endDt_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        customer_id: customer_id_param,
        sleep_startDt: {
          $lte: endDt_param,
        },
        sleep_endDt: {
          $gte: startDt_param
        },
      }},
      {$unwind: "$sleep_section"
      },
      {$project: {
        _id: 1,
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_night: "$sleep_section.sleep_night",
        sleep_morning: "$sleep_section.sleep_morning",
        sleep_time: "$sleep_section.sleep_time",
      }}
    ]);
    return finalResult;
  },

  // 4. exercise
  findExercisePlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_plan_startDt: {
          $lte: endDt_param,
        },
        exercise_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$project: {
        _id: 1,
        exercise_plan_startDt: "$exercise_plan_startDt",
        exercise_plan_endDt: "$exercise_plan_endDt",
        exercise_plan_count: "$exercise_plan_count",
        exercise_plan_volume: "$exercise_plan_volume",
        exercise_plan_cardio: "$exercise_plan_cardio",
        exercise_plan_weight: "$exercise_plan_weight",
      }}
    ]);
    return finalResult;
  },

  findExerciseReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        exercise_startDt: "$exercise_startDt",
        exercise_endDt: "$exercise_endDt",
        exercise_total_count: "$exercise_total_count",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight",
      }}
    ]);
    return finalResult;
  }
};