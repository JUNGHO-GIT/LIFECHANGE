// moneyRepository.ts

import mongoose from "mongoose";
import { Money } from "@schemas/money/Money";
import { newDate } from "@scripts/date";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
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
          $lte: dateEnd_param
        },
        money_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? {
          money_dateType: dateType_param
        } : {},
      }
    },
    {
      $project: {
        _id: 0,
        money_dateType: 1,
        money_dateStart: 1,
        money_dateEnd: 1,
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

// 0. cnt ------------------------------------------------------------------------------------------
export const cnt = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult = await Money.countDocuments(
    {
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
        money_total_income: 1,
        money_total_expense: 1,
      }
    },
    {
      $sort: {
        money_dateStart: sort_param
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

  const finalResult = await Money.findOne(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      money_dateStart: {
        $eq: dateStart_param
      },
      money_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        money_dateType: dateType_param
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

  const finalResult = await Money.create(
    {
      user_id: user_id_param,
      _id: new mongoose.Types.ObjectId(),
      money_dummy: "N",
      money_dateType: dateType_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      money_total_income: OBJECT_param.money_total_income,
      money_total_expense: OBJECT_param.money_total_expense,
      money_section: OBJECT_param.money_section,
      money_regDt: newDate,
      money_updateDt: "",
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

  const finalResult = await Money.findOneAndUpdate(
    {
      user_id: user_id_param,
      _id: !_id_param ? { $exists: true } : _id_param,
      money_dateStart: {
        $eq: dateStart_param
      },
      money_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        money_dateType: dateType_param
      } : {},
    },
    {
      $set: {
        money_dateType: dateType_param,
        money_dateStart: dateStart_param,
        money_dateEnd: dateEnd_param,
        money_total_income: OBJECT_param.money_total_income,
        money_total_expense: OBJECT_param.money_total_expense,
        money_updateDt: newDate,
      },
      $push: {
        money_section: OBJECT_param.money_section
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

  const finalResult = await Money.findOneAndDelete(
    {
      user_id: user_id_param,
      _id: !_id_param ? {$exists:true} : _id_param,
      money_dateStart: {
        $eq: dateStart_param
      },
      money_dateEnd: {
        $eq: dateEnd_param
      },
      ...dateType_param ? {
        money_dateType: dateType_param
      } : {},
    }
  )
  .lean();

  return finalResult;
};