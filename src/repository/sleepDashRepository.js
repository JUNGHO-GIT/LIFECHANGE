// sleepDashRepository.js

import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  listPlan: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await SleepPlan.findOne({
      customer_id: customer_id_param,
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

  listReal: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      customer_id: customer_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = {
  list: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      customer_id: customer_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = {
  list: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      customer_id: customer_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 4-1. dash (avg - week) ------------------------------------------------------------------------->
export const avgWeek = {
  list: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      customer_id: customer_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 4-2. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = {
  list: async (
    customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      customer_id: customer_id_param,
      sleep_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      sleep_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};