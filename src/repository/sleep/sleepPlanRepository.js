// sleepPlanRepository.js

import mongoose from "mongoose";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await SleepPlan.countDocuments({
      user_id: user_id_param,
      sleep_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
      sleep_plan_date_start: {
        $lte: dateEnd_param,
      },
      sleep_plan_date_end: {
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
        sleep_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
        sleep_plan_date_start: {
          $lte: dateEnd_param,
        },
        sleep_plan_date_end: {
          $gte: dateStart_param,
        },
      }},
      {$sort: {
        sleep_plan_date_start: sort_param,
        sleep_plan_date_end: sort_param
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
    const finalResult = await SleepPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_plan_date_end: {
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
    const finalResult = await SleepPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_plan_date_end: {
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
    const finalResult = await SleepPlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_plan_demo: false,
      sleep_plan_date_type: OBJECT_param.sleep_plan_date_type,
      sleep_plan_date_start: dateStart_param,
      sleep_plan_date_end: dateEnd_param,
      sleep_plan_night: OBJECT_param.sleep_plan_night,
      sleep_plan_morning: OBJECT_param.sleep_plan_morning,
      sleep_plan_time: OBJECT_param.sleep_plan_time,
      sleep_plan_regDt: newDate,
      sleep_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await SleepPlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        sleep_plan_date_type: OBJECT_param.sleep_plan_date_type,
        sleep_plan_date_start: dateStart_param,
        sleep_plan_date_end: dateEnd_param,
        sleep_plan_night: OBJECT_param.sleep_plan_night,
        sleep_plan_morning: OBJECT_param.sleep_plan_morning,
        sleep_plan_time: OBJECT_param.sleep_plan_time,
        sleep_plan_updateDt: newDate,
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
    const finalResult = await SleepPlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      sleep_plan_date_end: {
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
    const deleteResult = await SleepPlan.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};