// userPlanRepository.js

import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";
import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";
import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";
import {Work} from "../schema/Work.js";
import {WorkPlan} from "../schema/WorkPlan.js";

// 1-1. percent ----------------------------------------------------------------------------------->
export const percent = {

  // 1. food
  findFoodPlan: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await FoodPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        food_plan_startDt: {
          $lte: endDt_param,
        },
        food_plan_endDt: {
          $gte: startDt_param,
        },
      }}
    ]);
    return finalResult;
  },
  findFoodReal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        food_startDt: "$food_startDt",
        food_endDt: "$food_endDt",
        food_total_kcal: "$food_total_kcal",
        food_total_carb: "$food_total_carb",
        food_total_protein: "$food_total_protein",
        food_total_fat: "$food_total_fat",
      }}
    ]);
    return finalResult;
  },

  // 2. money
  findMoneyPlan: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await MoneyPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        money_plan_startDt: {
          $lte: endDt_param,
        },
        money_plan_endDt: {
          $gte: startDt_param,
        }
      }}
    ]);
    return finalResult;
  },
  findMoneyReal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Money.aggregate([
      {$match: {
        user_id: user_id_param,
        money_startDt: {
          $lte: endDt_param,
        },
        money_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        money_startDt: "$money_startDt",
        money_endDt: "$money_endDt",
        money_total_in: "$money_total_in",
        money_total_out: "$money_total_out",
      }}
    ]);
    return finalResult;
  },

  // 3. sleep
  findSleepPlan: async (
    user_id_param, startDt_param,  endDt_param,
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
      }}
    ]);
    return finalResult;
  },
  findSleepReal: async (
    user_id_param,
    startDt_param,
    endDt_param,
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

  // 4. work
  findWorkPlan: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await WorkPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        work_plan_startDt: {
          $lte: endDt_param,
        },
        work_plan_endDt: {
          $gte: startDt_param,
        }
      }},
    ]);
    return finalResult;
  },
  findWorkReal: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $lte: endDt_param,
        },
        work_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        work_startDt: "$work_startDt",
        work_endDt: "$work_endDt",
        work_total_count: "$work_total_count",
        work_total_volume: "$work_total_volume",
        work_total_cardio: "$work_total_cardio",
        work_body_weight: "$work_body_weight",
      }}
    ]);
    return finalResult;
  }
};