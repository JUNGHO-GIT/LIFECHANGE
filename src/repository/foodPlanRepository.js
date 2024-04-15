// foodPlanRepository.js

import mongoose from "mongoose";
import moment from "moment";
import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = FoodPlan.countDocuments({
    user_id: user_id_param,
    food_plan_startDt: {
      $gte: startDt_param,
    },
    food_plan_endDt: {
      $lte: endDt_param,
    },
  });

  return finalResult;
}

// 1-1. find (real) ------------------------------------------------------------------------------->
export const findReal = async (
  user_id_param,
  startDt_param,
  endDt_param,
  sort_param,
  limit_param,
  page_param
) => {

  const finalResult = Food.find({
    user_id: user_id_param,
    food_startDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    },
    food_endDt: {
      $gte: startDt_param,
      $lte: endDt_param,
    }
  })
  .sort({food_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 1-2. find (plan) ------------------------------------------------------------------------------->
export const findPlan = async (
  user_id_param,
  startDt_param,
  endDt_param,
  sort_param,
  limit_param,
  page_param
) => {

  const finalResult = FoodPlan.find({
    user_id: user_id_param,
    food_plan_startDt: {
      $gte: startDt_param,
    },
    food_plan_endDt: {
      $lte: endDt_param,
    },
  })
  .sort({food_plan_startDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};


