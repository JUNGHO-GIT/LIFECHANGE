// moneyPlanRepository.js

import mongoose from "mongoose";
import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";
import {fmtDate} from "../assets/common/date.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  customer_id_param, startDt_param, endDt_param
) => {

  const finalResult = await MoneyPlan.countDocuments({
    customer_id: customer_id_param,
    money_plan_startDt: {
      $lte: endDt_param,
    },
    money_plan_endDt: {
      $gte: startDt_param,
    },
  });

  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  findPlan: async (
    customer_id_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_plan_startDt: {
          $lte: endDt_param,
        },
        money_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$sort: {
        money_plan_startDt: sort_param,
        money_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },
  findReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        customer_id: customer_id_param,
        money_startDt: {
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        money_startDt: "$money_startDt",
        money_endDt: "$money_endDt",
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }}
    ]);
    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      money_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      money_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },
  create: async (
    customer_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.create({
      _id: new mongoose.Types.ObjectId(),
      customer_id: customer_id_param,
      money_plan_startDt: startDt_param,
      money_plan_endDt: endDt_param,
      money_plan_in: OBJECT_param.money_plan_in,
      money_plan_out: OBJECT_param.money_plan_out,
      money_plan_regDt: fmtDate,
      money_plan_updateDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param,
    OBJECT_param
  ) => {
    const finalResult = await MoneyPlan.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...OBJECT_param,
        money_plan_updateDt: fmtDate,
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
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      money_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      money_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    _id_param
  ) => {
    const deleteResult = await MoneyPlan.deleteOne({
      _id: _id_param
    })
    .lean();
    return deleteResult;
  }
};