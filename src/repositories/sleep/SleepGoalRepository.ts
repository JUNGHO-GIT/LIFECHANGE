/**
 * @file SleepGoalRepository.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { incrementSeq } from "@schemas/Counter";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { SleepRecord } from "@schemas/sleep/SleepRecord";
import mongoose from "mongoose";

// 0. exist ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
      },
    },
    {
      $project: {
        _id: 0,
        sleep_goal_dateType: 1,
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
      },
    },
    {
      $sort: {
        sleep_goal_dateStart: 1,
      },
    },
  ]);

  return finalResult;
};

// 1. list (goal) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const listGoal = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {
  const finalResult: any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
      },
    },
    {
      $project: {
        _id: 0,
        sleep_goal_dateType: 1,
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      },
    },
    {
      $sort: {
        sleep_goal_dateStart: sort_param,
      },
    },
    // 클라이언트 페이저 UI 부재 → $limit 없는 $skip(page-1) 제거하여 전체 반환 보존
  ]);

  return finalResult;
};

// 1-2. list (record) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const listRecord = async (
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
      $unwind: `$sleep_section`,
    },
    {
      $project: {
        _id: 0,
        sleep_record_dateStart: 1,
        sleep_record_dateEnd: 1,
        sleep_record_dateType: 1,
        sleep_record_bedTime: `$sleep_section.sleep_record_bedTime`,
        sleep_record_wakeTime: `$sleep_section.sleep_record_wakeTime`,
        sleep_record_sleepTime: `$sleep_section.sleep_record_sleepTime`,
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

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepGoal.findOne({
    user_id: user_id_param,
    sleep_goal_dateStart: dateStart_param,
    sleep_goal_dateEnd: dateEnd_param,
    ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
  }).lean();

  return finalResult;
};

// 3. create ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepGoal.create({
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    sleep_goal_dateType: dateType_param,
    sleep_goal_dateStart: dateStart_param,
    sleep_goal_dateEnd: dateEnd_param,
    sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
    sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
    sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
    sleep_goal_regDt: new Date(),
    sleep_goal_updateDt: ``,
  });

  return finalResult;
};

// 4. update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
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
    const existDoc: any = await SleepGoal.findOne({
      user_id: user_id_param,
      sleep_goal_dateStart: dateStart_param,
      sleep_goal_dateEnd: dateEnd_param,
      ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          sleep_goal_number: await incrementSeq(
            `sleep_goal_number`,
            `SleepGoal`,
          ),
        };

    const finalResult: any = await SleepGoal.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_goal_dateStart: dateStart_param,
        sleep_goal_dateEnd: dateEnd_param,
        ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
      },
      {
        $set: {
          sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
          sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
          sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
          sleep_goal_updateDt: new Date(),
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

  // 3. replace (기존항목 제거 + 타겟항목을 교체)
  replace: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {
    // upsert 신규 삽입 시 pre('save') 미동작 → insert 일 때만 채번
    const existDoc: any = await SleepGoal.findOne({
      user_id: user_id_param,
      sleep_goal_dateStart: dateStart_param,
      sleep_goal_dateEnd: dateEnd_param,
      ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
    }).lean();
    const setOnInsert: any = existDoc
      ? {}
      : {
          sleep_goal_number: await incrementSeq(
            `sleep_goal_number`,
            `SleepGoal`,
          ),
        };

    const finalResult: any = await SleepGoal.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_goal_dateStart: dateStart_param,
        sleep_goal_dateEnd: dateEnd_param,
        ...(dateType_param ? { sleep_goal_dateType: dateType_param } : {}),
      },
      {
        $set: {
          sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
          sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
          sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
          sleep_goal_updateDt: new Date(),
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

// 5. delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {
  const finalResult: any = await SleepGoal.findOneAndDelete({
    user_id: user_id_param,
    sleep_goal_dateType: dateType_param,
    sleep_goal_dateStart: dateStart_param,
    ...(dateEnd_param ? { sleep_goal_dateEnd: dateEnd_param } : {}),
  }).lean();

  return finalResult;
};
