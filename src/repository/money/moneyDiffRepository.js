// moneyDiffRepository.js

import {Money} from "../../schema/money/Money.js";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = {

  list: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
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

  listPlan: async (
    user_id_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        user_id: user_id_param,
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
  }
};