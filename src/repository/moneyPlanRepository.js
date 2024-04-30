// moneyPlanRepository.js

import mongoose from "mongoose";
import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";
import {fmtDate} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
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
  },

  listPlan: async (
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

  listReal: async (
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
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
      customer_id: customer_id_param,
      _id: new mongoose.Types.ObjectId(),
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
    customer_id_param, _id_param, OBJECT_param,startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOneAndUpdate(
      {customer_id: customer_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        money_plan_startDt: startDt_param,
        money_plan_endDt: endDt_param,
        money_plan_in: OBJECT_param.money_plan_in,
        money_plan_out: OBJECT_param.money_plan_out,
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
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
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
    customer_id_param, _id_param
  ) => {
    const deleteResult = await MoneyPlan.deleteOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};