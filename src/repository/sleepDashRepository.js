// sleepDashRepository.js

import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = {
  findPlan: async (
    _id_param,
    customer_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await SleepPlan.findOne({
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
  findReal: async (
    _id_param,
    customer_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
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
  find: async (
    _id_param,
    customer_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
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
  find: async (
    _id_param,
    customer_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
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
  find: async (
    _id_param,
    customer_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
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
  find: async (
    _id_param,
    customer_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Sleep.findOne({
      _id: !_id_param ? {$exists:true} : _id_param,
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