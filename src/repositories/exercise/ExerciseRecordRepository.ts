// exerciseRecordRepository.ts

import mongoose from "mongoose";
import { fnTimeToDecimal, fnDecimalToTime } from "@assets/scripts/utils";
import { ExerciseRecord } from "@schemas/exercise/ExerciseRecord";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $lte: dateEnd_param
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateType: 1,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
      }
    },
    {
      $sort: {
        exercise_record_dateStart: 1
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

  const finalResult:any = await ExerciseRecord.countDocuments(
    {
      user_id: user_id_param,
      exercise_record_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      exercise_record_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
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

  const finalResult:any = await ExerciseRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        exercise_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        exercise_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 0,
        exercise_record_dateType: 1,
        exercise_record_dateStart: 1,
        exercise_record_dateEnd: 1,
        exercise_record_total_volume: 1,
        exercise_record_total_cardio: 1,
        exercise_record_total_scale: 1,
      }
    },
    {
      $sort: {
        exercise_record_dateStart: sort_param
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

  const finalResult:any = await ExerciseRecord.findOne(
    {
      user_id: user_id_param,
      exercise_record_dateStart: dateStart_param,
      exercise_record_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
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

  const finalResult:any = await ExerciseRecord.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      exercise_record_dateType: dateType_param,
      exercise_record_dateStart: dateStart_param,
      exercise_record_dateEnd: dateEnd_param,
      exercise_record_total_volume: OBJECT_param.exercise_record_total_volume,
      exercise_record_total_cardio: OBJECT_param.exercise_record_total_cardio,
      exercise_record_total_scale: OBJECT_param.exercise_record_total_scale,
      exercise_section: OBJECT_param.exercise_section,
      exercise_record_regDt: new Date(),
      exercise_record_updateDt: "",
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

    const finalResult:any = await ExerciseRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        exercise_record_dateStart: dateStart_param,
        exercise_record_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
      },
      {
        $set: {
          exercise_record_total_volume: OBJECT_param.exercise_record_total_volume,
          exercise_record_total_cardio: OBJECT_param.exercise_record_total_cardio,
          exercise_record_total_scale: OBJECT_param.exercise_record_total_scale,
          exercise_section: OBJECT_param.exercise_section,
          exercise_record_updateDt: new Date(),
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

    const findResult: any = await ExerciseRecord.findOne(
      {
        user_id: user_id_param,
        exercise_record_dateStart: dateStart_param,
        exercise_record_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
      },
    )
    .lean();

    const newVolume = String (
      parseFloat(findResult.exercise_record_total_volume) +
      parseFloat(OBJECT_param.exercise_record_total_volume)
    );
    const newCardio = String (
      fnDecimalToTime(
        parseFloat(String(fnTimeToDecimal(findResult.exercise_record_total_cardio))) +
        parseFloat(String(fnTimeToDecimal(OBJECT_param.exercise_record_total_cardio)))
      )
    );
    const newScale = String (
      parseFloat(findResult.exercise_record_total_scale) +
      parseFloat(OBJECT_param.exercise_record_total_scale)
    );

    const finalResult:any = await ExerciseRecord.updateOne(
      {
        user_id: user_id_param,
        exercise_record_dateStart: dateStart_param,
        exercise_record_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
      },
      {
        $set: {
          exercise_record_total_volume: newVolume,
          exercise_record_total_cardio: newCardio,
          exercise_record_total_scale: newScale,
          exercise_record_updateDt: new Date(),
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

    const finalResult:any = await ExerciseRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        exercise_record_dateStart: dateStart_param,
        exercise_record_dateEnd: dateEnd_param,
        ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
      },
      {
        $set: {
          exercise_record_total_volume: OBJECT_param.exercise_record_total_volume,
          exercise_record_total_cardio: OBJECT_param.exercise_record_total_cardio,
          exercise_record_total_scale: OBJECT_param.exercise_record_total_scale,
          exercise_section: OBJECT_param.exercise_section,
          exercise_record_updateDt: new Date(),
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

  const finalResult:any = await ExerciseRecord.findOneAndDelete(
    {
      user_id: user_id_param,
      exercise_record_dateStart: dateStart_param,
      exercise_record_dateEnd: dateEnd_param,
      ...dateType_param ? { exercise_record_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};