// userRepository.js

import mongoose from "mongoose";
import {newDate} from "../../assets/js/date.js";
import {User} from "../../schema/user/User.js";

// 0-0. signup ------------------------------------------------------------------------------------>
export const signup = {

  checkId: async (
    user_id_param
  ) => {
    const finalResult = await User.find({
      user_id: user_id_param
    })
    .lean();
    return finalResult;
  },

  signup: async (
    user_id_param, user_pw_param
  ) => {

    const finalResult = await User.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_pw: user_pw_param,
      user_regDt: newDate,
      user_updateDt: "",
    });
    return finalResult;
  }
};

// 0-0. extra ------------------------------------------------------------------------------------->
export const extra = {

  extra: async (
    user_id_param, OBJECT_param
  ) => {
    const finalResult = await User.findOneAndUpdate(
      {user_id: user_id_param},
      {$set: {
        user_sex: OBJECT_param.user_sex,
        user_age: OBJECT_param.user_age,
        user_height: OBJECT_param.user_height,
        user_weight: OBJECT_param.user_weight,
        user_image: OBJECT_param.user_image,
        user_property: OBJECT_param.user_property,
        user_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();

    return finalResult;
  }
};

// 0.1. login ------------------------------------------------------------------------------------>
export const login = {

  login: async (
    user_id_param, user_pw_param
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param,
      user_pw: user_pw_param
    })
    .lean();
    return finalResult;
  }
};

// 2-1. detail ------------------------------------------------------------------------------------>
export const detail = async (
  user_id_param, _id_param
) => {

  const finalResult = await User.findOne({
    _id: !_id_param ? {$exists:true} : _id_param,
    user_id: user_id_param,
  })
  .lean();

  return finalResult;
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param
  ) => {
    const finalResult = await User.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param
  ) => {
    const finalResult = await User.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      user_pw: OBJECT_param.user_pw,
      user_name: OBJECT_param.user_name,
      user_image: OBJECT_param.user_image,
      dataCustom: OBJECT_param.dataCustom,
      user_regDt: newDate,
      user_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param
  ) => {
    const finalResult = await User.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        dataCustom: OBJECT_param.dataCustom,
        user_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4-1. deletes ----------------------------------------------------------------------------------->
export const deletes = {

  deletes: async (
    user_id_param, _id_param
  ) => {
    const updateResult = await User.updateOne(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$pull: {
        user_section: {
          _id: !_id_param ? {$exists:true} : _id_param
        },
      },
      $set: {
        user_updateDt: newDate,
      }},
      {arrayFilters: [{
        "elem._id": _id_param
      }]}
    )
    .lean();

    let finalResult = null;
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
  }
};