// moneyGoalRepository.ts

import mongoose from "mongoose";
import { MoneyGoal } from "@schemas/money/MoneyGoal";
import { Money } from "@schemas/money/Money";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await MoneyGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          money_goal_dateType: dateType_param
        } : {},
      }
    },
    {
      $match: {
        money_goal_dateType: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        existDate: {
          $addToSet: "$money_goal_dateStart"
        }
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

  const finalResult = await MoneyGoal.countDocuments(
    {
      user_id: user_id_param,
      money_goal_dateStart: {
        $lte: dateEnd_param,
      },
      money_goal_dateEnd: {
        $gte: dateStart_param,
      },
      ...dateType_param ? {
        money_goal_dateType: dateType_param
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

  const finalResult = await MoneyGoal.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_goal_dateStart: {
          $lte: dateEnd_param,
        },
        money_goal_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          money_goal_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 1,
        money_goal_dateType: 1,
        money_goal_dateStart: 1,
        money_goal_dateEnd: 1,
        money_goal_income: 1,
        money_goal_expense: 1,
      }
    },
    {
      $sort: {
        money_goal_dateStart: sort_param
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

  const finalResult = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        money_dateEnd: {
          $gte: dateStart_param,
          $lte: dateEnd_param
        },
        ...dateType_param ? {
          money_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 1,
        money_dateType: 1,
        money_dateStart: 1,
        money_dateEnd: 1,
        money_income: 1,
        money_expense: 1,
      }
    },
    {
      $sort: {
        money_dateStart: 1
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

  const finalResult = await MoneyGoal.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      money_goal_dateStart: {
        $eq: dateStart_param,
      },
      money_goal_dateEnd: {
        $eq: dateEnd_param,
      },
      ...dateType_param ? {
        money_goal_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await MoneyGoal.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      money_goal_dummy: "N",
      money_goal_dateType: dateType_param,
      money_goal_dateStart: dateStart_param,
      money_goal_dateEnd: dateEnd_param,
      money_goal_income: OBJECT_param.money_goal_income,
      money_goal_expense: OBJECT_param.money_goal_expense,
      money_goal_regDt: newDate,
      money_goal_updateDt: "",
    }
  );

  return finalResult;
};

// 4. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await MoneyGoal.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param
    },
    {
      $set: {
        money_goal_dateType: dateType_param,
        money_goal_dateStart: dateStart_param,
        money_goal_dateEnd: dateEnd_param,
        money_goal_income: OBJECT_param.money_goal_income,
        money_goal_expense: OBJECT_param.money_goal_expense,
        money_goal_updateDt: newDate
      }
    },
    {
      upsert: true,
      new: false
    }
  )
  .lean();

  return finalResult;
};

// 5. delete --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
) => {

  const finalResult = await MoneyGoal.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
    }
  )
  .lean();

  return finalResult;
};