// sleepGoalRepository.ts

import mongoose from "mongoose";
import { SleepGoal } from "@schemas/sleep/SleepGoal";
import { Sleep } from "@schemas/sleep/Sleep";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          sleep_goal_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 0,
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

  const finalResult = await SleepGoal.countDocuments(
    {
      user_id: user_id_param,
      sleep_goal_dateStart: {
        $lte: dateEnd_param,
      },
      sleep_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? {
        sleep_goal_dateType: dateType_param
      } : {},
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

  const finalResult = await SleepGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        sleep_goal_dateStart: {
          $lte: dateEnd_param,
        },
        sleep_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          sleep_goal_dateType: dateType_param
        } : {},
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

  const finalResult = await Sleep.aggregate([
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
        ...dateType_param ? {
          sleep_dateType: dateType_param
        } : {},
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
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await SleepGoal.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      sleep_goal_dateStart: {
        $eq: dateStart_param,
      },
      sleep_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...dateType_param ? {
        sleep_goal_dateType: dateType_param
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

  const finalResult = await SleepGoal.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      sleep_goal_dummy: "N",
      sleep_goal_dateType: dateType_param,
      sleep_goal_dateStart: dateStart_param,
      sleep_goal_dateEnd: dateEnd_param,
      sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
      sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
      sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
      sleep_goal_regDt: newDate,
      sleep_goal_updateDt: "",
    }
  );

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

  const finalResult = await SleepGoal.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      sleep_goal_dateStart: {
        $eq: dateStart_param,
      },
      sleep_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...dateType_param ? {
        sleep_goal_dateType: dateType_param
      } : {},
    },
    {
      $set: {
        sleep_goal_dateType: dateType_param,
        sleep_goal_dateStart: dateStart_param,
        sleep_goal_dateEnd: dateEnd_param,
        sleep_goal_bedTime: OBJECT_param.sleep_goal_bedTime,
        sleep_goal_wakeTime: OBJECT_param.sleep_goal_wakeTime,
        sleep_goal_sleepTime: OBJECT_param.sleep_goal_sleepTime,
        sleep_goal_updateDt: newDate
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

// 6. delete --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await SleepGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      sleep_goal_dateType: {
        $eq: dateType_param
      },
      sleep_goal_dateStart: {
        $eq: dateStart_param
      },
      ...dateEnd_param ? {
        sleep_goal_dateEnd: dateEnd_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};