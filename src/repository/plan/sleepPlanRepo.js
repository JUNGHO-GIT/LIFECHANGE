// sleepPlanRepo.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../../schema/real/Sleep.js";
import {SleepPlan} from "../../schema/plan/SleepPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await SleepPlan.countDocuments({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $lte: startDt_param,
    },
    sleep_plan_endDt: {
      $gte: endDt_param,
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

  const finalResult = await SleepPlan.find({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $lte: startDt_param,
    },
    sleep_plan_endDt: {
      $gte: endDt_param,
    },
  })
  .sort({sleep_plan_startDt: sort_param})
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

  const finalResult = await Sleep.find({
    user_id: user_id_param,
    sleep_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    sleep_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    }
  })
  .sort({sleep_startDt: sort_param})
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

  const finalResult = await SleepPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    sleep_plan_startDt: startDt_param,
    sleep_plan_endDt: endDt_param,
  })
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  user_id_param,
  SLEEP_PLAN_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await SleepPlan.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    sleep_plan_startDt: startDt_param,
    sleep_plan_endDt: endDt_param,
    sleep_plan_night: SLEEP_PLAN_param.sleep_plan_night,
    sleep_plan_morning: SLEEP_PLAN_param.sleep_plan_morning,
    sleep_plan_time: SLEEP_PLAN_param.sleep_plan_time,
    sleep_plan_regdate: fmtDate,
    sleep_plan_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  SLEEP_PLAN_param
) => {

  const finalResult = await SleepPlan.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...SLEEP_PLAN_param,
      sleep_plan_update: fmtDate,
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

  const updateResult = await SleepPlan.updateOne(
    {_id: _id_param,
      user_id: user_id_param,
      sleep_plan_startDt: startDt_param,
      sleep_plan_endDt: endDt_param,
    },
    {$set: {
      sleep_plan_update: fmtDate,
    }},
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;

  if (updateResult.modifiedCount > 0) {
    const doc = await SleepPlan.findOne({
      user_id: user_id_param,
      sleep_plan_startDt: startDt_param,
      sleep_plan_endDt: endDt_param,
    })
    .lean();

    if (doc) {
      finalResult = await SleepPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return finalResult;
};

