// exerciseRepository.ts

import mongoose from "mongoose";
import { Exercise } from "@schemas/exercise/Exercise";
import { timeToDecimal, decimalToTime } from "@scripts/utils";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Exercise.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_dateStart: {
          $lte: dateEnd_param
        },
        exercise_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
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

  const finalResult:any = await Exercise.countDocuments(
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
      ...dateType_param ? { exercise_dateType: dateType_param } : {},
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

  const finalResult:any = await Exercise.aggregate([
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
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
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
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Exercise.findOne(
    {
      user_id: user_id_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_dateType: dateType_param } : {},
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

  const finalResult:any = await Exercise.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      exercise_dummy: "N",
      exercise_dateType: dateType_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      exercise_total_volume: OBJECT_param.exercise_total_volume,
      exercise_total_cardio: OBJECT_param.exercise_total_cardio,
      exercise_total_weight: OBJECT_param.exercise_total_weight,
      exercise_section: OBJECT_param.exercise_section,
      exercise_regDt: new Date(),
      exercise_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = {

  // 1. update (기존항목 유지 + 타겟항목으로 수정)
  update: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Exercise.findOneAndUpdate(
      {
        user_id: user_id_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
      },
      {
        $set: {
          exercise_total_volume: OBJECT_param.exercise_total_volume,
          exercise_total_cardio: OBJECT_param.exercise_total_cardio,
          exercise_total_weight: OBJECT_param.exercise_total_weight,
          exercise_section: OBJECT_param.exercise_section,
          exercise_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  },

  // 2. insert (기존항목 제거 + 타겟항목에 추가)
  insert: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const findResult: any = await Exercise.findOne(
      {
        user_id: user_id_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
      },
    )
    .lean();

    const newVolume = String (
      parseFloat(findResult.exercise_total_volume) +
      parseFloat(OBJECT_param.exercise_total_volume)
    );
    const newCardio = String (
      decimalToTime(
        parseFloat(timeToDecimal(findResult.exercise_total_cardio)) +
        parseFloat(timeToDecimal(OBJECT_param.exercise_total_cardio))
      )
    );
    const newWeight = String (
      parseFloat(findResult.exercise_total_weight) +
      parseFloat(OBJECT_param.exercise_total_weight)
    );

    const finalResult:any = await Exercise.updateOne(
      {
        user_id: user_id_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
      },
      {
        $set: {
          exercise_total_volume: newVolume,
          exercise_total_cardio: newCardio,
          exercise_total_weight: newWeight,
          exercise_updateDt: new Date(),
        },
        $push: {
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
  },

  // 3. replace (기존항목 제거 + 타겟항목을 교체)
  replace: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await Exercise.findOneAndUpdate(
      {
        user_id: user_id_param,
        exercise_dateStart: dateStart_param,
        exercise_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_dateType: dateType_param } : {},
      },
      {
        $set: {
          exercise_total_volume: OBJECT_param.exercise_total_volume,
          exercise_total_cardio: OBJECT_param.exercise_total_cardio,
          exercise_total_weight: OBJECT_param.exercise_total_weight,
          exercise_section: OBJECT_param.exercise_section,
          exercise_updateDt: new Date(),
        }
      },
      {
        upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Exercise.findOneAndDelete(
    {
      user_id: user_id_param,
      exercise_dateStart: dateStart_param,
      exercise_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};