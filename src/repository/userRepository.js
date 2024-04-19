// userRepository.js

import mongoose from "mongoose";
import {User} from "../schema/User.js";
import {fmtDate} from "../assets/common/date.js";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = async (
  user_id_param,
  user_pw_param
) => {

  const finalResult = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_pw: user_pw_param,
    user_regDt: fmtDate,
    user_updateDt: "",
  });

  return finalResult;
};

// 0.1. login ------------------------------------------------------------------------------------>
export const login = async (
  user_id_param,
  user_pw_param
) => {

  const finalResult = await User.findOne({
    user_id: user_id_param,
    user_pw: user_pw_param
  })
  .lean();

  return finalResult;
};

// 0-1. find (checkId) ---------------------------------------------------------------------------->
export const checkId = async (
  user_id_param
) => {

  const finalResult = await User.find({
    user_id: user_id_param
  })
  .lean();

  return finalResult;
};

// 1-1. find -------------------------------------------------------------------------------------->
export const find = async (
  user_id_param,
  sort_param,
  limit_param,
  page_param
) => {

  const finalResult = await User.find({
    user_id: user_id_param,
  })
  .sort({user_regDt: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 1-2. aggregate (dataset) ----------------------------------------------------------------------->
export const aggregateDataset = async (
  user_id_param
) => {

  const finalResult = await User.aggregate([
    {$match: {
      user_id: user_id_param,
    }},
    {$project: {
      _id: 0,
      user_dataset: {
        food: 1,
        money: 1,
        work: 1
      }
    }}
  ]);

  return finalResult[0];
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  _id_param,
  user_id_param
) => {

  const finalResult = await User.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
  })
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  user_id_param,
  OBJECT_param
) => {

  const finalResult = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_pw: OBJECT_param.user_pw,
    user_email: OBJECT_param.user_email,
    user_phone: OBJECT_param.user_phone,
    user_sex: OBJECT_param.user_sex,
    user_age: OBJECT_param.user_age,
    user_height: OBJECT_param.user_height,
    user_weight: OBJECT_param.user_weight,
    user_dataset: OBJECT_param.user_dataset,
    user_regDt: fmtDate,
    user_updateDt: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  OBJECT_param
) => {

  const finalResult = await User.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...OBJECT_param,
      user_updateDt: fmtDate,
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
  user_id_param
) => {

  const updateResult = await User.updateOne(
    {user_id: user_id_param
    },
    {$pull: {
        user_section: {
          _id: _id_param
        },
      },
      $set: {
        user_updateDt: fmtDate,
      },
    },
    {arrayFilters: [{
      "elem._id": _id_param
    }]}
  )
  .lean();

  let finalResult;

  if (updateResult.modifiedCount > 0) {
    const doc = await User.findOne({
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await User.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  };

  return finalResult;
};