// moneyPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {MoneyPlan} from "../schema/MoneyPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await MoneyPlan.countDocuments({
    user_id: user_id_param,
    money_plan_start: {
      $lte: endDay,
    },
    money_plan_end: {
      $gte: startDay,
    },
  })
  .sort({money_plan_start: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const findResult = await MoneyPlan.find({
    user_id: user_id_param,
    money_plan_start: {
      $lte: endDay,
    },
    money_plan_end: {
      $gte: startDay,
    },
  })
  .sort({money_plan_start: sort})
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
  money_plan_dur_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const finalResult = await MoneyPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    money_plan_start: startDay,
    money_plan_end: endDay,
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_PLAN_param,
  money_plan_dur_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const findResult = await MoneyPlan.findOne({
    user_id: user_id_param,
    money_plan_start: startDay,
    money_plan_end: endDay,
  })
  .lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      money_plan_start: startDay,
      money_plan_end: endDay,
      money_plan_in: MONEY_PLAN_param.money_plan_in,
      money_plan_out: MONEY_PLAN_param.money_plan_out,
      money_plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      money_plan_update: ""
    };
    finalResult = await MoneyPlan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        money_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    };
    finalResult = await MoneyPlan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  money_plan_dur_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const updateResult = await MoneyPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      money_plan_start: {
        $lte: endDay,
      },
      money_plan_end: {
        $gte: startDay,
      },
    },
    {
      $set: {
        money_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await MoneyPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await MoneyPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
