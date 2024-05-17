// userPercentRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";
import {Food} from "../../schema/food/Food.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";
import {Money} from "../../schema/money/Money.js";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = {

  // 1-1. exercise
  listExercise: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_startDt: {
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 0,
        exercise_total_count: "$exercise_total_count",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              exercise_total_count: 0,
              exercise_total_volume: 0,
              exercise_total_cardio: "00:00",
              exercise_body_weight: 0
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 1-2. exercise (plan)
  listExercisePlan: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_startDt: {
          $lte: endDt_param,
        },
        exercise_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$project: {
        _id: 0,
        exercise_plan_count: "$exercise_plan_count",
        exercise_plan_volume: "$exercise_plan_volume",
        exercise_plan_cardio: "$exercise_plan_cardio",
        exercise_plan_weight: "$exercise_plan_weight",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              exercise_plan_count: 0,
              exercise_plan_volume: 0,
              exercise_plan_cardio: "00:00",
              exercise_plan_weight: 0
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 2-1. food
  listFood: async (
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
        _id: 0,
        food_total_kcal: "$food_total_kcal",
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              food_total_kcal: 0,
              food_total_carb: 0,
              food_total_protein: 0,
              food_total_fat: 0
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 2-2. food (plan)
  listFoodPlan: async (
    user_id_param, startDt_param, endDt_param
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
      {$project: {
        _id: 0,
        food_plan_kcal: "$food_plan_kcal",
        food_plan_carb: "$food_plan_carb",
        food_plan_protein: "$food_plan_protein",
        food_plan_fat: "$food_plan_fat",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              food_plan_kcal: 0,
              food_plan_carb: 0,
              food_plan_protein: 0,
              food_plan_fat: 0
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 3-1. money
  listMoney: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 0,
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              money_total_in: 0,
              money_total_out: 0
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 3-2. money (plan)
  listMoneyPlan: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        money_plan_startDt: {
          $lte: endDt_param,
        },
        money_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$project: {
        _id: 0,
        money_plan_in: "$money_plan_in",
        money_plan_out: "$money_plan_out",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              money_plan_in: 0,
              money_plan_out: 0
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 4-1. sleep
  listSleep: async (
    user_id_param, startDt_param, endDt_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_startDt: {
          $lte: endDt_param,
        },
        sleep_endDt: {
          $gte: startDt_param
        },
      }},
      {$project: {
        _id: 0,
        sleep_night: "$sleep_section.sleep_night",
        sleep_morning: "$sleep_section.sleep_morning",
        sleep_time: "$sleep_section.sleep_time",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              sleep_night: "00:00",
              sleep_morning: "00:00",
              sleep_time: "00:00"
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
  },

  // 4-2. sleep (plan)
  listSleepPlan: async (
    user_id_param, startDt_param,  endDt_param,
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_plan_startDt: {
          $lte: endDt_param,
        },
        sleep_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$project: {
        _id: 0,
        sleep_plan_night: "$sleep_plan_night",
        sleep_plan_morning: "$sleep_plan_morning",
        sleep_plan_time: "$sleep_plan_time",
      }},
      {$facet: {
        "results": [{ $limit: 1 }],
        "default": [{ $limit: 1 }]
      }},
      {$project: {
        final: {
          $cond: {
            if: { $eq: [{ $size: "$results" }, 0] },
            then: [{
              sleep_plan_night: "00:00",
              sleep_plan_morning: "00:00",
              sleep_plan_time: "00:00"
            }],
            else: "$results"
          }
        }
      }},
      {$unwind: "$final"},
      {$replaceRoot: { newRoot: "$final" }}
    ]);
    return finalResult;
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
      }},
      {$project: {
        _id: 0,
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out"
      }}
    ]);
    return finalResult;
  }
};