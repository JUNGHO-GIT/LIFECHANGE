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

// 0. category (카테고리 조회) ---------------------------------------------------------------------
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

// 1. percent (퍼센트 조회) ------------------------------------------------------------------------
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
          exercise_goal_scale: 1,
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
          exercise_total_scale: 1,
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

// 2. scale (체중 조회) ----------------------------------------------------------------------------
export const scale = {

  // 2-1. 등록일 조회
  findRegDt: async (
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
          user_regDt: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-2. 최초 체중 조회
  findInitScale: async (
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
  },

  // 2-3. 최소 체중 조회
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
          exercise_total_scale: {
            $toDouble: "$exercise_total_scale"
          }
        }
      },
      {
        $group: {
          _id: null,
          minScale: {
            $min: "$exercise_total_scale"
          },
        }
      },
      {
        $project: {
          _id: 0,
          minScale: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-4. 최대 체중 조회
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
          exercise_total_scale: {
            $toDouble: "$exercise_total_scale"
          }
        }
      },
      {
        $group: {
          _id: null,
          maxScale: {
            $max: "$exercise_total_scale"
          },
        }
      },
      {
        $project: {
          _id: 0,
          maxScale: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-5. 현재 체중 조회
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
          exercise_total_scale: "$exercise_total_scale",
        }
      }
    ]);

    return finalResult[0];
  },

  // 2-5. 현재 체중 업데이트
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
          user_curScale: curScale_param,
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

// 3-1. nutrition ----------------------------------------------------------------------------------
export const nutrition = {

  // 3-1. 등록일 조회
  findRegDt: async (
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
          user_regDt: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 3-2. 전체 정보 갯수 조회
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


  // 3-3. 최초 영양정보 조회
  findInitNutrition: async (
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
          user_initAvgKcalIntake: 1,
          user_regDt: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 3-4. 전체 영양정보 조회
  findAllInformation: async (
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

  // 3-5. 현재 영양정보 업데이트
  updateNutrition: async (
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
          user_totalKcalIntake: totalKcal_param,
          user_totalCarbIntake: totalCarb_param,
          user_totalProteinIntake: totalProtein_param,
          user_totalFatIntake: totalFat_param,
          user_curAvgKcalIntake: curAvgKcal_param,
          user_curAvgCarbIntake: curAvgCarb_param,
          user_curAvgProteinIntake: curAvgProtein_param,
          user_curAvgFatIntake: curAvgFat_param,
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

// 3-2. favorite (즐겨찾기 조회) -------------------------------------------------------------------
export const favorite = {

  // 3-1. 등록일 조회
  findRegDt: async (
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
          user_regDt: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 3-2. 즐겨찾기 조회
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

// 4. property (자산 조회) -------------------------------------------------------------------------
export const property = {

  // 4-1. 등록일 조회
  findRegDt: async (
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
          user_regDt: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 4-2. 최초 자산 조회
  findInitProperty: async (
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
          user_initProperty: 1,
          user_regDt: 1,
        }
      }
    ]);

    return finalResult[0];
  },

  // 4-3. 전체 자산 정보 조회
  findAllInformation: async (
    user_id_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    const allResult:any = await Money.aggregate([
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
        // money_include 상관없이 모두 필터링
        $match: {
          "money_section.money_include": {
            $ne: null
          }
        }
      },
      {
        $group: {
          _id: null,
          // money_part이 "income"인 경우의 수입 합산
          money_total_income: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part", "income"
                  ]
                },
                {
                  $toDouble: "$money_section.money_amount"
                },
                0
              ]
            }
          },
          // money_part이 "expense"인 경우의 지출 합산
          money_total_expense: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part", "expense"
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

    const exclusionResult:any = await Money.aggregate([
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
          // money_part이 "income"인 경우의 수입 합산
          money_total_income: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part", "income"
                  ]
                },
                {
                  $toDouble: "$money_section.money_amount"
                },
                0
              ]
            }
          },
          // money_part이 "expense"인 경우의 지출 합산
          money_total_expense: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$money_section.money_part", "expense"
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
      allResult: allResult[0],
      exclusionResult: exclusionResult[0],
    };
  },

  // 4-4. 현재 자산 업데이트
  updateProperty: async (
    user_id_param: string,
    totalIncomeAll_param: string,
    totalIncomeExclusion_param: string,
    totalExpenseAll_param: string,
    totalExpenseExclusion_param: string,
    curPropertyAll_param: string,
    curPropertyExclusion_param: string,
  ) => {
    const finalResult:any = await User.findOneAndUpdate(
      {
        user_id: user_id_param,
      },
      {
        $set: {
          user_totalIncomeAll: totalIncomeAll_param,
          user_totalIncomeExclusion: totalIncomeExclusion_param,
          user_totalExpenseAll: totalExpenseAll_param,
          user_totalExpenseExclusion: totalExpenseExclusion_param,
          user_curPropertyAll: curPropertyAll_param,
          user_curPropertyExclusion: curPropertyExclusion_param,
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