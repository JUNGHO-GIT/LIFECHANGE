// sleepPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {SleepPlan} from "../schema/SleepPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
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

  const totalCnt = await SleepPlan.countDocuments({
    user_id: user_id_param,
    sleep_plan_start: {
      $lte: endDay,
    },
    sleep_plan_end: {
      $gte: startDay,
    },
  });

  const findResult = await SleepPlan.find({
    user_id: user_id_param,
    sleep_plan_start: {
      $lte: endDay,
    },
    sleep_plan_end: {
      $gte: startDay,
    },
  })
  .sort({sleep_plan_start: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

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
    sleep_plan_start: {
      $lte: endDay,
    },
    sleep_plan_end: {
      $gte: startDay,
    }
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

  const findResult = await SleepPlan.findOne({
    user_id: user_id_param,
    sleep_plan_start: {
      $lte: endDay,
    },
    sleep_plan_end: {
      $gte: startDay,
    }
  })
  .lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      sleep_plan_start: startDay,
      sleep_plan_end: endDay,
      sleep_plan_night: SLEEP_PLAN_param.sleep_plan_night,
      sleep_plan_morning: SLEEP_PLAN_param.sleep_plan_morning,
      sleep_plan_time: SLEEP_PLAN_param.sleep_plan_time,
      sleep_plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      sleep_plan_update: ""
    };
    finalResult = await SleepPlan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        sleep_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    };
    finalResult = await SleepPlan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
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
      sleep_plan_start: {
        $lte: endDay,
      },
      sleep_plan_end: {
        $gte: startDay,
      },
    },
    {
      $set: {
        sleep_plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
