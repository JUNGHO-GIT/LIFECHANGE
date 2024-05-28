// sleepPlanRepository.js

import mongoose from "mongoose";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist --------------------------------------------------------------------------------------->
export const exist = {

  // sleep_dateType 이 존재하는 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_plan_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_plan_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === "전체" ? {} : {
          sleep_plan_dateType: dateType_param
        }),
      }},
      {$match: {
        sleep_plan_dateType: {$exists: true}
      }},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$sleep_plan_dateStart"}
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
    const finalResult = await SleepPlan.countDocuments({
      user_id: user_id_param,
      sleep_plan_dateStart: {
        $lte: dateEnd_param,
      },
      sleep_plan_dateEnd: {
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
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_plan_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_plan_dateEnd: {
          $gte: dateStart_param,
        },
      }},
      {$project: {
        _id: 1,
        sleep_plan_dateType: 1,
        sleep_plan_dateStart: 1,
        sleep_plan_dateEnd: 1,
        sleep_plan_night: 1,
        sleep_plan_morning: 1,
        sleep_plan_time: 1,
      }},
      {$sort: {sleep_plan_dateStart: sort_param}},
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
    const finalResult = await SleepPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_dateStart: {
        $eq: dateStart_param,
      },
      sleep_plan_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        sleep_plan_dateType: dateType_param
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
    const finalResult = await SleepPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_dateStart: {
        $eq: dateStart_param,
      },
      sleep_plan_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        sleep_plan_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await SleepPlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_plan_demo: false,
      sleep_plan_dateType: dateType_param,
      sleep_plan_dateStart: dateStart_param,
      sleep_plan_dateEnd: dateEnd_param,
      sleep_plan_night: OBJECT_param.sleep_plan_night,
      sleep_plan_morning: OBJECT_param.sleep_plan_morning,
      sleep_plan_time: OBJECT_param.sleep_plan_time,
      sleep_plan_regDt: newDate,
      sleep_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await SleepPlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        sleep_plan_dateType: dateType_param,
        sleep_plan_dateStart: dateStart_param,
        sleep_plan_dateEnd: dateEnd_param,
        sleep_plan_night: OBJECT_param.sleep_plan_night,
        sleep_plan_morning: OBJECT_param.sleep_plan_morning,
        sleep_plan_time: OBJECT_param.sleep_plan_time,
        sleep_plan_updateDt: newDate,
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
    const finalResult = await SleepPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_dateStart: {
        $eq: dateStart_param,
      },
      sleep_plan_dateEnd: {
        $eq: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        sleep_plan_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await SleepPlan.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};