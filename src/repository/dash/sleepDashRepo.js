// sleepDashRepo.js

import moment from "moment";
import {Sleep} from "../../schema/real/Sleep.js";
import {SleepPlan} from "../../schema/plan/SleepPlan.js";

// 1-1. aggregate (kcal) -------------------------------------------------------------------------->
export const aggregateKcal = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Sleep.aggregate([
    {$match: {
      user_id: user_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$unwind: "$sleep_section"
    },
    {$group: {
      _id: "$sleep_section.sleep_title_val",
      value: {
        $sum: {
          $toDouble: "$sleep_section.sleep_kcal"
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

  const finalResult = await Sleep.aggregate([
    {$match: {
      user_id: user_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$project: {
      _id: 0,
      sleep_total_carb: 1,
      sleep_total_protein: 1,
      sleep_total_fat: 1
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

  const finalResult = await SleepPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    sleep_plan_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    sleep_plan_endDt: {
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