// exercisePlanRepository.js

import mongoose from "mongoose";
import {ExercisePlan} from "../../schema/exercise/ExercisePlan.js";
import {newDate} from "../../assets/js/date.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  cnt: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
  ) => {
    const finalResult = await ExercisePlan.countDocuments({
      user_id: user_id_param,
      exercise_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
      exercise_plan_date_start: {
        $lte: dateEnd_param,
      },
      exercise_plan_date_end: {
        $gte: dateStart_param,
      },
    });
    return finalResult;
  },

  list: async (
    user_id_param,
    dateType_param, dateStart_param, dateEnd_param,
    sort_param,
    limit_param, page_param,
  ) => {
    const finalResult = await ExercisePlan.aggregate([
      {$match: {
        user_id: user_id_param,
        exercise_plan_date_type: !dateType_param ? {$exists:false} : dateType_param,
        exercise_plan_date_start: {
          $lte: dateEnd_param,
        },
        exercise_plan_date_end: {
          $gte: dateStart_param,
        }
      }},
      {$sort: {
        exercise_plan_date_start: sort_param,
        exercise_plan_date_end: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      exercise_plan_date_end: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    });
    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  list: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      exercise_plan_date_end: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
    });
    return finalResult;
  },

  create: async (
    user_id_param, OBJECT_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.create({
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      exercise_plan_demo: false,
      exercise_plan_date_type: OBJECT_param.exercise_plan_date_type,
      exercise_plan_date_start: dateStart_param,
      exercise_plan_date_end: dateEnd_param,
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
    user_id_param, _id_param, OBJECT_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.findOneAndUpdate(
      {user_id: user_id_param,
        _id: !_id_param ? {$exists:true} : _id_param
      },
      {$set: {
        exercise_plan_date_type: OBJECT_param.exercise_plan_date_type,
        exercise_plan_date_start: dateStart_param,
        exercise_plan_date_end: dateEnd_param,
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

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = {

  detail: async (
    user_id_param, _id_param,
    dateStart_param, dateEnd_param
  ) => {
    const finalResult = await ExercisePlan.findOne({
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_plan_date_start: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
      },
      exercise_plan_date_end: {
        $gte: dateStart_param,
        $lte: dateEnd_param,
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