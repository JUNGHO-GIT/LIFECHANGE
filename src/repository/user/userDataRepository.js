// userRepository.js

import {newDate} from "../../assets/js/date.js";
import {ExerciseGoal} from "../../schema/exercise/ExerciseGoal.js";
import {FoodGoal} from "../../schema/food/FoodGoal.js";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";
import {SleepGoal} from "../../schema/sleep/SleepGoal.js";
import {Exercise} from "../../schema/exercise/Exercise.js";
import {Food} from "../../schema/food/Food.js";
import {Money} from "../../schema/money/Money.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {User} from "../../schema/user/User.js";

// 1-1. category -----------------------------------------------------------------------------------
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
};

// 1-2. list ---------------------------------------------------------------------------------------
export const list = {

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
};

// 2-1. detail -------------------------------------------------------------------------------------
export const detail = async (
  user_id_param
) => {

  const finalResult = await User.findOne({
    user_id: user_id_param,
  })
  .lean();

  return finalResult;
};

// 3-1. save ---------------------------------------------------------------------------------------
export const save = {

  // 1-1. exerciseGoal
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

  // 1-2. exerciseGoal
  saveExerciseGoal: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await ExerciseGoal.insertMany(OBJECT_param);

    console.log(`ExerciseGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 1-3. exercise
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

  // 1-4. exercise
  saveExercise: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Exercise.insertMany(OBJECT_param);

    console.log(`Exercise - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 2-1. foodGoal
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

  // 2-2. foodGoal
  saveFoodGoal: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await FoodGoal.insertMany(OBJECT_param);

    console.log(`FoodGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 2-3. food
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

  // 2-4. food
  saveFood: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Food.insertMany(OBJECT_param);

    console.log(`Food - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 3-1. moneyGoal
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

  // 3-2. moneyGoal
  saveMoneyGoal: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await MoneyGoal.insertMany(OBJECT_param);

    console.log(`MoneyGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 3-3. money
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

  // 3-4. money
  saveMoney: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Money.insertMany(OBJECT_param);

    console.log(`Money - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 4-1. sleepGoal
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

  // 4-2. sleepGoal
  saveSleepGoal: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await SleepGoal.insertMany(OBJECT_param);

    console.log(`SleepGoal - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },

  // 4-3. sleep
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

  // 4-4. sleep
  saveSleep: async (
    user_id_param, OBJECT_param
  ) => {
    const insertResult = await Sleep.insertMany(OBJECT_param);

    console.log(`Sleep - Inserted documents: ${insertResult.length}`);
    return insertResult;
  },
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = {

  // 0. all
  all: async (
    user_id_param
  ) => {
    const finalResult = (
      await ExerciseGoal.deleteMany({
        user_id: user_id_param,
        exercise_goal_dummy: "Y"
      }),
      await Exercise.deleteMany({
        user_id: user_id_param,
        exercise_dummy: "Y"
      }),
      await FoodGoal.deleteMany({
        user_id: user_id_param,
        food_goal_dummy: "Y"
      }),
      await Food.deleteMany({
        user_id: user_id_param,
        food_dummy: "Y"
      }),
      await MoneyGoal.deleteMany({
        user_id: user_id_param,
        money_goal_dummy: "Y"
      }),
      await Money.deleteMany({
        user_id: user_id_param,
        money_dummy: "Y"
      }),
      await SleepGoal.deleteMany({
        user_id: user_id_param,
        sleep_goal_dummy: "Y"
      }),
      await Sleep.deleteMany({
        user_id: user_id_param,
        sleep_dummy: "Y"
      })
    )
  },

  // 1. exerciseGoal
  exerciseGoal: async (
    user_id_param
  ) => {
    const finalResult = await ExerciseGoal.deleteMany({
      user_id: user_id_param,
      exercise_goal_dummy: "Y"
    });
    return finalResult;
  },

  // 2. exercise
  exercise: async (
    user_id_param
  ) => {
    const finalResult = await Exercise.deleteMany({
      user_id: user_id_param,
      exercise_dummy: "Y"
    });
    return finalResult;
  },

  // 3. foodGoal
  foodGoal: async (
    user_id_param
  ) => {
    const finalResult = await FoodGoal.deleteMany({
      user_id: user_id_param,
      food_goal_dummy: "Y"
    });
    return finalResult;
  },

  // 4. food
  food: async (
    user_id_param
  ) => {
    const finalResult = await Food.deleteMany({
      user_id: user_id_param,
      food_dummy: "Y"
    });
    return finalResult;
  },

  // 5. moneyGoal
  moneyGoal: async (
    user_id_param
  ) => {
    const finalResult = await MoneyGoal.deleteMany({
      user_id: user_id_param,
      money_goal_dummy: "Y"
    });
    return finalResult;
  },

  // 6. money
  money: async (
    user_id_param
  ) => {
    const finalResult = await Money.deleteMany({
      user_id: user_id_param,
      money_dummy: "Y"
    });
    return finalResult;
  },

  // 7. sleepGoal
  sleepGoal: async (
    user_id_param
  ) => {
    const finalResult = await SleepGoal.deleteMany({
      user_id: user_id_param,
      sleep_goal_dummy: "Y"
    });
    return finalResult;
  },

  // 8. sleep
  sleep: async (
    user_id_param
  ) => {
    const finalResult = await Sleep.deleteMany({
      user_id: user_id_param,
      sleep_dummy: "Y"
    });
    return finalResult;
  },
};