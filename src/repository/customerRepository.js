// customerRepository.js

import mongoose from "mongoose";
import {Customer} from "../schema/Customer.js";
import {fmtDate} from "../assets/common/date.js";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  customer_id_param, customer_pw_param
) => {

  const finalResult = await Customer.create({
    _id: new mongoose.Types.ObjectId(),
    customer_id: customer_id_param,
    customer_pw: customer_pw_param,
    customer_regDt: fmtDate,
    customer_updateDt: "",
  });

  return finalResult;
};

// 0.1. login ------------------------------------------------------------------------------------>
export const login = async (
  customer_id_param, customer_pw_param
) => {

  const finalResult = await Customer.findOne({
    customer_id: customer_id_param,
    customer_pw: customer_pw_param
  })
  .lean();

  return finalResult;
};

// 0-1. find (checkId) ---------------------------------------------------------------------------->
export const checkId = async (
  customer_id_param
) => {

  const finalResult = await Customer.find({
    customer_id: customer_id_param
  })
  .lean();

  return finalResult;
};

// 1-1. find -------------------------------------------------------------------------------------->
export const find = async (
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
};

// 1-2. aggregate (dataset) ----------------------------------------------------------------------->
export const aggregateDataset = async (
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
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  _id_param, customer_id_param
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
    customer_dataset: OBJECT_param.customer_dataset,
    customer_regDt: fmtDate,
    customer_updateDt: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param, OBJECT_param
) => {

  const finalResult = await Customer.findOneAndUpdate(
    {_id: _id_param
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
  _id_param, customer_id_param
) => {

  const updateResult = await Customer.updateOne(
    {customer_id: customer_id_param
    },
    {$pull: {
        customer_section: {
          _id: _id_param
        },
      },
      $set: {
        customer_updateDt: fmtDate,
      },
    },
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