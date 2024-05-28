// moneyPlanRepository.js

import mongoose from "mongoose";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist --------------------------------------------------------------------------------------->
export const exist = {

  // money_dateType 이 존재하는 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        money_plan_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_plan_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === "전체" ? {} : {
          money_plan_dateType: dateType_param
        }),
      }},
      {$match: {
        money_plan_dateType: {$exists: true}
      }},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$money_plan_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

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
      money_plan_dateType: dateType_param,
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
        money_plan_dateStart: {
          $lte: dateEnd_param,
        },
        money_plan_dateEnd: {
          $gte: dateStart_param,
        },
        money_plan_dateType: dateType_param,
      }},
      {$project: {
        _id: 1,
        money_plan_dateType: 1,
        money_plan_dateStart: 1,
        money_plan_dateEnd: 1,
        money_plan_in: 1,
        money_plan_out: 1,
      }},
      {$sort: {money_plan_dateStart: sort_param}},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  }
};

// 2. detail (상세는 eq) -------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_plan_dateStart: {
        $eq: dateStart_param,
      },
      money_plan_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        money_plan_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_plan_dateStart: {
        $eq: dateStart_param,
      },
      money_plan_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        money_plan_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      money_plan_demo: false,
      money_plan_dateType: dateType_param,
      money_plan_dateStart: dateStart_param,
      money_plan_dateEnd: dateEnd_param,
      money_plan_in: OBJECT_param.money_plan_in,
      money_plan_out: OBJECT_param.money_plan_out,
      money_plan_regDt: newDate,
      money_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        money_plan_dateType: dateType_param,
        money_plan_dateStart: dateStart_param,
        money_plan_dateEnd: dateEnd_param,
        money_plan_in: OBJECT_param.money_plan_in,
        money_plan_out: OBJECT_param.money_plan_out,
        money_plan_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await MoneyPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_plan_dateStart: {
        $eq: dateStart_param,
      },
      money_plan_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        money_plan_dateType: dateType_param
      }),
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