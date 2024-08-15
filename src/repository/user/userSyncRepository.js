// userSyncRepository.js

import {Exercise} from "../../schema/exercise/Exercise.js";
import {ExerciseGoal} from "../../schema/exercise/ExerciseGoal.js";
import {Food} from "../../schema/food/Food.js";
import {FoodGoal} from "../../schema/food/FoodGoal.js";
import {Money} from "../../schema/money/Money.js";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepGoal} from "../../schema/sleep/SleepGoal.js";
import {User} from "../../schema/user/User.js";

// 1-1. percent ------------------------------------------------------------------------------------
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
        money_goal_income: "$money_goal_income",
        money_goal_expense: "$money_goal_expense",
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
        money_total_income: "$money_total_income",
        money_total_expense: "$money_total_expense",
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
        sleep_goal_bedTime: "$sleep_goal_bedTime",
        sleep_goal_wakeTime: "$sleep_goal_wakeTime",
        sleep_goal_sleepTime: "$sleep_goal_sleepTime",
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
        sleep_bedTime: { $arrayElemAt: ["$sleep_section.sleep_bedTime", 0] },
        sleep_wakeTime: { $arrayElemAt: ["$sleep_section.sleep_wakeTime", 0] },
        sleep_sleepTime: { $arrayElemAt: ["$sleep_section.sleep_sleepTime", 0] },
      }}
    ]);
    return finalResult[0];
  },
};

// 2. property -------------------------------------------------------------------------------------
export const property = {

  findRegDt: async (
    user_id_param
  ) => {
    const finalResult = await User.aggregate([
      {$match: {
        user_id: user_id_param
      }},
      {$project: {
        _id: 0,
        user_regDt: "$user_regDt",
      }}
    ]);
    return finalResult[0];
  },

  initProperty: async (
    user_id_param
  ) => {
    const finalResult = await User.aggregate([
      {$match: {
        user_id: user_id_param
      }},
      {$project: {
        _id: 0,
        user_initProperty: "$user_initProperty",
        user_regDt: "$user_regDt",
      }}
    ]);
    return finalResult[0];
  },

  findMoney: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }},
      {$addFields: {
        money_total_income: { $toDouble: "$money_total_income" },
        money_total_expense: { $toDouble: "$money_total_expense" }
      }},
      {$group: {
        _id: null,
        money_total_income: { $sum: "$money_total_income" },
        money_total_expense: { $sum: "$money_total_expense" },
      }},
      {$project: {
        _id: 0,
        money_total_income: 1,
        money_total_expense: 1,
      }}
    ]);
    return finalResult[0];
  },

  updateProperty: async (
    user_id_param, curProperty_param
  ) => {
    const finalResult = await User.findOneAndUpdate({
      user_id: user_id_param,
    }, {
      $set: {
        user_curProperty: curProperty_param,
        user_updateDt: new Date(),
      },
    }, {
      new: true,
    });

    return finalResult;
  },
};