// moneyGoalRepository.js

import mongoose from "mongoose";
import {MoneyGoal} from "../../schema/money/MoneyGoal.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = {

  // money_dateType 이 존재하는 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === ""? {} : {
          money_goal_dateType: dateType_param
        }),
      }},
      {$match: {
        money_goal_dateType: {$exists: true}
      }},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$money_goal_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

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

  list: async (
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
        money_goal_dateType: 1,
        money_goal_dateStart: 1,
        money_goal_dateEnd: 1,
        money_goal_income: 1,
        money_goal_expense: 1,
      }},
      {$sort: {money_goal_dateStart: sort_param}},
      {$skip: (page_param - 1)},
    ]);
    return finalResult;
  }
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_goal_dateStart: {
        $eq: dateStart_param,
      },
      money_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === ""? {} : {
        money_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  }
};

// 3. save -----------------------------------------------------------------------------------------
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_goal_dateStart: {
        $eq: dateStart_param,
      },
      money_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === ""? {} : {
        money_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      money_goal_dummy: "N",
      money_goal_dateType: dateType_param,
      money_goal_dateStart: dateStart_param,
      money_goal_dateEnd: dateEnd_param,
      money_goal_income: OBJECT_param.money_goal_income,
      money_goal_expense: OBJECT_param.money_goal_expense,
      money_goal_regDt: newDate,
      money_goal_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        money_goal_dateType: dateType_param,
        money_goal_dateStart: dateStart_param,
        money_goal_dateEnd: dateEnd_param,
        money_goal_income: OBJECT_param.money_goal_income,
        money_goal_expense: OBJECT_param.money_goal_expense,
        money_goal_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_goal_dateStart: {
        $eq: dateStart_param,
      },
      money_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === ""? {} : {
        money_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await MoneyGoal.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};