// foodFindRepository.js

import mongoose from "mongoose";
import {Food} from "../../schema/food/Food.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = {

  // food_section 의 length 가 0 이상인 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        food_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === "전체" ? {} : {
          food_dateType: dateType_param
        }),
      }},
      {$match: {$expr: {
        $gt: [{$size: "$food_section"}, 0]
      }}},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$food_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

// 3. save -----------------------------------------------------------------------------------------
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_dateStart: {
        $eq: dateStart_param
      },
      food_dateEnd: {
        $eq: dateEnd_param
      },
      ...(dateType_param === "전체" ? {} : {
        food_dateType: dateType_param
      })
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      food_dummy: false,
      food_dateType: dateType_param,
      food_dateStart: dateStart_param,
      food_dateEnd: dateEnd_param,
      food_total_kcal: OBJECT_param.food_total_kcal,
      food_total_carb: OBJECT_param.food_total_carb,
      food_total_protein: OBJECT_param.food_total_protein,
      food_total_fat: OBJECT_param.food_total_fat,
      food_section: OBJECT_param.food_section,
      food_regDt: newDate,
      food_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Food.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        food_dateType: dateType_param,
        food_dateStart: dateStart_param,
        food_dateEnd: dateEnd_param,
        food_total_kcal: OBJECT_param.food_total_kcal,
        food_total_carb: OBJECT_param.food_total_carb,
        food_total_protein: OBJECT_param.food_total_protein,
        food_total_fat: OBJECT_param.food_total_fat,
        food_section: OBJECT_param.food_section,
        food_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};
