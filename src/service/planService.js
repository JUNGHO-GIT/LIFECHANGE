// planService.js

import mongoose from "mongoose";
import moment from "moment";
import {Plan} from "../schema/Plan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  filter_param,
  paging_param
) => {

  const schema = filter_param.schema || "전체";
  const part = filter_param.part || "전체";
  const sort = filter_param.order === "asc" ? 1 : -1;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const page = paging_param.page === 0 ? 1 : paging_param.page;

  const findResult = await Plan.find({
    user_id: user_id_param,
    plan_schema: schema,
  })
  .sort({ plan_date: sort })
  .lean();

  return {
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  plan_dur_param,
  plan_schema_param
) => {

  const finalResult = await Plan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    plan_dur: plan_dur_param,
    plan_schema: plan_schema_param,
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  PLAN_param,
  plan_dur_param,
  plan_schema_param
) => {

  let finalResult;
  let schema;

  if (plan_schema_param === "food") {
    schema = {
      plan_food: {
        plan_kcal: PLAN_param.plan_food.plan_kcal
      },
    };
  }

  if (plan_schema_param === "money") {
    schema = {
      plan_money: {
        plan_in: PLAN_param.plan_money.plan_in,
        plan_out: PLAN_param.plan_money.plan_out,
      },
    };
  }

  if (plan_schema_param === "sleep") {
    schema = {
      plan_sleep: {
        plan_night: PLAN_param.plan_sleep.plan_night,
        plan_morning: PLAN_param.plan_sleep.plan_morning,
        plan_time: PLAN_param.plan_sleep.plan_time,
      },
    };
  }

  if (plan_schema_param === "work") {
    schema = {
      plan_work: {
        plan_count_total: PLAN_param.plan_work.plan_count_total,
        plan_cardio_time: PLAN_param.plan_work.plan_cardio_time,
        plan_score_name: PLAN_param.plan_work.plan_score_name,
        plan_score_kg: PLAN_param.plan_work.plan_score_kg,
        plan_score_rep: PLAN_param.plan_work.plan_score_rep,
      },
    };
  }

  const findResult = await Plan.findOne({
    user_id: user_id_param,
    plan_schema: PLAN_param.plan_schema,
    plan_dur: plan_dur_param,
  })
    .lean();

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      plan_schema: PLAN_param.plan_schema,
      plan_dur: plan_dur_param,
      ...schema,
      plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      plan_update: ""
    };
    finalResult = await Plan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        ...schema,
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    };
    finalResult = await Plan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  plan_dur_param,
  plan_schema_param
) => {

  const updateResult = await Plan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      plan_dur: plan_dur_param,
      plan_schema: plan_schema_param,
    },
    {
      $set: {
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await Plan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await Plan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
