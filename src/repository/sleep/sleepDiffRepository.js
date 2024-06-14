// sleepDiffRepository.js

import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepGoal} from "../../schema/sleep/SleepGoal.js";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await SleepGoal.countDocuments({
      user_id: user_id_param,
      sleep_goal_dateStart: {
        $lte: dateEnd_param,
      },
      sleep_goal_dateEnd: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  listGoal: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await SleepGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
      }},
      {$project: {
        _id: 1,
        sleep_goal_dateType: 1,
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      }},
      {$sort: {sleep_goal_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
      }},
      {$unwind: "$sleep_section"},
      {$project: {
        _id: 1,
        sleep_dateType: 1,
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_bedTime: "$sleep_section.sleep_bedTime",
        sleep_wakeTime: "$sleep_section.sleep_wakeTime",
        sleep_sleepTime: "$sleep_section.sleep_sleepTime",
      }},
      {$sort: {sleep_dateStart: 1 }},
      {$limit: 1},
    ]);
    return finalResult;
  },
};