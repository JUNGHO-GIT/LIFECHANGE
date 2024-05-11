// exercisePlanRepository.js

import mongoose from "mongoose";
import {Exercise} from "../schema/Exercise.js";
import {ExercisePlan} from "../schema/ExercisePlan.js";
import {fmtDate, newDate} from "../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      user_id: user_id_param,
      exercise_plan_startDt: {
        $lte: endDt_param,
      },
      exercise_plan_endDt: {
        $gte: startDt_param,
      },
    });
    return finalResult;
  },

  listPlan: async (
    user_id_param, sort_param, limit_param, page_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_startDt: {
          $lte: endDt_param,
        },
        exercise_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$sort: {
        exercise_plan_startDt: sort_param,
        exercise_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },

  list: async (
    user_id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await Exercise.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_startDt: {
          $lte: endDt_param,
        },
        exercise_endDt: {
          $gte: startDt_param
        }
      }},
      {$project: {
        _id: 1,
        exercise_startDt: "$exercise_startDt",
        exercise_endDt: "$exercise_endDt",
        exercise_total_count: "$exercise_total_count",
        exercise_total_volume: "$exercise_total_volume",
        exercise_total_cardio: "$exercise_total_cardio",
        exercise_body_weight: "$exercise_body_weight",
      }}
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    });
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  list: async (
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    });
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      exercise_plan_demo: false,
      exercise_plan_startDt: startDt_param,
      exercise_plan_endDt: endDt_param,
      exercise_plan_count: OBJECT_param.exercise_plan_count,
      exercise_plan_volume: OBJECT_param.exercise_plan_volume,
      exercise_plan_cardio: OBJECT_param.exercise_plan_cardio,
      exercise_plan_weight: OBJECT_param.exercise_plan_weight,
      exercise_plan_regDt: newDate,
      exercise_plan_updateDt: "",
    });
    return finalResult;
  },

  update: async (
    user_id_param, _id_param, OBJECT_param,startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        exercise_plan_startDt: startDt_param,
        exercise_plan_endDt: endDt_param,
        exercise_plan_count: OBJECT_param.exercise_plan_count,
        exercise_plan_volume: OBJECT_param.exercise_plan_volume,
        exercise_plan_cardio: OBJECT_param.exercise_plan_cardio,
        exercise_plan_weight: OBJECT_param.exercise_plan_weight,
        exercise_plan_updateDt: newDate,
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
    user_id_param, _id_param, startDt_param, endDt_param
  ) => {
    const finalResult = await ExercisePlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_plan_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      exercise_plan_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
    })
    .lean();
    return finalResult;
  },

  deletes: async (
    user_id_param, _id_param
  ) => {
    const deleteResult = await ExercisePlan.deleteOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param
    })
    .lean();
    return deleteResult;
  }
};