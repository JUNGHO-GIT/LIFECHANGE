// userRepo.js

import mongoose from "mongoose";
import moment from "moment";
import {User} from "../../schema/real/User.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

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
  .sort({user_regdate: sort_param})
  .skip((page_param - 1) * limit_param)
  .limit(limit_param)
  .lean();

  return finalResult;
};

// 1-2. aggregate (dataset) ----------------------------------------------------------------------->
export const aggregateDataset = async (
  user_id_param,
  user_pw_param
) => {

  const finalResult = await User.aggregate([
    {$match: {
      user_id: user_id_param,
      user_pw: user_pw_param
    }},
    {$project: {
      _id: 0,
      user_dataset: {
        work: 1,
        money: 1
      }
    }}
  ]);

  const workSet = finalResult[0]?.user_dataset.work;
  const moneySet = finalResult[0]?.user_dataset.money;

  return {
    result: {
      work: workSet,
      money: moneySet
    }
  };
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  _id_param,
  user_id_param,
  user_pw_param
) => {

  const finalResult = await User.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    user_pw: user_pw_param
  })
  .lean();

  return finalResult;
};

// 3-1. create ------------------------------------------------------------------------------------>
export const create = async (
  user_id_param,
  USER_param
) => {

  const finalResult = await User.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    user_pw: USER_param.user_pw,
    user_email: USER_param.user_email,
    user_phone: USER_param.user_phone,
    user_sex: USER_param.user_sex,
    user_age: USER_param.user_age,
    user_height: USER_param.user_height,
    user_weight: USER_param.user_weight,
    user_dataset: USER_param.user_dataset,
    user_regdate: fmtDate,
    user_update: "",
  });

  return finalResult;
};

// 3-2. update ------------------------------------------------------------------------------------>
export const update = async (
  _id_param,
  USER_param
) => {

  const finalResult = await User.findOneAndUpdate(
    {_id: _id_param
    },
    {$set: {
      ...USER_param,
      user_update: fmtDate,
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
        user_update: fmtDate,
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