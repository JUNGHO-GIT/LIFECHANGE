// userSyncRepository.ts

import { Exercise } from "@schemas/exercise/Exercise";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { Food } from "@schemas/food/Food";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { Money } from "@schemas/money/Money";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { Sleep } from "@schemas/sleep/Sleep";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { User } from "@schemas/user/User";
import { newDate } from "@scripts/date";

// 1-1. exercise (goal) ----------------------------------------------------------------------------
export const listExerciseGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await ExerciseGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $project: {
        _id: 0,
        exercise_goal_count: 1,
        exercise_goal_volume: 1,
        exercise_goal_cardio: 1,
        exercise_goal_weight: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 1-2. exercise (real) ----------------------------------------------------------------------------
export const listExercise = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $project: {
        _id: 0,
        exercise_total_volume: 1,
        exercise_total_cardio: 1,
        exercise_total_weight: 1,
        exercise_total_count: {
          $cond: {
            if: {
              $and: [
                {
                  $lte: ["$exercise_total_volume", 1]
                },
                {
                  $eq: ["$exercise_total_cardio", "00:00"]
                }
              ]
            },
            then: "",
            else: "1"
          }
        }
      }
    }
  ]);

  return finalResult[0];
};

// 2-1. food (goal) -------------------------------------------------------------------------------
export const listFoodGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await FoodGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        food_goal_kcal: 1,
        food_goal_carb: 1,
        food_goal_protein: 1,
        food_goal_fat: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 2-2. food (real) -------------------------------------------------------------------------------
export const listFood = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Food.aggregate([
    {
      $match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $project: {
        _id: 0,
        food_total_kcal: 1,
        food_total_carb: 1,
        food_total_protein: 1,
        food_total_fat: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 3-1. money (goal) ------------------------------------------------------------------------------
export const listMoneyGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await MoneyGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $project: {
        _id: 0,
        money_goal_income: 1,
        money_goal_expense: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 3-2. money (real) ------------------------------------------------------------------------------
export const listMoney = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $project: {
        _id: 0,
        money_total_income: 1,
        money_total_expense: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 4-1. sleep (goal) ------------------------------------------------------------------------------
export const listSleepGoal = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $project: {
        _id: 0,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 4-2. sleep (real) ------------------------------------------------------------------------------
export const listSleep = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }
    },
    {
      $project: {
        _id: 0,
        sleep_bedTime: { $arrayElemAt: ["$sleep_section.sleep_bedTime", 0] },
        sleep_wakeTime: { $arrayElemAt: ["$sleep_section.sleep_wakeTime", 0] },
        sleep_sleepTime: { $arrayElemAt: ["$sleep_section.sleep_sleepTime", 0] },
      }
    }
  ]);

  return finalResult[0];
};

// 5-1. property (regDt) ---------------------------------------------------------------------------
export const findPropertyRegDt = async (
  user_id_param: string,
) => {
  const finalResult:any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param
      }
    },
    {
      $project: {
        _id: 0,
        user_regDt: "$user_regDt",
      }
    }
  ]);

  return finalResult[0];
};

// 5-2. property (init) ----------------------------------------------------------------------------
export const findPropertyInit = async (
  user_id_param: string,
) => {
  const finalResult:any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param
      }
    },
    {
      $project: {
        _id: 0,
        user_initProperty: "$user_initProperty",
        user_regDt: "$user_regDt",
      }
    }
  ]);

  return finalResult[0];
};

// 5-3. property (money) ---------------------------------------------------------------------------
export const findPropertyMoney = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $addFields: {
        money_total_income: {
          $toDouble: "$money_total_income"
        },
        money_total_expense: {
          $toDouble: "$money_total_expense"
        }
      }
    },
    {
      $group: {
        _id: null,
        money_total_income: {
          $sum: "$money_total_income"
        },
        money_total_expense: {
          $sum: "$money_total_expense"
        },
      }
    },
    {
      $project: {
        _id: 0,
        money_total_income: 1,
        money_total_expense: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 5-4. property (update) --------------------------------------------------------------------------
export const updateProperty = async (
  user_id_param: string,
  curProperty_param: string,
) => {
  const finalResult:any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_curProperty: curProperty_param,
        user_updateDt: newDate,
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  return finalResult;
};

// 6-1. scale (regDt) -----------------------------------------------------------------------------
export const findScaleRegDt = async (
  user_id_param: string,
) => {
  const finalResult:any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param
      }
    },
    {
      $project: {
        _id: 0,
        user_regDt: "$user_regDt",
      }
    }
  ]);

  return finalResult[0];
};

// 6-2. scale (init) -----------------------------------------------------------------------------
export const findScaleInit = async (
  user_id_param: string,
) => {
  const finalResult:any = await User.aggregate([
    {
      $match: {
        user_id: user_id_param
      }
    },
    {
      $project: {
        _id: 0,
        user_initScale: 1,
        user_regDt: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 6-3. scale (minMax) ---------------------------------------------------------------------------
export const findScaleMinMax = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $addFields: {
        exercise_total_weight: {
          $toDouble: "$exercise_total_weight"
        }
      }
    },
    {
      $group: {
        _id: null,
        scale_min: {
          $min: "$exercise_total_weight"
        },
        scale_max: {
          $max: "$exercise_total_weight"
        },
      }
    },
    {
      $project: {
        _id: 0,
        scale_min: 1,
        scale_max: 1,
      }
    }
  ]);

  return finalResult[0];
};

// 6-4. scale (cur) -----------------------------------------------------------------------------
export const findScaleCur = async (
  user_id_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult:any = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        }
      }
    },
    {
      $sort: {
        exercise_dateEnd: -1,
      }
    },
    {
      $project: {
        _id: 0,
        exercise_total_weight: "$exercise_total_weight",
      }
    }
  ]);

  return finalResult[0];
};

// 6-5. scale (update) -----------------------------------------------------------------------------
export const updateScale = async (
  user_id_param: string,
  curScale_param: string,
) => {
  const finalResult:any = await User.findOneAndUpdate(
    {
      user_id: user_id_param,
    },
    {
      $set: {
        user_curScale: curScale_param,
        user_updateDt: newDate,
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  return finalResult;
};