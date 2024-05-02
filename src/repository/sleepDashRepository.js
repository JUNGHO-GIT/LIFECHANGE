// sleepDashRepository.js

import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  listPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        customer_id: customer_id_param,
        sleep_plan_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        sleep_plan_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      }},
      {$project: {
        sleep_plan_startDt: 1,
        sleep_plan_endDt: 1,
        sleep_plan_night: 1,
        sleep_plan_morning: 1,
        sleep_plan_time: 1,
      }},
      {$sort: {sleep_plan_startDt: 1}}
    ])
    return finalResult;
  },

  listReal: async (
    customer_id_param, startDt_param, endDt_param
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
      {$project: {
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_startDt: 1}}
    ])
    return finalResult;
  }
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = {
  list: async (
    customer_id_param, startDt_param, endDt_param
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
      {$project: {
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_startDt: 1}}
    ])

    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  list: async (
    customer_id_param, startDt_param, endDt_param
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
      {$project: {
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_startDt: 1}}
    ])
    return finalResult;
  }
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = {
  list: async (
    customer_id_param, startDt_param, endDt_param
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
      {$project: {
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_startDt: 1}}
    ])
    return finalResult;
  }
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = {
  list: async (
    customer_id_param, startDt_param, endDt_param
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
      {$project: {
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_section: 1,
      }},
      {$sort: {sleep_startDt: 1}}
    ])
    return finalResult;
  }
};