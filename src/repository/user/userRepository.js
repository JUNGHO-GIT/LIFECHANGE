// userRepository.js

import mongoose from "mongoose";
import {newDate} from "../../assets/js/date.js";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";
import {Exercise} from "../../schema/exercise/Exercise.js";
import {FoodPlan} from "../../schema/food/FoodPlan.js";
import {Food} from "../../schema/food/Food.js";
import {MoneyPlan} from "../../schema/money/MoneyPlan.js";
import {Money} from "../../schema/money/Money.js";
import {SleepPlan} from "../../schema/sleep/SleepPlan.js";
import {Sleep} from "../../schema/sleep/Sleep.js";
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
      dataCategory: OBJECT_param.dataCategory,
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
        dataCategory: OBJECT_param.dataCategory,
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
    user_id_param
  ) => {
    const finalResult =
    await ExercisePlan.deleteMany({
      user_id: user_id_param
    })
    await Exercise.deleteMany({
      user_id: user_id_param
    })
    await FoodPlan.deleteMany({
      user_id: user_id_param
    })
    await Food.deleteMany({
      user_id: user_id_param
    })
    await MoneyPlan.deleteMany({
      user_id: user_id_param
    })
    await Money.deleteMany({
      user_id: user_id_param
    })
    await SleepPlan.deleteMany({
      user_id: user_id_param
    })
    await Sleep.deleteMany({
      user_id: user_id_param
    })
    await User.deleteOne({
      user_id: user_id_param
    })
    return finalResult;
  }
};