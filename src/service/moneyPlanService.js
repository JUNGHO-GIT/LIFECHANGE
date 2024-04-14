// moneyPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 1-1. compare ----------------------------------------------------------------------------------->
export const compare = async (
  user_id_param,
  money_dur_param,
  money_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDayReal, endDayReal] = money_dur_param.split(` ~ `);
  const [startDayPlan, endDayPlan] = money_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResultReal = await Money.find({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    },
    money_endDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    }
  })
  .sort({money_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const findResultPlan = await MoneyPlan.find({
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDayPlan,
    },
    money_plan_endDt: {
      $lte: endDayPlan,
    },
  })
  .sort({money_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await MoneyPlan.countDocuments({
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDayReal
    },
    money_plan_endDt: {
      $lte: endDayReal
    },
  })
  .lean();

  const finalResult = findResultPlan?.map((plan) => {
    const matches = findResultReal.filter((real) => (
      real && plan &&
      real.money_startDt && real.money_endDt &&
      plan.money_plan_startDt && plan.money_plan_endDt &&
      real.money_startDt <= plan.money_plan_endDt &&
      real.money_endDt >= plan.money_plan_startDt
    ));
    const totalIn = matches.reduce((sum, curr) => (
      sum + curr.money_section.reduce((acc, section) => (
        section.money_part_val === "수입" ? acc + (section.money_amount || 0) : acc
      ), 0)
    ), 0);
    const totalOut = matches.reduce((sum, curr) => (
      sum + curr.money_section.reduce((acc, section) => (
        section.money_part_val === "지출" ? acc + (section.money_amount || 0) : acc
      ), 0)
    ), 0);

    return {
      ...plan,
      money_in: totalIn,
      money_out: totalOut
    };
  });

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResult = await MoneyPlan.find({
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDay,
    },
    money_plan_endDt: {
      $lte: endDay,
    },
  })
  .sort({money_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await MoneyPlan.countDocuments({
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDay,
    },
    money_plan_endDt: {
      $lte: endDay,
    },
  });

  return {
    totalCnt: totalCnt,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  money_plan_dur_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const finalResult = await MoneyPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    money_plan_startDt: startDay,
    money_plan_endDt: endDay,
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_PLAN_param,
  money_plan_dur_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const filter = {
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    money_plan_endDt: {
      $gte: startDay,
      $lte: endDay,
    }
  };
  const findResult = await MoneyPlan.find(filter).lean();

  const create = {
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    money_plan_startDt: startDay,
    money_plan_endDt: endDay,
    money_plan_in: MONEY_PLAN_param.money_plan_in,
    money_plan_out: MONEY_PLAN_param.money_plan_out,
    money_plan_regdate: koreanDate,
    money_plan_update: "",
  };
  const update = {
    $set: {
      ...MONEY_PLAN_param,
      money_plan_update: koreanDate,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await MoneyPlan.create(create);
  }
  else {
    finalResult = await MoneyPlan.findOneAndUpdate(filter, update, options).lean();
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  money_plan_dur_param
) => {

  const [startDay, endDay] = money_plan_dur_param.split(` ~ `);

  const updateResult = await MoneyPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      money_plan_startDt: {
        $gte: startDay,
      },
      money_plan_endDt: {
        $lte: endDay,
      },
    },
    {
      $set: {
        money_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  )
  .lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await MoneyPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await MoneyPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
