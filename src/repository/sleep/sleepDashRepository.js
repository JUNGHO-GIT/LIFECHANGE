// sleepDashRepository.js

import {Sleep} from "../../schema/sleep/Sleep.js";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  listPlan: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_plan_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_plan_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_plan_date_start: 1,
        sleep_plan_date_end: 1,
        sleep_plan_night: 1,
        sleep_plan_morning: 1,
        sleep_plan_time: 1,
      }},
      {$sort: {sleep_plan_date_start: 1}}
    ])
    return finalResult;
  },

  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_date_start: 1,
        sleep_date_end: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_date_start: 1}}
    ])
    return finalResult;
  }
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_date_start: 1,
        sleep_date_end: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_date_start: 1}}
    ])

    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_date_start: 1,
        sleep_date_end: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_date_start: 1}}
    ])
    return finalResult;
  }
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------->
export const avgMonth = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_date_start: 1,
        sleep_date_end: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_date_start: 1}}
    ])
    return finalResult;
  }
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = {
  list: async (
    user_id_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_date_start: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_date_end: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        sleep_date_start: 1,
        sleep_date_end: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_date_start: 1}}
    ])
    return finalResult;
  }
};