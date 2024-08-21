// exerciseGoalRepository.js

import mongoose from "mongoose";
import { ExerciseGoal } from "../../schema/exercise/ExerciseGoal.js";
import { Exercise } from "../../schema/exercise/Exercise.js";
import { newDate } from "../../assets/js/date.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = {

  // exercise_dateType 이 존재하는 경우
  exist: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          exercise_goal_dateType: dateType_param
        }),
      }},
      {$match: {
        exercise_goal_dateType: {$exists: true}
      }},
      {$group: {
        _id: null,
        existDate: {$addToSet: "$exercise_goal_dateStart"}
      }}
    ]);
    return finalResult;
  }
};

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = {

  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await ExerciseGoal.countDocuments({
      user_id: user_id_param,
      exercise_goal_dateStart: {
        $lte: dateEnd_param,
      },
      exercise_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        exercise_goal_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  listGoal: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param, page_param,
  ) => {
    const finalResult = await ExerciseGoal.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_goal_dateStart: {
          $lte: dateEnd_param,
        },
        exercise_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...((!dateType_param || dateType_param === "") ? {} : {
          exercise_goal_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        exercise_goal_dateType: 1,
        exercise_goal_dateStart: 1,
        exercise_goal_dateEnd: 1,
        exercise_goal_count: 1,
        exercise_goal_volume: 1,
        exercise_goal_cardio: 1,
        exercise_goal_weight: 1,
      }},
      {$sort: {exercise_goal_dateStart: sort_param}},
      {$skip: Number(page_param - 1)},
    ]);
    return finalResult;
  },

  listReal: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param
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
        ...((!dateType_param || dateType_param === "") ? {} : {
          exercise_dateType: dateType_param
        }),
      }},
      {$project: {
        _id: 1,
        exercise_dateType: "$exercise_dateType",
        exercise_dateStart: "$exercise_dateStart",
        exercise_dateEnd: "$exercise_dateEnd",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_total_weight: "$exercise_total_weight"
      }},
      {$sort: {exercise_dateStart: 1 }},
    ]);
    return finalResult;
  },
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_goal_dateStart: {
        $eq: dateStart_param,
      },
      exercise_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        exercise_goal_dateType: dateType_param
      }),
    });
    return finalResult;
  }
};

// 3. save -----------------------------------------------------------------------------------------
export const save = {
  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_goal_dateStart: {
        $eq: dateStart_param,
      },
      exercise_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        exercise_goal_dateType: dateType_param
      }),
    });
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      exercise_goal_dummy: "N",
      exercise_goal_dateType: dateType_param,
      exercise_goal_dateStart: dateStart_param,
      exercise_goal_dateEnd: dateEnd_param,
      exercise_goal_count: OBJECT_param.exercise_goal_count,
      exercise_goal_volume: OBJECT_param.exercise_goal_volume,
      exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
      exercise_goal_weight: OBJECT_param.exercise_goal_weight,
      exercise_goal_regDt: newDate,
      exercise_goal_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        exercise_goal_dateType: dateType_param,
        exercise_goal_dateStart: dateStart_param,
        exercise_goal_dateEnd: dateEnd_param,
        exercise_goal_count: OBJECT_param.exercise_goal_count,
        exercise_goal_volume: OBJECT_param.exercise_goal_volume,
        exercise_goal_cardio: OBJECT_param.exercise_goal_cardio,
        exercise_goal_weight: OBJECT_param.exercise_goal_weight,
        exercise_goal_updateDt: newDate,
      }},
      {upsert: true, new: true}
    )
    .lean();
    return finalResult;
  }
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = {

  detail: async (
    user_id_param, _id_param,
    dateType_param, dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExerciseGoal.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_goal_dateStart: {
        $eq: dateStart_param,
      },
      exercise_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...((!dateType_param || dateType_param === "") ? {} : {
        exercise_goal_dateType: dateType_param
      }),
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await ExerciseGoal.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};