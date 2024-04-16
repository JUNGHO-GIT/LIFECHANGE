// sleepDashRepository.js

import {Sleep} from "../../schema/real/Sleep.js";
import {SleepPlan} from "../../schema/plan/SleepPlan.js";

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