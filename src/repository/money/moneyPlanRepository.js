// moneyPlanRepository.js

import mongoose from "mongoose";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await MoneyPlan.countDocuments({
      user_id: user_id_param,
      money_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
      money_plan_date_start: {
        $lte: dateEnd_param,
      },
      money_plan_date_end: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        money_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
        money_plan_date_start: {
          $lte: dateEnd_param,
        },
        money_plan_date_end: {
          $gte: dateStart_param,
        }
      }},
      {$sort: {
        money_plan_date_start: sort_param,
        money_plan_date_end: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_plan_date_end: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_plan_date_end: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      money_plan_demo: false,
      money_plan_date_type: OBJECT_param.money_plan_date_type,
      money_plan_date_start: dateStart_param,
      money_plan_date_end: dateEnd_param,
      money_plan_in: OBJECT_param.money_plan_in,
      money_plan_out: OBJECT_param.money_plan_out,
      money_plan_regDt: newDate,
      money_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        money_plan_date_type: OBJECT_param.money_plan_date_type,
        money_plan_date_start: dateStart_param,
        money_plan_date_end: dateEnd_param,
        money_plan_in: OBJECT_param.money_plan_in,
        money_plan_out: OBJECT_param.money_plan_out,
        money_plan_updateDt: newDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      money_plan_date_end: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await MoneyPlan.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};