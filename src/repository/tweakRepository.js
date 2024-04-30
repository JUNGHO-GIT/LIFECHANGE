// exercisePlanRepository.js

import mongoose from "mongoose";
import {Exercise} from "../schema/Exercise.js";
import {Customer} from "../schema/Customer.js";
import {fmtDate} from "../assets/js/date.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  customer_id_param, part_param, title_param, startDt_param, endDt_param
) => {

  const finalResult = await Exercise.countDocuments({
    customer_id: customer_id_param,
    exercise_startDt: {
      $gte: startDt_param,
    },
    exercise_endDt: {
      $lte: endDt_param,
    },
    ...(part_param !== "전체" && {
      "exercise_section.exercise_part_val": part_param
    }),
    ...(title_param !== "전체" && {
      "exercise_section.exercise_title_val": title_param
    }),
  });
  return finalResult;
};

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = {
  list: async (
    customer_id_param
  ) => {
    const finalResult = await Customer.aggregate([
      {$match: {
        customer_id: customer_id_param,
      }},
      {$project: {
        _id: 0,
        customer_dataset: {
          diary: 1,
          food: 1,
          money: 1,
          exercise: 1,
          sleep: 1,
        }
      }}
    ]);
    return finalResult[0];
  },
};

// 1-1. list -------------------------------------------------------------------------------------->
export const list = {
  list: async (
    customer_id_param, sort_param, limit_param, page_param
  ) => {

    const finalResult = await Customer.find({
      customer_id: customer_id_param,
    })
    .sort({customer_regDt: sort_param})
    .skip((page_param - 1) * limit_param)
    .limit(limit_param)
    .lean();

    return finalResult;
  }
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  customer_id_param, _id_param
) => {

  const finalResult = await Customer.findOne({
    _id: !_id_param ? {$exists:true} : _id_param,
    customer_id: customer_id_param,
  })
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  customer_id_param, OBJECT_param
) => {

  const finalResult = await Customer.create({
    _id: new mongoose.Types.ObjectId(),
    customer_id: customer_id_param,
    customer_pw: OBJECT_param.customer_pw,
    customer_sex: OBJECT_param.customer_sex,
    customer_age: OBJECT_param.customer_age,
    customer_height: OBJECT_param.customer_height,
    customer_weight: OBJECT_param.customer_weight,
    customer_email: OBJECT_param.customer_email,
    customer_phone: OBJECT_param.customer_phone,
    customer_image: OBJECT_param.customer_image,
    customer_dataset: OBJECT_param.customer_dataset,
    customer_regDt: fmtDate,
    customer_updateDt: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  customer_id_param, _id_param, OBJECT_param
) => {
  const finalResult = await Customer.findOneAndUpdate(
    {customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    },
    {$set: {
      ...OBJECT_param,
      customer_updateDt: fmtDate,
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
  customer_id_param, _id_param
) => {

  const updateResult = await Customer.updateOne(
    {customer_id: customer_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    },
    {$pull: {
      customer_section: {
        _id: !_id_param ? {$exists:true} : _id_param
      },
    },
    $set: {
      customer_updateDt: fmtDate,
    }},
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;

  if (updateResult.modifiedCount > 0) {
    const doc = await Customer.findOne({
      customer_id: customer_id_param
    })
    .lean();

    if (doc) {
      finalResult = await Customer.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  };

  return finalResult;
};