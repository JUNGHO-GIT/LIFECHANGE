// sleepGoalRepository.ts

import mongoose from "mongoose";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { Sleep } from "@schemas/sleep/Sleep";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { sleep_goal_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        sleep_goal_dateType: 1,
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
      }
    },
    {
      $sort: {
        sleep_goal_dateStart: 1
      }
    }
  ]);

  return finalResult;
}

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await SleepGoal.countDocuments(
    {
      user_id: user_id_param,
      sleep_goal_dateStart: {
        $lte: dateEnd_param,
      },
      sleep_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? { sleep_goal_dateType: dateType_param } : {},
    }
  );

  return finalResult;
};

// 1. list (goal) ----------------------------------------------------------------------------------
export const listGoal = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
  sort_param: 1 | -1,
  page_param: number,
) => {

  const finalResult:any = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { sleep_goal_dateType: dateType_param } : {},
      }
    },
    {
      $project: {
        _id: 1,
        sleep_goal_dateType: 1,
        sleep_goal_dateStart: 1,
        sleep_goal_dateEnd: 1,
        sleep_goal_bedTime: 1,
        sleep_goal_wakeTime: 1,
        sleep_goal_sleepTime: 1,
      }
    },
    {
      $sort: {
        sleep_goal_dateStart: sort_param
      }
    },
    {
      $skip: Number(page_param - 1)
    }
  ]);

  return finalResult;
};

// 1-2. list (real) --------------------------------------------------------------------------------
export const listReal = async (
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
        sleep_dateStart: 1,
        sleep_dateEnd: 1,
        sleep_dateType: 1,
        sleep_bedTime: "$sleep_section.sleep_bedTime",
        sleep_wakeTime: "$sleep_section.sleep_wakeTime",
        sleep_sleepTime: "$sleep_section.sleep_sleepTime",
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

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await SleepGoal.findOne(
    {
      user_id: user_id_param,
      sleep_goal_dateStart: dateStart_param,
      sleep_goal_dateEnd: dateEnd_param,
      ...dateType_param ? { sleep_goal_dateType: dateType_param } : {},
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

  const finalResult:any = await SleepGoal.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      sleep_goal_dateType: dateType_param,
      sleep_goal_dateStart: dateStart_param,
      sleep_goal_dateEnd: dateEnd_param,
      sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
      sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
      sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
      sleep_goal_regDt: new Date(),
      sleep_goal_updateDt: "",
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

    const finalResult:any = await SleepGoal.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_goal_dateStart: dateStart_param,
        sleep_goal_dateEnd: dateEnd_param,
        ...dateType_param ? { sleep_goal_dateType: dateType_param } : {},
      },
      {
        $set: {
          sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
          sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
          sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
          sleep_goal_updateDt: new Date(),
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

  // 3. replace (기존항목 제거 + 타겟항목을 교체)
  replace: async (
    user_id_param: string,
    OBJECT_param: any,
    dateType_param: string,
    dateStart_param: string,
    dateEnd_param: string,
  ) => {

    const finalResult:any = await SleepGoal.findOneAndUpdate(
      {
        user_id: user_id_param,
        sleep_goal_dateStart: dateStart_param,
        sleep_goal_dateEnd: dateEnd_param,
        ...dateType_param ? { sleep_goal_dateType: dateType_param } : {},
      },
      {
        $set: {
          sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
          sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
          sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
          sleep_goal_updateDt: new Date(),
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

  const finalResult:any = await SleepGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      sleep_goal_dateType: dateType_param,
      sleep_goal_dateStart: dateStart_param,
      ...dateEnd_param ? { sleep_goal_dateEnd: dateEnd_param } : {},
    }
  )
  .lean();

  return finalResult;
};