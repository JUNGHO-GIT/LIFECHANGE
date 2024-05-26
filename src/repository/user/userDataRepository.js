// userRepository.js

import {newDate} from "../../assets/js/date.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";
import {Exercise} from "../../schema/exercise/Exercise.js";
import {Food} from "../../schema/food/Food.js";
import {Money} from "../../schema/money/Money.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
import {User} from "../../schema/user/User.js";

// 1-1. custom ------------------------------------------------------------------------------------>
export const custom = {
  list: async (
    user_id_param
  ) => {
    const finalResult = await User.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$project: {
        _id: 0,
        dataCustom: {
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

// 1-2. list -------------------------------------------------------------------------------------->
export const list = {

  // 1. exercisePlan
  countExercisePlan: async (
    user_id_param
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listExercisePlan: async (
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {exercise_plan_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
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
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {exercise_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },

  // 3. foodPlan
  countFoodPlan: async (
    user_id_param
  ) => {
    const finalResult = await FoodPlan.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listFoodPlan: async (
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {food_plan_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
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
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {food_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },

  // 5. moneyPlan
  countMoneyPlan: async (
    user_id_param
  ) => {
    const finalResult = await MoneyPlan.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listMoneyPlan: async (
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {money_plan_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
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
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {money_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },

  // 7. sleepPlan
  countSleepPlan: async (
    user_id_param
  ) => {
    const finalResult = await SleepPlan.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  },
  listSleepPlan: async (
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {sleep_plan_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
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
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {sleep_dateStart: 1}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  user_id_param, _id_param
) => {

  const finalResult = await User.findOne({
    _id: !_id_param ? {$exists:true} : _id_param,
    user_id: user_id_param,
  })
  .lean();

  return finalResult;
};

// 3-1. save -------------------------------------------------------------------------------------->
export const save = {

  saveExercise: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Exercise.deleteMany({
      user_id: user_id_param,
      exercise_demo: true
    });

    // 데이터 삽입
    const insertResult = await Exercise.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveExercisePlan: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await ExercisePlan.deleteMany({
      user_id: user_id_param,
      exercise_plan_demo: true
    });

    // 데이터 삽입
    const insertResult = await ExercisePlan.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveFood: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Food.deleteMany({
      user_id: user_id_param,
      food_demo: true
    });

    // 데이터 삽입
    const insertResult = await Food.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveFoodPlan: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await FoodPlan.deleteMany({
      user_id: user_id_param,
      food_plan_demo: true
    });

    // 데이터 삽입
    const insertResult = await FoodPlan.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveMoney: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Money.deleteMany({
      user_id: user_id_param,
      money_demo: true
    });

    // 데이터 삽입
    const insertResult = await Money.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveMoneyPlan: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await MoneyPlan.deleteMany({
      user_id: user_id_param,
      money_plan_demo: true
    });

    // 데이터 삽입
    const insertResult = await MoneyPlan.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveSleep: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Sleep.deleteMany({
      user_id: user_id_param,
      sleep_demo: true
    });

    // 데이터 삽입
    const insertResult = await Sleep.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  },

  saveSleepPlan: async (
    user_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await SleepPlan.deleteMany({
      user_id: user_id_param,
      sleep_plan_demo: true
    });

    // 데이터 삽입
    const insertResult = await SleepPlan.insertMany(OBJECT_param);

    // 로그
    console.log('Deleted documents : ' + deleteResult.deletedCount);
    console.log('Inserted documents : ' + insertResult.length);

    return insertResult;
  }
};

// 4-1. deletes ----------------------------------------------------------------------------------->
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