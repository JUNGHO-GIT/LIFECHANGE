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

  const finalResult:any = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_dateStart: {
          $lte: dateEnd_param
        },
        money_dateEnd: {
          $gte: dateStart_param,
        },
        ...dateType_param ? { money_dateType: dateType_param } : {},
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

  const finalResult:any = await Money.countDocuments(
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
      ...dateType_param ? { money_dateType: dateType_param } : {},
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

  const finalResult:any = await Money.aggregate([
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
        ...dateType_param ? { money_dateType: dateType_param } : {},
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
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Money.findOne(
    {
      user_id: user_id_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      ...dateType_param ? { money_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};

// 3. create (기존항목 제거 + 타겟항목에 생성) -----------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Money.create(
    {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
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

// 4. insert (기존항목 유지 + 타겟항목에 끼워넣기) -------------------------------------------------
export const insert = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const findResult: any = await Money.findOne(
    {
      user_id: user_id_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      ...dateType_param ? { money_dateType: dateType_param } : {},
    },
  )
  .lean();

  const newIncome = String (
    parseFloat(findResult.money_total_income) +
    parseFloat(OBJECT_param.money_total_income)
  );
  const newExpense = String (
    parseFloat(findResult.money_total_expense) +
    parseFloat(OBJECT_param.money_total_expense)
  );

  const finalResult:any = await Money.updateOne(
    {
      user_id: user_id_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      ...dateType_param ? { money_dateType: dateType_param } : {},
    },
    {
      $set: {
        money_total_income: newIncome,
        money_total_expense: newExpense,
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

// 5. replace (기존항목 유지 + 타겟항목을 대체) ----------------------------------------------------
export const replace = async (
  user_id_param: string,
  OBJECT_param: any,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Money.findOneAndUpdate(
    {
      user_id: user_id_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      ...dateType_param ? { money_dateType: dateType_param } : {},
    },
    {
      $set: {
        money_total_income: OBJECT_param.money_total_income,
        money_total_expense: OBJECT_param.money_total_expense,
        money_section: OBJECT_param.money_section,
        money_updateDt: newDate,
      },
    },
    {
      upsert: true,
      new: true
    }
  )
  .lean();

  return finalResult;
};

// 6. delete (타겟항목 제거) -----------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  dateType_param: string,
  dateStart_param: string,
  dateEnd_param: string,
) => {

  const finalResult:any = await Money.findOneAndDelete(
    {
      user_id: user_id_param,
      money_dateStart: dateStart_param,
      money_dateEnd: dateEnd_param,
      ...dateType_param ? { money_dateType: dateType_param } : {},
    }
  )
  .lean();

  return finalResult;
};