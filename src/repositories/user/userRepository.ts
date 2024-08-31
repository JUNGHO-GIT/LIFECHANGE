// userRepository.ts

import mongoose from "mongoose";
import { newDate } from "@assets/scripts/date";
import { ExerciseGoal } from "@schemas/exercise/ExerciseGoal";
import { Exercise } from "@schemas/exercise/Exercise";
import { FoodGoal } from "@schemas/food/FoodGoal";
import { Food } from "@schemas/food/Food";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { Money } from "@schemas/money/Money";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { Sleep } from "@schemas/sleep/Sleep";
import { User } from "@schemas/user/User";
import { Verify } from "@schemas/Verify";

// 1. email ----------------------------------------------------------------------------------------
export const email = {

  findId: async (
    user_id_param: string
  ) => {

    const finalResult = await User.findOne({
      user_id: user_id_param
    })
    .lean();

    return finalResult;
  },

  sendEmail: async (
    user_id_param: string,
    code_param: string
  ) => {

    const findResult = await Verify.findOne({
      verify_id: user_id_param
    })
    .lean();

    if (findResult !== null) {
      await Verify.deleteMany({
        verify_id: user_id_param
      });
    }

    const finalResult = await Verify.create({
      verify_id: user_id_param,
      verify_code: code_param,
      verify_regDt: newDate
    });

    return finalResult;
  },

  verifyEmail: async (
    user_id_param: string,
  ) => {

    const finalResult = await Verify.findOne({
      verify_id: user_id_param
    })
    .lean();

    return finalResult;
  }
};

// 2. user -----------------------------------------------------------------------------------------
export const user = {

  checkId: async (
    user_id_param: string
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param
    })
    .lean();
    return finalResult;
  },

  signup: async (
    user_id_param: string,
    OBJECT_param: Record<string, any>,
  ) => {

    const finalResult = await User.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_google: "N",
      user_token: OBJECT_param.user_token,
      user_pw: OBJECT_param.user_pw,
      user_age: OBJECT_param.user_age,
      user_gender: OBJECT_param.user_gender,
      user_initScale: OBJECT_param.user_initScale,
      user_curScale: "",
      user_initProperty: OBJECT_param.user_initProperty,
      user_curProperty: "",
      user_image: OBJECT_param.user_image,
      user_regDt: newDate,
      user_updateDt: "",
    });
    return finalResult;
  },

  resetPw: async (
    user_id_param: string,
    OBJECT_param: Record<string, any>,
  ) => {

    const finalResult = await User.findOneAndUpdate({
      user_id: user_id_param,
    }, {
      $set: {
        user_token: OBJECT_param.user_token,
        user_pw: OBJECT_param.user_pw,
      },
    }, {
      new: true,
    });

    return finalResult;
  },

  login: async (
    user_id_param: string,
    user_pw_param: string,
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param,
      user_pw: user_pw_param
    })
    .lean();

    return finalResult;
  },

  detail: async (
    user_id_param: string,
  ) => {

    const finalResult = await User.findOne({
      user_id: user_id_param,
    })
    .lean();

    return finalResult;
  },

  update: async (
    user_id_param: string,
    OBJECT_param: Record<string, any>,
  ) => {
    const finalResult = await User.findOneAndUpdate({
      user_id: user_id_param,
    }, {
      $set: {
        user_gender: OBJECT_param.user_gender,
        user_age: OBJECT_param.user_age,
        user_initScale: OBJECT_param.user_initScale,
        user_curScale: OBJECT_param.user_curScale,
        user_initProperty: OBJECT_param.user_initProperty,
        user_curProperty: OBJECT_param.user_curProperty,
        user_image: OBJECT_param.user_image,
      },
    }, {
      new: true,
    });

    return finalResult;
  },

  deletes: async (
    user_id_param: string,
  ) => {
    const finalResult =
      await ExerciseGoal.deleteMany({
        user_id: user_id_param
      })
      await Exercise.deleteMany({
        user_id: user_id_param
      })
      await FoodGoal.deleteMany({
        user_id: user_id_param
      })
      await Food.deleteMany({
        user_id: user_id_param
      })
      await MoneyGoal.deleteMany({
        user_id: user_id_param
      })
      await Money.deleteMany({
        user_id: user_id_param
      })
      await SleepGoal.deleteMany({
        user_id: user_id_param
      })
      await Sleep.deleteMany({
        user_id: user_id_param
      })
      await User.deleteOne({
        user_id: user_id_param
      })

    return finalResult;
  }
};

// 3. category -------------------------------------------------------------------------------------
export const category = {
  listReal: async (
    user_id_param: string,
  ) => {
    const finalResult = await User.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$project: {
        _id: 0,
        dataCategory: {
          calendar: 1,
          food: 1,
          money: 1,
          exercise: 1,
          sleep: 1,
        }
      }}
    ]);
    return finalResult[0];
  },

  detail: async (
    user_id_param: string,
    _id_param: string,
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param: string,
    OBJECT_param: Record<string, any>,
  ) => {
    const finalResult = await User.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_google: OBJECT_param.user_google,
      user_pw: OBJECT_param.user_pw,
      user_image: OBJECT_param.user_image,
      dataCategory: OBJECT_param.dataCategory,
      user_regDt: newDate,
      user_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param: string,
    _id_param: string,
    OBJECT_param: Record<string, any>,
  ) => {
    const finalResult = await User.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        dataCategory: OBJECT_param.dataCategory,
        user_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4-1. dummy --------------------------------------------------------------------------------------
export const dummy = {

  // 0. all
  deletesAll: async (
    user_id_param: string,
  ) => {
    const finalResult =
    await ExerciseGoal.deleteMany({
      user_id: user_id_param,
      exercise_goal_dummy: "Y"
    })
    await Exercise.deleteMany({
      user_id: user_id_param,
      exercise_dummy: "Y"
    })
    await FoodGoal.deleteMany({
      user_id: user_id_param,
      food_goal_dummy: "Y"
    })
    await Food.deleteMany({
      user_id: user_id_param,
      food_dummy: "Y"
    })
    await MoneyGoal.deleteMany({
      user_id: user_id_param,
      money_goal_dummy: "Y"
    })
    await Money.deleteMany({
      user_id: user_id_param,
      money_dummy: "Y"
    })
    await SleepGoal.deleteMany({
      user_id: user_id_param,
      sleep_goal_dummy: "Y"
    })
    await Sleep.deleteMany({
      user_id: user_id_param,
      sleep_dummy: "Y"
    })

    return finalResult;
  },

  // 1. exerciseGoal
  countExerciseGoal: async (
    user_id_param: string,
  ) => {
    const finalResult = await ExerciseGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listExerciseGoal: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {exercise_goal_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveExerciseGoal: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await ExerciseGoal.insertMany(OBJECT_param);

    console.log(`ExerciseGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesExerciseGoal: async (
    user_id_param: string,
  ) => {
    const deleteResult = await ExerciseGoal.deleteMany({
      user_id: user_id_param,
      exercise_goal_dummy: "Y"
    });

    console.log(`ExerciseGoal - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 2. exercise
  countExercise: async (
    user_id_param: string,
  ) => {
    const finalResult = await Exercise.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listExercise: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {exercise_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveExercise: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await Exercise.insertMany(OBJECT_param);

    console.log(`Exercise - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesExercise: async (
    user_id_param: string,
  ) => {
    const deleteResult = await Exercise.deleteMany({
      user_id: user_id_param,
      exercise_dummy: "Y"
    });

    console.log(`Exercise - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 3. foodGoal
  countFoodGoal: async (
    user_id_param: string,
  ) => {
    const finalResult = await FoodGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listFoodGoal: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await FoodGoal.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {food_goal_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveFoodGoal: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await FoodGoal.insertMany(OBJECT_param);

    console.log(`FoodGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesFoodGoal: async (
    user_id_param: string,
  ) => {
    const deleteResult = await FoodGoal.deleteMany({
      user_id: user_id_param,
      food_goal_dummy: "Y"
    });

    console.log(`FoodGoal - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 4. food
  countFood: async (
    user_id_param: string,
  ) => {
    const finalResult = await Food.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listFood: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {food_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveFood: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await Food.insertMany(OBJECT_param);

    console.log(`Food - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesFood: async (
    user_id_param: string,
  ) => {
    const deleteResult = await Food.deleteMany({
      user_id: user_id_param,
      food_dummy: "Y"
    });

    console.log(`Food - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 5. moneyGoal
  countMoneyGoal: async (
    user_id_param: string,
  ) => {
    const finalResult = await MoneyGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listMoneyGoal: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await MoneyGoal.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {money_goal_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveMoneyGoal: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await MoneyGoal.insertMany(OBJECT_param);

    console.log(`MoneyGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesMoneyGoal: async (
    user_id_param: string,
  ) => {
    const deleteResult = await MoneyGoal.deleteMany({
      user_id: user_id_param,
      money_goal_dummy: "Y"
    });

    console.log(`MoneyGoal - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 6. money
  countMoney: async (
    user_id_param: string,
  ) => {
    const finalResult = await Money.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listMoney: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {money_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveMoney: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await Money.insertMany(OBJECT_param);

    console.log(`Money - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesMoney: async (
    user_id_param: string,
  ) => {
    const deleteResult = await Money.deleteMany({
      user_id: user_id_param,
      money_dummy: "Y"
    });

    console.log(`Money - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 7. sleepGoal
  countSleepGoal: async (
    user_id_param: string,
  ) => {
    const finalResult = await SleepGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listSleepGoal: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await SleepGoal.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {sleep_goal_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveSleepGoal: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await SleepGoal.insertMany(OBJECT_param);

    console.log(`SleepGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesSleepGoal: async (
    user_id_param: string,
  ) => {
    const deleteResult = await SleepGoal.deleteMany({
      user_id: user_id_param,
      sleep_goal_dummy: "Y"
    });

    console.log(`SleepGoal - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },

  // 8. sleep
  countSleep: async (
    user_id_param: string,
  ) => {
    const finalResult = await Sleep.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listSleep: async (
    user_id_param: string,
    page_param: number,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {sleep_dateStart: 1}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
  saveSleep: async (
    OBJECT_param: Record<string, any>,
  ) => {
    const insertResult = await Sleep.insertMany(OBJECT_param);

    console.log(`Sleep - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesSleep: async (
    user_id_param: string,
  ) => {
    const deleteResult = await Sleep.deleteMany({
      user_id: user_id_param,
      sleep_dummy: "Y"
    });

    console.log(`Sleep - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },
};