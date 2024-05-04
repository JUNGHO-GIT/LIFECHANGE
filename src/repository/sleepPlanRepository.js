// sleepPlanRepository.js

import mongoose from "mongoose";
import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";
import {fmtDate} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await SleepPlan.countDocuments({
      customer_id: customer_id_param,
      sleep_plan_startDt: {
        $lte: endDt_param,
      },
      sleep_plan_endDt: {
        $gte: startDt_param,
      },
    });
    return finalResult;
  },

  listPlan: async (
    customer_id_param, sort_param, limit_param, page_param, startDt_param,  endDt_param,
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        sleep_plan_startDt: {
          $lte: endDt_param,
        },
        sleep_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$sort: {
        sleep_plan_startDt: sort_param,
        sleep_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },

  list: async (
    customer_id_param, startDt_param, endDt_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        customer_id: customer_id_param,
        sleep_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        sleep_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$unwind: "$sleep_section"
      },
      {$project: {
        _id: 1,
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_night: "$sleep_section.sleep_night",
        sleep_morning: "$sleep_section.sleep_morning",
        sleep_time: "$sleep_section.sleep_time",
      }},
      {$sort: {
        sleep_startDt: 1,
        sleep_endDt: 1,
      }},
      {$limit: 1},
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    customer_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await SleepPlan.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_plan_endDt: {
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
    const finalResult = await SleepPlan.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_plan_endDt: {
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
    const finalResult = await SleepPlan.create({
      customer_id: customer_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_plan_startDt: startDt_param,
      sleep_plan_endDt: endDt_param,
      sleep_plan_night: OBJECT_param.sleep_plan_night,
      sleep_plan_morning: OBJECT_param.sleep_plan_morning,
      sleep_plan_time: OBJECT_param.sleep_plan_time,
      sleep_plan_regDt: fmtDate,
      sleep_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    customer_id_param, _id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await SleepPlan.findOneAndUpdate(
      {customer_id: customer_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        sleep_plan_startDt: startDt_param,
        sleep_plan_endDt: endDt_param,
        sleep_plan_night: OBJECT_param.sleep_plan_night,
        sleep_plan_morning: OBJECT_param.sleep_plan_morning,
        sleep_plan_time: OBJECT_param.sleep_plan_time,
        sleep_plan_updateDt: fmtDate,
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
    const finalResult = await SleepPlan.findOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_plan_endDt: {
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
    const deleteResult = await SleepPlan.deleteOne({
      customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};