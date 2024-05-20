// exercisePlanRepository.js

import mongoose from "mongoose";
import {Exercise} from "../../schema/exercise/Exercise.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    part_param, title_param,
  ) => {
    const finalResult = await Exercise.countDocuments({
      user_id: user_id_param,
      exercise_dateStart: {
        $gte: dateStart_param,
      },
      exercise_dateEnd: {
        $lte: dateEnd_param,
      },
      ...(dateType_param === "전체" ? {} : {
        exercise_dateType: dateType_param
      }),
      ...(part_param === "전체" ? {} : {
        "exercise_section.exercise_part_val": part_param
      }),
      ...(title_param === "전체" ? {} : {
        "exercise_section.exercise_title_val": title_param
      }),
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    part_param, title_param, sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        ...(dateType_param === "전체" ? {} : {
          exercise_dateType: dateType_param
        }),
        ...(part_param === "전체" ? {} : {
          "exercise_section.exercise_part_val": part_param
        }),
        ...(title_param === "전체" ? {} : {
          "exercise_section.exercise_title_val": title_param
        }),
      }},
      {$project: {
        exercise_dateType: 1,
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
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
      {$sort: {exercise_dateStart: sort_param}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);
    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      ...(dateType_param === "전체" ? {} : {
        exercise_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      ...(dateType_param === "전체" ? {} : {
        exercise_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      exercise_demo: false,
      exercise_dateType: dateType_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      exercise_total_volume: OBJECT_param.exercise_total_volume,
      exercise_total_cardio: OBJECT_param.exercise_total_cardio,
      exercise_body_weight: OBJECT_param.exercise_body_weight,
      exercise_section: OBJECT_param.exercise_section,
      exercise_regDt: newDate,
      exercise_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
   const finalResult = await Exercise.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        exercise_dateType: dateType_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        exercise_total_volume: OBJECT_param.exercise_total_volume,
        exercise_total_cardio: OBJECT_param.exercise_total_cardio,
        exercise_body_weight: OBJECT_param.exercise_body_weight,
        exercise_section: OBJECT_param.exercise_section,
        exercise_updateDt: newDate,
      }}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      ...(dateType_param === "전체" ? {} : {
        exercise_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, section_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const updateResult = await Exercise.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        ...(dateType_param === "전체" ? {} : {
          exercise_dateType: dateType_param
        }),
      },
      {$pull: {
        exercise_section: {
          _id: section_id_param
        },
      },
      $set: {
        exercise_updateDt: newDate,
      }}
    )
    .lean();
    return updateResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await Exercise.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};