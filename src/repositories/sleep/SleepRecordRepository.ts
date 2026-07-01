/**
 * @file SleepRecordRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { incrementSeq } from "@schemas/Counter";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import mongoose from "mongoose";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_record_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_record_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
      },
    },
    {
      $project: {
        _id: 0,
        sleep_record_dateType: 1,
        sleep_record_dateStart: 1,
        sleep_record_dateEnd: 1,
      },
    },
    {
      $sort: {
        sleep_record_dateStart: 1,
      },
    },
  ]);

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
  const finalResult: any = await SleepRecord.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_record_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        sleep_record_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param,
        },
        ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
      },
    },
    {
      $project: {
        _id: 1,
        sleep_record_dateType: 1,
        sleep_record_dateStart: 1,
        sleep_record_dateEnd: 1,
        sleep_section: 1,
        sleep_record_regDt: 1,
        sleep_record_updateDt: 1,
      },
    },
    {
      $sort: {
        sleep_record_dateStart: sort_param,
      },
    },
    // pagination/grouping is handled in service layer to ensure unique dates
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
  const finalResult: any = await SleepRecord.findOne({
    user_id: user_id_param,
    sleep_record_dateStart: dateStart_param,
    sleep_record_dateEnd: dateEnd_param,
    ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
  }).lean();

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
  const finalResult: any = await SleepRecord.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    sleep_record_dateType: dateType_param,
    sleep_record_dateStart: dateStart_param,
    sleep_record_dateEnd: dateEnd_param,
    sleep_section: OBJECT_param.sleep_section,
    sleep_record_regDt: new Date(),
    sleep_record_updateDt: ``,
  });

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
    // upsert 신규 삽입 시 pre('save') 미동작 → insert 일 때만 채번
    const existDoc: any = await SleepRecord.findOne({
      user_id: user_id_param,
      sleep_record_dateStart: dateStart_param,
      sleep_record_dateEnd: dateEnd_param,
      ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          sleep_record_number: await incrementSeq(
            `sleep_record_number`,
            `SleepRecord`,
          ),
        };

    const finalResult: any = await SleepRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_record_dateStart: dateStart_param,
        sleep_record_dateEnd: dateEnd_param,
        ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
      },
      {
        $set: {
          sleep_section: OBJECT_param.sleep_section,
          sleep_record_updateDt: new Date(),
        },
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
        returnDocument: `after`,
      },
    ).lean();

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
    // upsert 신규 삽입 시 pre('save') 미동작 → insert 일 때만 채번
    const existDoc: any = await SleepRecord.findOne({
      user_id: user_id_param,
      sleep_record_dateStart: dateStart_param,
      sleep_record_dateEnd: dateEnd_param,
      ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          sleep_record_number: await incrementSeq(
            `sleep_record_number`,
            `SleepRecord`,
          ),
        };

    const finalResult: any = await SleepRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_record_dateStart: dateStart_param,
        sleep_record_dateEnd: dateEnd_param,
        ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
      },
      {
        $set: {
          sleep_section: OBJECT_param.sleep_section,
          sleep_record_updateDt: new Date(),
        },
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
        returnDocument: `after`,
      },
    ).lean();

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
    // upsert 신규 삽입 시 pre('save') 미동작 → insert 일 때만 채번
    const existDoc: any = await SleepRecord.findOne({
      user_id: user_id_param,
      sleep_record_dateStart: dateStart_param,
      sleep_record_dateEnd: dateEnd_param,
      ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          sleep_record_number: await incrementSeq(
            `sleep_record_number`,
            `SleepRecord`,
          ),
        };

    const finalResult: any = await SleepRecord.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_record_dateStart: dateStart_param,
        sleep_record_dateEnd: dateEnd_param,
        ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
      },
      {
        $set: {
          sleep_section: OBJECT_param.sleep_section,
          sleep_record_updateDt: new Date(),
        },
        $setOnInsert: setOnInsert,
      },
      {
        upsert: true,
        returnDocument: `after`,
      },
    ).lean();

    return finalResult;
  },
};

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepRecord.findOneAndDelete({
    user_id: user_id_param,
    sleep_record_dateStart: dateStart_param,
    sleep_record_dateEnd: dateEnd_param,
    ...(dateType_param ? { sleep_record_dateType: dateType_param } : {}),
  }).lean();

  return finalResult;
};
