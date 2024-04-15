// workDashRepo.js

import {Work} from "../../schema/real/Work.js";
import {WorkPlan} from "../../schema/plan/WorkPlan.js";

// 1-1. aggregate (weight - plan) ----------------------------------------------------------------->
export const aggregateWeightPlan = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await WorkPlan.aggregate([
    {$match: {
      user_id: user_id_param,
      work_plan_startDt: {
        $gte: startDt_param,
      },
      work_plan_endDt: {
        $lte: endDt_param
      },
    }},
    {$project: {
      _id: 0,
      work_plan_body_weight: 1
    }}
  ]);

  return finalResult;
}

// 1-2. aggregate (weight - real) ----------------------------------------------------------------->
export const aggregateWeightReal = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Work.aggregate([
    {$match: {
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
      },
      work_endDt: {
        $lte: endDt_param
      },
    }},
    {$project: {
      _id: 0,
      work_body_weight: 1
    }}
  ]);

  return finalResult;
};

// 1-3. aggregate (top-part) ---------------------------------------------------------------------->
export const aggregateTopPart = async (
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
    {$unwind: {
      path: "$work_section",
      preserveNullAndEmptyArrays: false
    }},
    {$match: {
      "work_section.work_part_val": {$ne: ""}
    }},
    {$group: {
      _id: "$work_section.work_part_val",
      count: {$sum: 1}
    }},
    {$sort: {count: -1}},
    {$limit: 5}
  ]);

  return finalResult;
};

// 1-4. aggregate (top-title) --------------------------------------------------------------------->
export const aggregateTopTitle = async (
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
    {$unwind: {
      path: "$work_section",
      preserveNullAndEmptyArrays: false
    }},
    {$match: {
      "work_section.work_title_val": {$ne: ""}
    }},
    {$group: {
      _id: "$work_section.work_title_val",
      count: {$sum: 1}
    }},
    {$sort: {count: 1}},
    {$limit: 5}
  ]);

  return finalResult;
}

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

// 2-2. detail (real) ----------------------------------------------------------------------------->
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