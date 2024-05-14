// foodPlanRepository.js

import mongoose from "mongoose";
import {Food} from "../../schema/food/Food.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param, part_param, title_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.countDocuments({
      user_id: user_id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      ...(part_param !== "전체" && {
        "food_section.food_part_val": part_param
      }),
      ...(title_param !== "전체" && {
        "food_section.food_title": title_param
      }),
    });
    return finalResult;
  },

  list: async (
    user_id_param, part_param, title_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.aggregate([
      {$match: {
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
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
                ? {$ne: ["$$section.food_title", null]}
                : {$eq: ["$$section.food_title", title_param]}
              ]
            }
          }
        }
      }},
      {$sort: {
        food_startDt: sort_param,
        food_endDt: sort_param
      }},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      food_demo: false,
      food_startDt: startDt_param,
      food_endDt: endDt_param,
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
    user_id_param, _id_param, OBJECT_param,startDt_param, endDt_param
  ) => {
    const finalResult = await Food.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        food_startDt: startDt_param,
        food_endDt: endDt_param,
        food_total_kcal: OBJECT_param.food_total_kcal,
        food_total_carb: OBJECT_param.food_total_carb,
        food_total_protein: OBJECT_param.food_total_protein,
        food_total_fat: OBJECT_param.food_total_fat,
        food_section: OBJECT_param.food_section,
        food_updateDt: newDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Food.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      food_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      food_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, section_id_param, startDt_param, endDt_param,
  ) => {
    const updateResult = await Food.updateOne(
      {_id: !_id_param ? {$exists:true} : _id_param,
        user_id: user_id_param,
        food_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        food_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      },
      {$pull: {
        food_section: {
          _id: section_id_param
        },
      },
      $set: {
        food_updateDt: newDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await Food.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};