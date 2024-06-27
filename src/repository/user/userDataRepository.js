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
  user_id_param, _id_param
) => {

  const finalResult = await User.findOne({
    user_id: user_id_param,
  })
  .lean();

  return finalResult;
};

// 3-1. save ---------------------------------------------------------------------------------------
export const save = {

  saveExercise: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Exercise.deleteMany({
      user_id: user_id_param,
      exercise_dummy: true
    });

    // 데이터 삽입
    const insertResult = await Exercise.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveExerciseGoal: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await ExerciseGoal.deleteMany({
      user_id: user_id_param,
      exercise_goal_dummy: true
    });

    // 데이터 삽입
    const insertResult = await ExerciseGoal.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveFood: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Food.deleteMany({
      user_id: user_id_param,
      food_dummy: true
    });

    // 데이터 삽입
    const insertResult = await Food.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveFoodGoal: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await FoodGoal.deleteMany({
      user_id: user_id_param,
      food_goal_dummy: true
    });

    // 데이터 삽입
    const insertResult = await FoodGoal.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveMoney: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Money.deleteMany({
      user_id: user_id_param,
      money_dummy: true
    });

    // 데이터 삽입
    const insertResult = await Money.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveMoneyGoal: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await MoneyGoal.deleteMany({
      user_id: user_id_param,
      money_goal_dummy: true
    });

    // 데이터 삽입
    const insertResult = await MoneyGoal.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveSleep: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Sleep.deleteMany({
      user_id: user_id_param,
      sleep_dummy: true
    });

    // 데이터 삽입
    const insertResult = await Sleep.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  },

  saveSleepGoal: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await SleepGoal.deleteMany({
      user_id: user_id_param,
      sleep_goal_dummy: true
    });

    // 데이터 삽입
    const insertResult = await SleepGoal.insertMany(OBJECT_param);

    // 로그
    console.log(JSON.stringify(`Deleted documents : ${deleteResult.deletedCount}`));
    console.log(JSON.stringify(`Inserted documents : ${insertResult.length}`));

    return insertResult;
  }
};

// 4-1. deletes ------------------------------------------------------------------------------------
export const deletes = {

  deletes: async (
    user_id_param, _id_param
  ) => {
    const updateResult = await User.updateOne(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$pull: {
        user_section: {
          _id: !_id_param ? {$exists:true} : _id_param
        },
      },
      $set: {
        user_updateDt: newDate,
      }},
      {arrayFilters: [{
        "elem._id": _id_param
      }]}
    )
    .lean();

    let finalResult = null;
    if (updateResult.modifiedCount > 0) {
      const doc = await User.findOne({
        user_id: user_id_param
      })
      .lean();

      if (doc) {
        finalResult = await User.deleteOne({
          _id: doc._id
        })
        .lean();
      }
    };
    return finalResult;
  }
};