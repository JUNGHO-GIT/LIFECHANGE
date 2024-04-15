// moneyDashRepo.js

import {Money} from "../../schema/real/Money.js";
import {MoneyPlan} from "../../schema/plan/MoneyPlan.js";

// 1-1. aggregate (in) ---------------------------------------------------------------------------->
export const aggregateIn = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Money.aggregate([
    {$match: {
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$unwind: "$money_section"
    },
    {$match: {
      "money_section.money_part_val": "수입"
    }},
    {$group: {
      _id: "$money_section.money_title_val",
      value: {
        $sum: "$money_section.money_amount"
      }
    }},
    {$sort: {value: -1}},
    {$limit: 5}
  ]);

  return finalResult;
};

// 1-2. aggregate (out) --------------------------------------------------------------------------->
export const aggregateOut = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Money.aggregate([
    {$match: {
      user_id: user_id_param,
      money_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      money_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$unwind: "$money_section"
    },
    {$match: {
      "money_section.money_part_val": "지출"
    }},
    {$group: {
      _id: "$money_section.money_title_val",
      value: {
        $sum: "$money_section.money_amount"
      }
    }},
    {$sort: {value: -1}},
    {$limit: 10}
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

  const finalResult = await MoneyPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    money_plan_endDt: {
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

  const finalResult = await Money.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
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
  .lean();

  return finalResult;
};