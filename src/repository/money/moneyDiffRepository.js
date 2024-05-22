// moneyDiffRepository.js

import {Money} from "../../schema/money/Money.js";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await MoneyPlan.countDocuments({
      user_id: user_id_param,
      money_plan_dateStart: {
        $lte: dateEnd_param,
      },
      money_plan_dateEnd: {
        $gte: dateStart_param,
      },
      ...(dateType_param === "전체" ? {} : {
        money_plan_dateType: dateType_param
      }),
    });
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
        money_plan_dateStart: {
          $lte: dateEnd_param,
        },
        money_plan_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === "전체" ? {} : {
          money_plan_dateType: dateType_param
        }),
      }},
      {$sort: {money_plan_dateStart: sort_param}},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === "전체" ? {} : {
          money_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        money_dateType: "$money_dateType",
        money_dateStart: "$money_dateStart",
        money_dateEnd: "$money_dateEnd",
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }},
      {$sort: {money_dateStart: 1 }},
      {$limit: 1},
    ]);
    return finalResult;
  },
};