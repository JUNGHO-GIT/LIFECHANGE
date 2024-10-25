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

// 0. category -------------------------------------------------------------------------------------
export const listCategory = async (
  user_id_param: string
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
        calendar: "$user_dataCategory.calendar",
        exercise: "$user_dataCategory.exercise",
        food: "$user_dataCategory.food",
        money: "$user_dataCategory.money",
        sleep: "$user_dataCategory.sleep",
      }
    }
  ]);

  return finalResult[0];
};

// 1. percent --------------------------------------------------------------------------------------
export const percent = {

  // 1-1. exercise (goal)
  listExerciseGoal: async (
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

    return finalResult;
  },

  // 1-2. exercise (real)
  listExercise: async (
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

    return finalResult;
  },

  // 2-1. food (goal)
  listFoodGoal: async (
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

    return finalResult;
  },

  // 2-2. food (real)
  listFood: async (
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

    return finalResult;
  },

  // 3-1. money (goal)
  listMoneyGoal: async (
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

    return finalResult;
  },

  // 3-2. money (real)
  listMoney: async (
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

    return finalResult;
  },

  // 4-1. sleep (goal)
  listSleepGoal: async (
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

    return finalResult;
  },

  // 4-2. sleep (real)
  listSleep: async (
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

    return finalResult;
  },
};

// 2. scale ----------------------------------------------------------------------------------------
export const scale = {

  // 2-1. scale (regDt)
  findScaleRegDt: async (
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
  },

  // 2-2. scale (init)
  findScaleInit: async (
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
          user_initScale: "$user_exercise.user_initScale",
          user_regDt: "$user_regDt",
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-3. scale (min)
  findMinScale: async (
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
        }
      },
      {
        $project: {
          _id: 0,
          scale_min: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-4. scale (max)
  findMaxScale: async (
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
          scale_max: {
            $max: "$exercise_total_weight"
          },
        }
      },
      {
        $project: {
          _id: 0,
          scale_max: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-5. scale (cur)
  findCurScale: async (
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
  },

  // 2-5. scale (update)
  updateScale: async (
    user_id_param: string,
    curScale_param: string,
  ) => {
    const finalResult:any = await User.findOneAndUpdate(
      {
        user_id: user_id_param,
      },
      {
        $set: {
          user_exercise: {
            user_curScale: curScale_param,
          },
          user_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    return finalResult;
  }
};

// 3-1. kcal ---------------------------------------------------------------------------------------
export const kcal = {

  // 3-1. kcal (regDt)
  findKcalRegDt: async (
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
  },

  // 3-2. totalCnt
  findTotalCnt: async (
    user_id_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    // 데이터중 값이 있는 것만 카운트
    const finalResult:any = await Food.countDocuments(
      {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        "food_section.food_kcal": {
          $ne: ""
        }
      }
    );

    return finalResult;
  },


  // 3-3. kcal (init)
  findKcalInit: async (
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
          user_initAvgKcal: "$user_food.user_initAvgKcal",
          user_regDt: "$user_regDt",
        }
      }
    ]);

    return finalResult[0];
  },

  // 3-4. nutrition
  findNutrition: async (
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
        $unwind: "$food_section"
      },
      {
        $group: {
          _id: null,
          food_total_kcal: {
            $sum: {
              $toDouble: "$food_section.food_kcal"
            }
          },
          food_total_carb: {
            $sum: {
              $toDouble: "$food_section.food_carb"
            }
          },
          food_total_protein: {
            $sum: {
              $toDouble: "$food_section.food_protein"
            }
          },
          food_total_fat: {
            $sum: {
              $toDouble: "$food_section.food_fat"
            }
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
  },

  // 3-5. kcal (update)
  updateKcal: async (
    user_id_param: string,
    totalKcal_param: string,
    totalCarb_param: string,
    totalProtein_param: string,
    totalFat_param: string,
    curAvgKcal_param: string,
    curAvgCarb_param: string,
    curAvgProtein_param: string,
    curAvgFat_param: string,
  ) => {
    const finalResult:any = await User.findOneAndUpdate(
      {
        user_id: user_id_param,
      },
      {
        $set: {
          user_food: {
            user_totalKcal: totalKcal_param,
            user_totalCarb: totalCarb_param,
            user_totalProtein: totalProtein_param,
            user_totalFat: totalFat_param,
            user_curAvgKcal: curAvgKcal_param,
            user_curAvgCarb: curAvgCarb_param,
            user_curAvgProtein: curAvgProtein_param,
            user_curAvgFat: curAvgFat_param,
          },
          user_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    return finalResult;
  }
};

// 3-2. favorite -----------------------------------------------------------------------------------
export const favorite = {

  // 3-1. favorite (regDt)
  findFavoriteRegDt: async (
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
  },

  // 3-2. favorite
  findFavorite: async (
    user_id_param: string,
  ) => {

    const finalResult: any = await User.aggregate([
      {
        $match: {
          user_id: user_id_param,
        },
      },
      {
        $project: {
          _id: 0,
          "user_favorite._id": 0,
        },
      },
    ]);

    return finalResult[0].user_favorite;
  }
};

// 4. property -------------------------------------------------------------------------------------
export const property = {

  // 4-1. property (regDt)
  findPropertyRegDt: async (
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
  },

  // 4-2. property (init)
  findPropertyInit: async (
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
          user_initProperty: "$user_money.user_initProperty",
          user_regDt: "$user_regDt",
        }
      }
    ]);

    return finalResult[0];
  },

  // 4-3. property (money)
  findPropertyMoney: async (
    user_id_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const incomeOrExpenseIncludeResult:any = await Money.aggregate([
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
        $unwind: "$money_section"
      },
      {
        // money_include가 "Y"인 경우만 필터링
        $match: {
          "money_section.money_include": {
            $eq: "Y"
          }
        }
      },
      {
        $group: {
          _id: null,
          // money_part_idx가 1인 경우의 수입 합산
          money_total_income: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part_idx", 1
                  ]
                },
                {
                  $toDouble: "$money_section.money_amount"
                },
                0
              ]
            }
          },
          // money_part_idx가 2인 경우의 지출 합산
          money_total_expense: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part_idx", 2
                  ]
                },
                {
                  $toDouble: "$money_section.money_amount"
                },
                0
              ]
            }
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

    const incomeOrExpenseExcludeResult:any = await Money.aggregate([
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
        $unwind: "$money_section"
      },
      {
        // money_include가 "N"인 경우만 필터링
        $match: {
          "money_section.money_include": {
            $eq: "N"
          }
        }
      },
      {
        $group: {
          _id: null,
          // money_part_idx가 1인 경우의 수입 합산
          money_total_income: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part_idx", 1
                  ]
                },
                {
                  $toDouble: "$money_section.money_amount"
                },
                0
              ]
            }
          },
          // money_part_idx가 2인 경우의 지출 합산
          money_total_expense: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part_idx", 2
                  ]
                },
                {
                  $toDouble: "$money_section.money_amount"
                },
                0
              ]
            }
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

    return {
      includeResult: incomeOrExpenseIncludeResult[0],
      excludeResult: incomeOrExpenseExcludeResult[0],
    };
  },

  // 4-4. property (update)
  updateProperty: async (
    user_id_param: string,
    totalIncomeInclude_param: string,
    totalIncomeExclude_param: string,
    totalExpenseInclude_param: string,
    totalExpenseExclude_param: string,
    curPropertyInclude_param: string,
    curPropertyExclude_param: string,
  ) => {
    const finalResult:any = await User.findOneAndUpdate(
      {
        user_id: user_id_param,
      },
      {
        $set: {
          user_money: {
            user_totalIncomeInclude: totalIncomeInclude_param,
            user_totalIncomeExclude: totalIncomeExclude_param,
            user_totalExpenseInclude: totalExpenseInclude_param,
            user_totalExpenseExclude: totalExpenseExclude_param,
            user_curPropertyInclude: curPropertyInclude_param,
            user_curPropertyExclude: curPropertyExclude_param,
          },
          user_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    );

    return finalResult;
  }
};