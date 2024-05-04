// exercisePlanRepository.js

import mongoose from "mongoose";
import {ExercisePlan} from "../schema/ExercisePlan.js";
import {FoodPlan} from "../schema/FoodPlan.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";
import {SleepPlan} from "../schema/SleepPlan.js";
import {Exercise} from "../schema/Exercise.js";
import {Food} from "../schema/Food.js";
import {Money} from "../schema/Money.js";
import {Sleep} from "../schema/Sleep.js";
import {User} from "../schema/User.js";
import {fmtDate} from "../assets/js/date.js";

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = {
  list: async (
    user_id_param
  ) => {
    const finalResult = await User.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$project: {
        _id: 0,
        user_dataset: {
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

// 1-1. list -------------------------------------------------------------------------------------->
export const list = {

  listExercisePlan: async (
    user_id_param, page_param, limit_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
      }},
      {$sort: {
        exercise_plan_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countExercisePlan: async (
    user_id_param
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
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
      {$sort: {
        exercise_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countExercise: async (
    user_id_param
  ) => {
    const finalResult = await Exercise.countDocuments({
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
      {$sort: {
        food_plan_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countFoodPlan: async (
    user_id_param
  ) => {
    const finalResult = await FoodPlan.countDocuments({
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
      {$sort: {
        food_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countFood: async (
    user_id_param
  ) => {
    const finalResult = await Food.countDocuments({
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
      {$sort: {
        money_plan_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countMoneyPlan: async (
    user_id_param
  ) => {
    const finalResult = await MoneyPlan.countDocuments({
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
      {$sort: {
        money_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countMoney: async (
    user_id_param
  ) => {
    const finalResult = await Money.countDocuments({
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
      {$sort: {
        sleep_plan_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countSleepPlan: async (
    user_id_param
  ) => {
    const finalResult = await SleepPlan.countDocuments({
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
      {$sort: {
        sleep_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countSleep: async (
    user_id_param
  ) => {
    const finalResult = await Sleep.countDocuments({
      user_id: user_id_param
    });
    return finalResult;
  }
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = {

  detail: async (
    user_id_param, _id_param
  ) => {

    const finalResult = await User.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      user_id: user_id_param,
    })
    .lean();

    return finalResult;
  }
};

// 3-1. create ------------------------------------------------------------------------------------>
export const save = {

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

  create: async (
    user_id_param, OBJECT_param
  ) => {

    const finalResult = await User.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_pw: OBJECT_param.user_pw,
      user_sex: OBJECT_param.user_sex,
      user_age: OBJECT_param.user_age,
      user_height: OBJECT_param.user_height,
      user_weight: OBJECT_param.user_weight,
      user_email: OBJECT_param.user_email,
      user_phone: OBJECT_param.user_phone,
      user_image: OBJECT_param.user_image,
      user_dataset: OBJECT_param.user_dataset,
      user_regDt: fmtDate,
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
        ...OBJECT_param,
        user_updateDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};

// 4-1. add --------------------------------------------------------------------------------------->
export const add = {

  addExercise: async (
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

  addExercisePlan: async (
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

  addFood: async (
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

  addFoodPlan: async (
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

  addMoney: async (
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

  addMoneyPlan: async (
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

  addSleep: async (
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

  addSleepPlan: async (
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

// 4-2. delete ------------------------------------------------------------------------------------>
export const deletes = {

  deletes: async (
    user_id_param, typeStr_param, typeUpper_param
  ) => {
    const demo = `${typeStr_param}_demo`;
    const finalResult = await eval(typeUpper_param).deleteMany({
      user_id: user_id_param,
      [demo]: true
    });

    return finalResult;
  }
};