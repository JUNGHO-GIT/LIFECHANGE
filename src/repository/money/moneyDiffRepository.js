// moneyDiffRepository.js

import {Money} from "../../schema/money/Money.js";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await MoneyGoal.countDocuments({
      user_id: user_id_param,
      money_goal_dateStart: {
        $lte: dateEnd_param,
      },
      money_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...(dateType_param === "" ? {} : {
        money_goal_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  listGoal: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await MoneyGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param === ""? {} : {
          money_goal_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        money_goal_dataType: 1,
        money_goal_dateStart: 1,
        money_goal_dateEnd: 1,
        money_goal_income: 1,
        money_goal_expense: 1,
      }},
      {$sort: {money_goal_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
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
        ...(dateType_param === ""? {} : {
          money_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        money_dateType: "$money_dateType",
        money_dateStart: "$money_dateStart",
        money_dateEnd: "$money_dateEnd",
        money_total_income: "$money_total_income",
        money_total_expense: "$money_total_expense",
      }},
      {$sort: {money_dateStart: 1 }},
      {$limit: 1},
    ]);
    return finalResult;
  },
};