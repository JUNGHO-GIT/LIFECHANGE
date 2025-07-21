// sleepRepository.ts

import mongoose from "mongoose";
import { Sleep } from "@schemas/sleep/Sleep";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { sleep_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        sleep_dateType: 1,
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
      }
    },
    {
      $sort: {
        sleep_dateStart: 1
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

  const finalResult:any = await Sleep.countDocuments(
    {
      user_id: user_id_param,
      sleep_dateStart: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      sleep_dateEnd: {
        $gte: dateStart_param,
        $lte: dateEnd_param
      },
      ...dateType_param ? { sleep_dateType: dateType_param } : {},
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

  const finalResult:any = await Sleep.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        sleep_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? { sleep_dateType: dateType_param } : {},
      }
    },
    {
      $unwind: "$sleep_section"
    },
    {
      $project: {
        _id: 1,
        sleep_dateType: 1,
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_section: [{
          _id: "$sleep_section._id",
          sleep_bedTime: "$sleep_section.sleep_bedTime",
          sleep_wakeTime: "$sleep_section.sleep_wakeTime",
          sleep_sleepTime: "$sleep_section.sleep_sleepTime",
        }]
      }
    },
    {
      $sort: {
        sleep_dateStart: sort_param
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

  const finalResult:any = await Sleep.findOne(
    {
      user_id: user_id_param,
      sleep_dateStart: dateStart_param,
      sleep_dateEnd: dateEnd_param,
      ...dateType_param ? { sleep_dateType: dateType_param } : {},
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

  const finalResult:any = await Sleep.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      sleep_dateType: dateType_param,
      sleep_dateStart: dateStart_param,
      sleep_dateEnd: dateEnd_param,
      sleep_section: OBJECT_param.sleep_section,
      sleep_regDt: new Date(),
      sleep_updateDt: "",
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

    const finalResult:any = await Sleep.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_dateStart: dateStart_param,
        sleep_dateEnd: dateEnd_param,
        ...dateType_param ? { sleep_dateType: dateType_param } : {},
      },
      {
        $set: {
          sleep_section: OBJECT_param.sleep_section,
          sleep_updateDt: new Date(),
        },
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

    const finalResult:any = await Sleep.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_dateStart: dateStart_param,
        sleep_dateEnd: dateEnd_param,
        ...dateType_param ? { sleep_dateType: dateType_param } : {},
      },
      {
        $set: {
          sleep_section: OBJECT_param.sleep_section,
          sleep_updateDt: new Date(),
        },
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

    const finalResult:any = await Sleep.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_dateStart: dateStart_param,
        sleep_dateEnd: dateEnd_param,
        ...dateType_param ? { sleep_dateType: dateType_param } : {},
      },
      {
        $set: {
          sleep_section: OBJECT_param.sleep_section,
          sleep_updateDt: new Date(),
        },
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

  const finalResult:any = await Sleep.findOneAndDelete(
    {
      user_id: user_id_param,
      sleep_dateStart: dateStart_param,
      sleep_dateEnd: dateEnd_param,
      ...dateType_param ? { sleep_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};