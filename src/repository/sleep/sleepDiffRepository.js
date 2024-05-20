// sleepDiffRepository.js

import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";

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
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_date_type: !dateType_param ? {$exists:false} : dateType_param,
        sleep_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$unwind: "$sleep_section"
      },
      {$project: {
        _id: 1,
        sleep_date_type: 1,
        sleep_date_start: 1,
        sleep_date_end: 1,
        sleep_night: "$sleep_section.sleep_night",
        sleep_morning: "$sleep_section.sleep_morning",
        sleep_time: "$sleep_section.sleep_time",
      }},
      {$sort: {
        sleep_date_start: 1,
        sleep_date_end: 1,
      }},
      {$limit: 1},
    ]);
    return finalResult;
  },

  listPlan: async (
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
        }
      }},
      {$sort: {
        sleep_plan_date_start: sort_param,
        sleep_plan_date_end: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },
};