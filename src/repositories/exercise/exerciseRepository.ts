// exerciseRepository.ts

import mongoose from "mongoose";
import { Exercise } from "@schemas/exercise/Exercise";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $lte: dateEnd_param
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          exercise_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 0,
        exercise_dateType: 1,
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
      }
    },
    {
      $sort: {
        exercise_dateStart: 1
      }
    }
  ]);

  return finalResult;
};

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.countDocuments(
    {
      user_id: user_id_param,
      exercise_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      exercise_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...dateType_param ? {
        exercise_dateType: dateType_param
      } : {},
    }
  );

  return finalResult;
};

// 1. list -----------------------------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {

  const finalResult = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          exercise_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 1,
        exercise_dateType: 1,
        exercise_dateStart: 1,
        exercise_dateEnd: 1,
        exercise_total_volume: 1,
        exercise_total_cardio: 1,
        exercise_total_weight: 1,
      }
    },
    {
      $sort: {
        exercise_dateStart: sort_param
      }
    },
    {
      $skip: (Number(page_param) - 1)
    }
  ]);

  return finalResult;
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      exercise_dateStart: {
        $eq: dateStart_param
      },
      exercise_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        exercise_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      exercise_dummy: "N",
      exercise_dateType: dateType_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      exercise_total_volume: OBJECT_param.exercise_total_volume,
      exercise_total_cardio: OBJECT_param.exercise_total_cardio,
      exercise_total_weight: OBJECT_param.exercise_total_weight,
      exercise_section: OBJECT_param.exercise_section,
      exercise_regDt: newDate,
      exercise_updateDt: "",
    }
  );

  return finalResult;
};

// 4. insert ---------------------------------------------------------------------------------------
export const insert = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      exercise_dateStart: {
        $eq: dateStart_param
      },
      exercise_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        exercise_dateType: dateType_param
      } : {},
    },
    {
      $set: {
        exercise_total_volume: OBJECT_param.exercise_total_volume,
        exercise_total_cardio: OBJECT_param.exercise_total_cardio,
        exercise_total_weight: OBJECT_param.exercise_total_weight,
        exercise_updateDt: newDate,
      },
      $addToSet: {
        exercise_section: OBJECT_param.exercise_section
      }
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 5. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      exercise_dateStart: {
        $eq: dateStart_param
      },
      exercise_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        exercise_dateType: dateType_param
      } : {},
    },
    {
      exercise_total_volume: OBJECT_param.exercise_total_volume,
      exercise_total_cardio: OBJECT_param.exercise_total_cardio,
      exercise_total_weight: OBJECT_param.exercise_total_weight,
      exercise_section: OBJECT_param.exercise_section,
      exercise_updateDt: newDate,
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 6. delete --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Exercise.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      exercise_dateStart: {
        $eq: dateStart_param
      },
      exercise_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        exercise_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};