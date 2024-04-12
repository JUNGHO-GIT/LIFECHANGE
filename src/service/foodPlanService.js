// foodPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {FoodPlan} from "../schema/FoodPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  food_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = food_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await FoodPlan.countDocuments({
    user_id: user_id_param,
    food_plan_start: {
      $lte: endDay,
    },
    food_plan_end: {
      $gte: startDay,
    },
  });

  const findResult = await FoodPlan.find({
    user_id: user_id_param,
    food_plan_start: {
      $lte: endDay,
    },
    food_plan_end: {
      $gte: startDay,
    },
  })
  .sort({food_plan_start: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  return {
    totalCnt: totalCnt,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  food_plan_dur_param
) => {

  const [startDay, endDay] = food_plan_dur_param.split(` ~ `);

  const finalResult = await FoodPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    food_plan_start: {
      $lte: endDay,
    },
    food_plan_end: {
      $gte: startDay,
    }
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  FOOD_PLAN_param,
  food_plan_dur_param
) => {

  const [startDay, endDay] = food_plan_dur_param.split(` ~ `);

  let finalResult;

  const findResult = await FoodPlan.findOne({
    user_id: user_id_param,
    food_plan_start: {
      $lte: endDay,
    },
    food_plan_end: {
      $gte: startDay,
    }
  })
  .lean();

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_plan_start: startDay,
      food_plan_end: endDay,
      food_plan_kcal: FOOD_PLAN_param.food_plan_kcal,
      food_plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      food_plan_update: ""
    };
    finalResult = await FoodPlan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        food_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    };
    finalResult = await FoodPlan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  food_plan_dur_param
) => {

  const [startDay, endDay] = food_plan_dur_param.split(` ~ `);

  const updateResult = await FoodPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      food_plan_start: {
        $lte: endDay,
      },
      food_plan_end: {
        $gte: startDay,
      },
    },
    {
      $set: {
        food_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  )
  .lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await FoodPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await FoodPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
