// userRepository.js

import mongoose from "mongoose";
import {newDate} from "../../assets/js/date.js";
import {ExerciseGoal} from "../../schema/exercise/ExerciseGoal.js";
import {Exercise} from "../../schema/exercise/Exercise.js";
import {FoodGoal} from "../../schema/food/FoodGoal.js";
import {Food} from "../../schema/food/Food.js";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";
import {Money} from "../../schema/money/Money.js";
import {SleepGoal} from "../../schema/sleep/SleepGoal.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {User} from "../../schema/user/User.js";
import {Verify} from "../../schema/Verify.js";

// 1. email ----------------------------------------------------------------------------------------
export const email = {

  sendEmail: async (
    user_id_param, code_param
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
    user_id_param
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
    user_id_param
  ) => {
    const finalResult = await User.find({
      user_id: user_id_param
    })
    .lean();
    return finalResult;
  },

  signup: async (
    user_id_param, OBJECT_param
  ) => {

    const finalResult = await User.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_google: false,
      user_pw: OBJECT_param.user_pw,
      user_age: OBJECT_param.user_age,
      user_gender: OBJECT_param.user_gender,
      user_height: OBJECT_param.user_height,
      user_weight: OBJECT_param.user_weight,
      user_initProperty: OBJECT_param.user_initProperty,
      user_curProperty: "",
      user_image: OBJECT_param.user_image,
      user_regDt: newDate,
      user_updateDt: "",
    });
    return finalResult;
  },

  login: async (
    user_id_param, user_pw_param
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param,
      user_pw: user_pw_param
    })
    .lean();

    return finalResult;
  },

  detail: async (
    user_id_param, _id_param
  ) => {

    const finalResult = await User.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      user_id: user_id_param,
    })
    .lean();

    return finalResult;
  },

  update: async (
    user_id_param, OBJECT_param
  ) => {
    const finalResult = await User.findOneAndUpdate({
      user_id: user_id_param,
    }, {
      $set: {
        user_gender: OBJECT_param.user_gender,
        user_age: OBJECT_param.user_age,
        user_height: OBJECT_param.user_height,
        user_weight: OBJECT_param.user_weight,
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
    user_id_param
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
  list: async (
    user_id_param
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
    user_id_param, _id_param
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param
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
    user_id_param, _id_param, OBJECT_param
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

  // 1. exerciseGoal
  countExerciseGoal: async (
    user_id_param
  ) => {
    const finalResult = await ExerciseGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listExerciseGoal: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await ExerciseGoal.insertMany(OBJECT_param);

    console.log(`ExerciseGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesExerciseGoal: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await Exercise.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listExercise: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Exercise.insertMany(OBJECT_param);

    console.log(`Exercise - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesExercise: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await FoodGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listFoodGoal: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await FoodGoal.insertMany(OBJECT_param);

    console.log(`FoodGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesFoodGoal: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await Food.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listFood: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Food.insertMany(OBJECT_param);

    console.log(`Food - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesFood: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await MoneyGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listMoneyGoal: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await MoneyGoal.insertMany(OBJECT_param);

    console.log(`MoneyGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesMoneyGoal: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await Money.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listMoney: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Money.insertMany(OBJECT_param);

    console.log(`Money - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesMoney: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await SleepGoal.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listSleepGoal: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await SleepGoal.insertMany(OBJECT_param);

    console.log(`SleepGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesSleepGoal: async (
    user_id_param, OBJECT_param
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
    user_id_param
  ) => {
    const finalResult = await Sleep.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listSleep: async (
    user_id_param, page_param,
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
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Sleep.insertMany(OBJECT_param);

    console.log(`Sleep - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
  deletesSleep: async (
    user_id_param, OBJECT_param
  ) => {
    const deleteResult = await Sleep.deleteMany({
      user_id: user_id_param,
      sleep_dummy: "Y"
    });

    console.log(`Sleep - Deleted documents: ${deleteResult.deletedCount}`);
    return deleteResult;
  },
};