// workDashRepo.js

import {Work} from "../../schema/real/Work.js";
import {WorkPlan} from "../../schema/plan/WorkPlan.js";

// 1-1. aggregate (kcal) -------------------------------------------------------------------------->
export const aggregateKcal = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Work.aggregate([
    {$match: {
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$unwind: "$work_section"
    },
    {$group: {
      _id: "$work_section.work_title_val",
      value: {
        $sum: {
          $toDouble: "$work_section.work_kcal"
        }
      }
    }}
  ]);

  return finalResult;
};

// 1-2. aggregate (nut) --------------------------------------------------------------------------->
export const aggregateNut = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Work.aggregate([
    {$match: {
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$project: {
      _id: 0,
      work_total_carb: 1,
      work_total_protein: 1,
      work_total_fat: 1
    }}
  ]);

  return finalResult;
};

// 2-1. detail (plan) ----------------------------------------------------------------------------->
export const detailPlan = async (
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

// 2-2. detail (real) ---------------------------------------------------------------------------->
export const detailReal = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Work.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
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
  .lean();

  return finalResult;
};