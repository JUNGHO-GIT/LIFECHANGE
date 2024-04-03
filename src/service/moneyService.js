// moneyService.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../schema/Money.js";

// 0-0. today ------------------------------------------------------------------------------------->
const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_dur_param,
  filter_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const filter = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const sort = filter === "asc" ? 1 : -1;

  const findResult = Money.find({
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    }
  })

  const finalResult = await findResult
  .sort({money_date: sort})
  .skip((page - 1) * limit)
  .limit(limit);

  const totalCount = await Money.countDocuments(findResult);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  money_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const finalResult = await Money.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  const realCount = finalResult?.money_real !== undefined ? 1 : 0;
  const planCount = finalResult?.money_plan !== undefined ? 1 : 0;

  return {
    realCount: realCount,
    planCount: planCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_param,
  money_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const findResult = await Money.findOne({
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      money_date: startDay,
      money_real: MONEY_param.money_real,
      money_plan: MONEY_param.money_plan,
      money_regdate: today,
      money_update: "",
    };
    finalResult = await Money.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = planYn_param === "Y"
    ? {$set: {
      money_plan: MONEY_param.money_plan,
      money_update: today,
    }}
    : {$set: {
      money_real: MONEY_param.money_real,
      money_update: today,
    }}

    finalResult = await Money.updateOne(updateQuery, updateAction);
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  money_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const updateResult = await Money.updateOne(
    {
      user_id: user_id_param,
      money_date: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        [`money_${planYn_param === "Y" ? "plan" : "real"}.money_section`]: {
          _id: _id_param
        },
      },
      $set: {
        money_update: today,
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  );

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Money.findOne({
      user_id: user_id_param,
      money_date: {
        $gte: startDay,
        $lte: endDay,
      },
    });

    if (
      doc
      && (!doc.money_plan?.money_section || doc.money_plan?.money_section.length === 0)
      && (!doc.money_real?.money_section || doc.money_real?.money_section.length === 0)
    ) {
      finalResult = await Money.deleteOne({
        _id: doc._id
      });
    }
  }

  return {
    result: finalResult
  };
};
