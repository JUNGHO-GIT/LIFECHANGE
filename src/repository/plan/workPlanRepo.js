// workPlanRepo.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../../schema/real/Work.js";
import {WorkPlan} from "../../schema/plan/WorkPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await WorkPlan.countDocuments({
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDt_param,
    },
    work_plan_endDt: {
      $lte: endDt_param,
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

  const finalResult = await WorkPlan.find({
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDt_param,
    },
    work_plan_endDt: {
      $lte: endDt_param,
    },
  })
  .sort({work_plan_startDt: sort_param})
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

  const finalResult = await Work.find({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    work_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    }
  })
  .sort({work_startDt: sort_param})
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

  const finalResult = await WorkPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    work_plan_endDt: {
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
  WORK_PLAN_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await WorkPlan.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    work_plan_startDt: startDt_param,
    work_plan_endDt: endDt_param,
    work_plan_body_weight: WORK_PLAN_param.work_plan_body_weight,
    work_plan_total_count: WORK_PLAN_param.work_plan_total_count,
    work_plan_cardio_time: WORK_PLAN_param.work_plan_cardio_time,
    work_plan_regdate: fmtDate,
    work_plan_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  WORK_PLAN_param
) => {

  const finalResult = await WorkPlan.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...WORK_PLAN_param,
      work_plan_update: fmtDate,
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

  const updateResult = await WorkPlan.updateOne(
    {_id: _id_param,
      user_id: user_id_param,
      work_plan_startDt: {
        $gte: startDt_param,
      },
      work_plan_endDt: {
        $lte: endDt_param,
      },
    },
    {$set: {
      work_plan_update: fmtDate,
    }},
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;

  if (updateResult.modifiedCount > 0) {
    const doc = await WorkPlan.findOne({
      user_id: user_id_param,
      work_plan_startDt: {
        $gte: startDt_param,
      },
      work_plan_endDt: {
        $lte: endDt_param,
      },
    })
    .lean();

    if (doc) {
      finalResult = await WorkPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return finalResult;
};

