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

  const finalResult = await Sleep.countDocuments({
    user_id: user_id_param,
    sleep_startDt: {
      $gte: startDt_param,
    },
    sleep_endDt: {
      $lte: endDt_param,
    },
  });

  return finalResult;
}

// 1-1. find (real) ------------------------------------------------------------------------------->
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
      $lte: endDt_param
    },
    sleep_endDt: {
      $gte: startDt_param,
      $lte: endDt_param
    }
  })
  .sort({sleep_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 1-2. find (plan) ------------------------------------------------------------------------------->
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
      $gte: startDt_param,
    },
    sleep_plan_endDt: {
      $lte: endDt_param,
    },
  })
  .sort({sleep_plan_startDt: sort_param})
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

  const finalResult = await Sleep.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
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
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  user_id_param,
  SLEEP_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Sleep.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    sleep_startDt: startDt_param,
    sleep_endDt: endDt_param,
    sleep_section: SLEEP_param.sleep_section,
    sleep_regdate: fmtDate,
    sleep_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  SLEEP_param
) => {

  const finalResult = await Sleep.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...SLEEP_param,
      sleep_update: fmtDate,
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

  const updateResult = await Sleep.updateOne(
    {user_id: user_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    },
    {$pull: {
        sleep_section: {
          _id: _id_param
        },
      },
      $set: {
        sleep_update: fmtDate,
      },
    },
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;

  if (updateResult.modifiedCount > 0) {
    const doc = await Sleep.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if ((doc) && (!doc.sleep_section || doc.sleep_section.length === 0)) {
      finalResult = await Sleep.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  };

  return finalResult;
};

