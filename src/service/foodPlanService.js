// foodPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";

// 1-1. compare ----------------------------------------------------------------------------------->
export const compare = async (
  user_id_param,
  food_dur_param,
  food_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDayReal, endDayReal] = food_dur_param.split(` ~ `);
  const [startDayPlan, endDayPlan] = food_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResultReal = await Food.find({
    user_id: user_id_param,
    food_startDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    },
    food_endDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    }
  })
  .sort({food_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const findResultPlan = await FoodPlan.find({
    user_id: user_id_param,
    food_plan_startDt: {
      $lte: endDayPlan,
    },
    food_plan_endDt: {
      $gte: startDayPlan,
    },
  })
  .sort({food_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await FoodPlan.countDocuments({
    user_id: user_id_param,
    food_plan_startDt: {
      $lte: endDayPlan,
    },
    food_plan_endDt: {
      $gte: startDayPlan,
    },
  });

  const finalResult = findResultPlan.map((plan) => {
    const matches = findResultReal.filter((real) => (
      real && plan &&
      real.food_startDt && real.food_endDt &&
      plan.food_plan_startDt && plan.food_plan_endDt &&
      real.food_startDt <= plan.food_plan_endDt &&
      real.food_endDt >= plan.food_plan_startDt
    ));
    const totalKcal = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_kcal || "0")
    ), 0);
    const totalCarb = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_carb || "0")
    ), 0);
    const totalProtein = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_protein || "0")
    ), 0);
    const totalFat = matches.reduce((sum, curr) => (
      sum + parseFloat(curr.food_total_fat || "0")
    ), 0);

    return {
      ...plan,
      food_kcal: totalKcal,
      food_carb: totalCarb,
      food_protein: totalProtein,
      food_fat: totalFat,
    };
  });

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 1-2. list -------------------------------------------------------------------------------------->
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

  const findResult = await FoodPlan.find({
    user_id: user_id_param,
    food_plan_startDt: {
      $lte: endDay,
    },
    food_plan_endDt: {
      $gte: startDay,
    },
  })
  .sort({food_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await FoodPlan.countDocuments({
    user_id: user_id_param,
    food_plan_startDt: {
      $lte: endDay,
    },
    food_plan_endDt: {
      $gte: startDay,
    },
  });

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
    food_plan_startDt: startDay,
    food_plan_endDt: endDay
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

  const findResult = await FoodPlan.findOne({
    user_id: user_id_param,
    food_plan_startDt: startDay,
    food_plan_endDt: endDay
  })
  .lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_plan_startDt: startDay,
      food_plan_endDt: endDay,
      food_plan_kcal: FOOD_PLAN_param.food_plan_kcal,
      food_plan_carb: FOOD_PLAN_param.food_plan_carb,
      food_plan_protein: FOOD_PLAN_param.food_plan_protein,
      food_plan_fat: FOOD_PLAN_param.food_plan_fat,
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
      food_plan_startDt: {
        $lte: endDay,
      },
      food_plan_endDt: {
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
