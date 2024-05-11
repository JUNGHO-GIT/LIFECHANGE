// sleepDiffRepository.js

import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";

// 1. diff ---------------------------------------------------------------------------------------->
export const diff = {

  cnt: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await SleepPlan.countDocuments({
      user_id: user_id_param,
      sleep_plan_startDt: {
        $lte: endDt_param,
      },
      sleep_plan_endDt: {
        $gte: startDt_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param, startDt_param, endDt_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
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
  },

  listPlan: async (
    user_id_param, sort_param, limit_param, page_param, startDt_param,  endDt_param,
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
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
};