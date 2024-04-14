// sleepPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 1-1. compare ----------------------------------------------------------------------------------->
export const compare = async (
  user_id_param,
  sleep_dur_param,
  sleep_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDayReal, endDayReal] = sleep_dur_param.split(` ~ `);
  const [startDayPlan, endDayPlan] = sleep_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResultReal = await Sleep.find({
    user_id: user_id_param,
    sleep_startDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    },
    sleep_endDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    }
  })
  .sort({sleep_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const findResultPlan = await SleepPlan.find({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $gte: startDayPlan,
    },
    sleep_plan_endDt: {
      $lte: endDayPlan,
    },
  })
  .sort({sleep_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await SleepPlan.countDocuments({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $gte: startDayReal
    },
    sleep_plan_endDt: {
      $lte: endDayReal
    }
  });

  const finalResult = findResultPlan?.map((plan) => {
    const match = findResultReal.find((real) => (
      real && plan &&
      real.sleep_startDt && real.sleep_endDt &&
      plan.sleep_plan_startDt && plan.sleep_plan_endDt &&
      real.sleep_startDt <= plan.sleep_plan_endDt &&
      real.sleep_endDt >= plan.sleep_plan_startDt
    ));
    return match ? {
      ...plan,
      sleep_startDt: match?.sleep_startDt,
      sleep_endDt: match?.sleep_endDt,
      sleep_night: match?.sleep_section[0].sleep_night,
      sleep_morning: match?.sleep_section[0].sleep_morning,
      sleep_time: match?.sleep_section[0].sleep_time,
    } : {
      ...plan,
      sleep_startDt: "",
      sleep_endDt: "",
      sleep_night: "",
      sleep_morning: "",
      sleep_time: "",
    };
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = sleep_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResult = await SleepPlan.find({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $gte: startDay,
    },
    sleep_plan_endDt: {
      $lte: endDay,
    },
  })
  .sort({sleep_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await SleepPlan.countDocuments({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $gte: startDay,
    },
    sleep_plan_endDt: {
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
  sleep_plan_dur_param
) => {

  const [startDay, endDay] = sleep_plan_dur_param.split(` ~ `);

  const finalResult = await SleepPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    sleep_plan_startDt: startDay,
    sleep_plan_endDt: endDay,
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_PLAN_param,
  sleep_plan_dur_param
) => {

  const [startDay, endDay] = sleep_plan_dur_param.split(` ~ `);

  const filter = {
    user_id: user_id_param,
    sleep_plan_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    sleep_plan_endDt: {
      $gte: startDay,
      $lte: endDay,
    }
  };
  const findResult = await SleepPlan.find(filter).lean();

  const create = {
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    sleep_plan_startDt: startDay,
    sleep_plan_endDt: endDay,
    sleep_plan_night: SLEEP_PLAN_param.sleep_plan_night,
    sleep_plan_morning: SLEEP_PLAN_param.sleep_plan_morning,
    sleep_plan_time: SLEEP_PLAN_param.sleep_plan_time,
    sleep_plan_regdate: koreanDate,
    sleep_plan_update: "",
  };
  const update = {
    $set: {
      ...SLEEP_PLAN_param,
      sleep_plan_update: koreanDate,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await SleepPlan.create(create);
  }
  else {
    finalResult = await SleepPlan.findOneAndUpdate(filter, update, options).lean();
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_plan_dur_param
) => {

  const [startDay, endDay] = sleep_plan_dur_param.split(` ~ `);

  const updateResult = await SleepPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      sleep_plan_startDt: startDay,
      sleep_plan_endDt: endDay,
    },
    {
      $set: {
        sleep_plan_update: koreanDate,
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
    const doc = await SleepPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await SleepPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
