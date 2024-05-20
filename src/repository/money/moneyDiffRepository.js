// moneyDiffRepository.js

import {Money} from "../../schema/money/Money.js";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";

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
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_date_type: !dateType_param ? {$exists:false} : dateType_param,
        money_date_start: {
          $lte: dateEnd_param,
        },
        money_date_end: {
          $gte: dateStart_param
        }
      }},
      {$project: {
        _id: 1,
        money_date_type: "$money_date_type",
        money_date_start: "$money_date_start",
        money_date_end: "$money_date_end",
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }}
    ]);
    return finalResult;
  },

  listPlan: async (
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