// exercisePlanRepository.js

import mongoose from "mongoose";
import {Exercise} from "../schema/Exercise.js";
import {fmtDate} from "../assets/common/date.js";

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

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  find: async (
    customer_id_param, part_param, title_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        ...(part_param !== "전체" && {
          "exercise_section.exercise_part_val": part_param
        }),
        ...(title_param !== "전체" && {
          "exercise_section.exercise_title_val": title_param
        }),
      }},
      {$project: {
        exercise_startDt: 1,
        exercise_endDt: 1,
        exercise_start: 1,
        exercise_end: 1,
        exercise_time: 1,
        exercise_total_volume: 1,
        exercise_total_cardio: 1,
        exercise_body_weight: 1,
        exercise_section: {
          $filter: {
            input: "$exercise_section",
            as: "section",
            cond: {
              $and: [
                part_param === "전체"
                ? {$ne: ["$$section.exercise_part_val", null]}
                : {$eq: ["$$section.exercise_part_val", part_param]},
                title_param === "전체"
                ? {$ne: ["$$section.exercise_title_val", null]}
                : {$eq: ["$$section.exercise_title_val", title_param]}
              ]
            }
          }
        }
      }},
      {$sort: {exercise_startDt: sort_param}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);

    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
    })
    .lean();
    return finalResult;
  },
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      exercise_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },
  create: async (
    customer_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {

    const finalResult = await Exercise.create({
      _id: new mongoose.Types.ObjectId(),
      customer_id: customer_id_param,
      exercise_startDt: startDt_param,
      exercise_endDt: endDt_param,
      exercise_start: OBJECT_param.exercise_start,
      exercise_end: OBJECT_param.exercise_end,
      exercise_time: OBJECT_param.exercise_time,
      exercise_total_volume: OBJECT_param.exercise_total_volume,
      exercise_total_cardio: OBJECT_param.exercise_total_cardio,
      exercise_body_weight: OBJECT_param.exercise_body_weight,
      exercise_section: OBJECT_param.exercise_section,
      exercise_regDt: fmtDate,
      exercise_updateDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param, OBJECT_param
  ) => {
    const finalResult = await Exercise.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...OBJECT_param,
        exercise_plan_updateDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();
    return finalResult;
  }
};

// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {

  detail: async (
    _id_param, customer_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      customer_id: customer_id_param,
      exercise_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  update: async (
    _id_param, section_id_param, customer_id_param, startDt_param, endDt_param,
  ) => {
    const updateResult = await Exercise.updateOne(
      {_id: _id_param,
        customer_id: customer_id_param,
        exercise_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      },
      {$pull: {
        exercise_section: {
          _id: section_id_param
        },
      },
      $set: {
        exercise_updateDt: fmtDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    _id_param
  ) => {
    const deleteResult = await Exercise.deleteOne({
      _id: _id_param
    })
    .lean();
    return deleteResult;
  }
};