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
import {Customer} from "../schema/Customer.js";
import {fmtDate} from "../assets/js/date.js";

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = {
  list: async (
    customer_id_param
  ) => {
    const finalResult = await Customer.aggregate([
      {$match: {
        customer_id: customer_id_param,
      }},
      {$project: {
        _id: 0,
        customer_dataset: {
          diary: 1,
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
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },
  listExerciseReal: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
      }},
      {$sort: {
        exercise_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countExerciseReal: async (
    customer_id_param
  ) => {
    const finalResult = await Exercise.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },

  listFoodPlan: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param
  ) => {
    const finalResult = await FoodPlan.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },
  listFoodReal: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        customer_id: customer_id_param,
      }},
      {$sort: {
        food_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countFoodReal: async (
    customer_id_param
  ) => {
    const finalResult = await Food.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },

  listMoneyPlan: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param
  ) => {
    const finalResult = await MoneyPlan.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },
  listMoneyReal: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
      }},
      {$sort: {
        money_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countMoneyReal: async (
    customer_id_param
  ) => {
    const finalResult = await Money.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },

  listSleepPlan: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
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
    customer_id_param
  ) => {
    const finalResult = await SleepPlan.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  },
  listSleepReal: async (
    customer_id_param, page_param, limit_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        customer_id: customer_id_param,
      }},
      {$sort: {
        sleep_startDt:  1
      }},
      {$skip: (Number(page_param) - 1) * 10},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
  countSleepReal: async (
    customer_id_param
  ) => {
    const finalResult = await Sleep.countDocuments({
      customer_id: customer_id_param
    });
    return finalResult;
  }
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = {

  detail: async (
    customer_id_param, _id_param
  ) => {

    const finalResult = await Customer.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
    })
    .lean();

    return finalResult;
  }
};

// 3-1. create ------------------------------------------------------------------------------------>
export const save = {

  detail: async (
    customer_id_param, _id_param
  ) => {
    const finalResult = await Customer.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
    })
    .lean();

    return finalResult;
  },

  create: async (
    customer_id_param, OBJECT_param
  ) => {

    const finalResult = await Customer.create({
      _id: new mongoose.Types.ObjectId(),
      customer_id: customer_id_param,
      customer_pw: OBJECT_param.customer_pw,
      customer_sex: OBJECT_param.customer_sex,
      customer_age: OBJECT_param.customer_age,
      customer_height: OBJECT_param.customer_height,
      customer_weight: OBJECT_param.customer_weight,
      customer_email: OBJECT_param.customer_email,
      customer_phone: OBJECT_param.customer_phone,
      customer_image: OBJECT_param.customer_image,
      customer_dataset: OBJECT_param.customer_dataset,
      customer_regDt: fmtDate,
      customer_updateDt: "",
    });

    return finalResult;
  },

  update: async (
    customer_id_param, _id_param, OBJECT_param
  ) => {
    const finalResult = await Customer.findOneAndUpdate(
      {customer_id: customer_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        ...OBJECT_param,
        customer_updateDt: fmtDate,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Exercise.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await ExercisePlan.deleteMany({
      customer_id: customer_id_param,
      exercise_plan_demo: true
    });

    // 데이터 삽입
    const insertResult = await ExercisePlan.insertMany(OBJECT_param);
    return insertResult;
  },

  addFood: async (
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Food.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await FoodPlan.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Money.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await MoneyPlan.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await Sleep.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, OBJECT_param
  ) => {
    // 일단 전체 데이터 삭제
    const deleteResult = await SleepPlan.deleteMany({
      customer_id: customer_id_param,
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
    customer_id_param, typeStr_param, typeUpper_param
  ) => {
    const finalResult = await eval(typeUpper_param).deleteMany({
      customer_id: customer_id_param
    });

    return finalResult;
  }
};