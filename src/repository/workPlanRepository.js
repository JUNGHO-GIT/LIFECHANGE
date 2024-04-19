// workPlanRepository.js

import mongoose from "mongoose";
import {Work} from "../schema/Work.js";
import {WorkPlan} from "../schema/WorkPlan.js";
import {fmtDate} from "../assets/common/date.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await WorkPlan.countDocuments({
    user_id: user_id_param,
    work_plan_startDt: {
      $lte: endDt_param,
    },
    work_plan_endDt: {
      $gte: startDt_param,
    },
  });

  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  findPlan: async (
    user_id_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await WorkPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        work_plan_startDt: {
          $lte: endDt_param,
        },
        work_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$sort: {
        work_plan_startDt: sort_param,
        work_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },

  findReal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $lte: endDt_param,
        },
        work_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        work_startDt: "$work_startDt",
        work_endDt: "$work_endDt",
        work_total_count: "$work_total_count",
        work_total_volume: "$work_total_volume",
        work_total_cardio: "$work_total_cardio",
        work_body_weight: "$work_body_weight",
      }}
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param, user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await WorkPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_plan_startDt: startDt_param,
      work_plan_endDt: endDt_param,
    });
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  find: async (
    _id_param, user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await WorkPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_plan_startDt: startDt_param,
      work_plan_endDt: endDt_param,
    });
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {

    const finalResult = await WorkPlan.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_plan_startDt: startDt_param,
      work_plan_endDt: endDt_param,
      work_plan_count: OBJECT_param.work_plan_count,
      work_plan_volume: OBJECT_param.work_plan_volume,
      work_plan_cardio: OBJECT_param.work_plan_cardio,
      work_plan_weight: OBJECT_param.work_plan_weight,
      work_plan_regDt: fmtDate,
      work_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    _id_param, OBJECT_param
  ) => {
    const finalResult = await WorkPlan.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...OBJECT_param,
        work_plan_updateDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();
    return finalResult;
  }
};

// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {

  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await WorkPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_plan_startDt: startDt_param,
      work_plan_endDt: endDt_param,
    })
    .lean();

    return finalResult;
  },

  deletes: async (
    _id_param
  ) => {
    const deleteResult = await WorkPlan.deleteOne({
      _id: _id_param
    })
    .lean();

    return deleteResult;
  }
};