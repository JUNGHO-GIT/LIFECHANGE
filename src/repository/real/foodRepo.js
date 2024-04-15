// foodPlanRepo.js

import mongoose from "mongoose";
import moment from "moment";
import {Food} from "../../schema/real/Food.js";
import {FoodPlan} from "../../schema/plan/FoodPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  part_param,
  title_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Food.countDocuments({
    user_id: user_id_param,
    food_startDt: {
      $gte: startDt_param,
    },
    food_endDt: {
      $lte: endDt_param,
    },
    ...(part_param !== "전체" && {
      "food_section.food_part_val": part_param
    }),
    ...(title_param !== "전체" && {
      "food_section.food_title_val": title_param
    }),
  });

  return finalResult;
}

// 1-1. find (real) ------------------------------------------------------------------------------->
export const findReal = async (
  user_id_param,
  part_param,
  title_param,
  sort_param,
  limit_param,
  page_param,
  startDt_param,
  endDt_param,
) => {

  const finalResult = await Food.aggregate([
    {$match: {
      user_id: user_id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param
      },
    }},
    {$project: {
      food_startDt: 1,
      food_endDt: 1,
      food_total_kcal: 1,
      food_total_carb: 1,
      food_total_protein: 1,
      food_total_fat: 1,
      food_section: {
        $filter: {
          input: "$food_section",
          as: "section",
          cond: {
            $and: [
              part_param === "전체"
              ? {$ne: ["$$section.food_part_val", null]}
              : {$eq: ["$$section.food_part_val", part_param]},
              title_param === "전체"
              ? {$ne: ["$$section.food_title_val", null]}
              : {$eq: ["$$section.food_title_val", title_param]}
            ]
          }
        }
      }
    }},
    {$sort: {food_startDt: sort_param}},
    {$skip: (page_param - 1) * limit_param},
    {$limit: limit_param}
  ]);

  return finalResult;
};

// 1-2. find (plan) ------------------------------------------------------------------------------->
export const findPlan = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param,
  startDt_param,
  endDt_param,
) => {

  const finalResult = await FoodPlan.find({
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

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Food.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
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
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  user_id_param,
  FOOD_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Food.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    food_startDt: startDt_param,
    food_endDt: endDt_param,
    food_kcal: FOOD_param.food_kcal,
    food_carb: FOOD_param.food_carb,
    food_protein: FOOD_param.food_protein,
    food_fat: FOOD_param.food_fat,
    food_regdate: fmtDate,
    food_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  FOOD_param
) => {

  const finalResult = await Food.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...FOOD_param,
      food_update: fmtDate,
    }},
    {upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 4-1. delete ------------------------------------------------------------------------------------>
export const deletes = async (
  _id_param,
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const updateResult = await Food.updateOne(
    {_id: _id_param,
      user_id: user_id_param,
      food_startDt: {
        $gte: startDt_param,
      },
      food_endDt: {
        $lte: endDt_param,
      },
    },
    {$pull: {
      food_section: {
        _id: _id_param
      },
    },
    $set: {
      food_update: fmtDate,
    }},
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Food.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if ((doc) && (!doc?.food_section || doc?.food_section?.length === 0)) {
      finalResult = await Food.deleteOne({
        _id: doc._id
      })
    }
  }

  return finalResult;
};

