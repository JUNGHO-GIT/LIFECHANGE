// exercisePlanRepository.js

import mongoose from "mongoose";
import {Exercise} from "../../schema/exercise/Exercise.js";
import {newDate} from "../../assets/js/date.js";

// 0. exist --------------------------------------------------------------------------------------->
export const exist = {

  // exercise_section 의 length 가 0 이상인 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...(dateType_param === "전체" ? {} : {
          exercise_dateType: dateType_param
        }),
      }},
      {$match: {$expr: {
        $gt: [{$size: "$exercise_section"}, 0]
      }}},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$exercise_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await Exercise.countDocuments({
      user_id: user_id_param,
      exercise_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      exercise_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
      }},
      {$project: {
        exercise_dateType: 1,
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1,
        exercise_total_cardio: 1,
        exercise_body_weight: 1,
      }},
      {$sort: {exercise_dateStart: sort_param}},
      {$skip: (Number(page_param) - 1)}
    ]);
    return finalResult;
  },
};

// 2. detail (상세는 eq) -------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await Exercise.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_dateStart: {
        $eq: dateStart_param,
      },
      exercise_dateEnd: {
        $eq: dateEnd_param,
      },
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
      exercise_dateStart: {
        $eq: dateStart_param,
      },
      exercise_dateEnd: {
        $eq: dateEnd_param,
      },
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
      exercise_dateStart: {
        $eq: dateStart_param,
      },
      exercise_dateEnd: {
        $eq: dateEnd_param,
      },
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
        exercise_dateStart: {
          $eq: dateStart_param,
        },
        exercise_dateEnd: {
          $eq: dateEnd_param,
        },
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