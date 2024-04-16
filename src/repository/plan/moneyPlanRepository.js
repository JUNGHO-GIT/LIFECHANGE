// moneyPlanRepository.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../../schema/real/Money.js";
import {MoneyPlan} from "../../schema/plan/MoneyPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await MoneyPlan.countDocuments({
    user_id: user_id_param,
    money_plan_startDt: {
      $lte: endDt_param,
    },
    money_plan_endDt: {
      $gte: startDt_param,
    },
  });

  return finalResult;
};

// 1-1. find (plan) ------------------------------------------------------------------------------->
export const findPlan = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param,
  startDt_param,
  endDt_param,
) => {

  const finalResult = await MoneyPlan.find({
    user_id: user_id_param,
    money_plan_startDt: {
      $lte: endDt_param,
    },
    money_plan_endDt: {
      $gte: startDt_param,
    },
  })
  .sort({money_plan_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 1-2. find (real) ------------------------------------------------------------------------------->
export const findReal = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param,
  startDt_param,
  endDt_param,
) => {

  const finalResult = await Money.find({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    money_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    }
  })
  .sort({money_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await MoneyPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    money_plan_startDt: startDt_param,
    money_plan_endDt: endDt_param,
  })
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  user_id_param,
  MONEY_PLAN_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await MoneyPlan.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    money_plan_startDt: startDt_param,
    money_plan_endDt: endDt_param,
    money_plan_in: MONEY_PLAN_param.money_plan_in,
    money_plan_out: MONEY_PLAN_param.money_plan_out,
    money_plan_regdate: fmtDate,
    money_plan_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  MONEY_PLAN_param
) => {

  const finalResult = await MoneyPlan.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...MONEY_PLAN_param,
      money_plan_update: fmtDate,
    }},
    {upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 4-1. delete ------------------------------------------------------------------------------------>
export const deletes = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const updateResult = await MoneyPlan.updateOne(
    {_id: _id_param,
      user_id: user_id_param,
      money_plan_startDt: startDt_param,
      money_plan_endDt: endDt_param,
    },
    {$set: {
      money_plan_update: fmtDate,
    }},
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;

  if (updateResult.modifiedCount > 0) {
    const doc = await MoneyPlan.findOne({
      user_id: user_id_param,
      money_plan_startDt: startDt_param,
      money_plan_endDt: endDt_param,
    })
    .lean();

    if (doc) {
      finalResult = await MoneyPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return finalResult;
};