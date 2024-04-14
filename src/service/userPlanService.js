// userPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {UserPlan} from "../schema/UserPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  user_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResult = await UserPlan.find({
    user_id: user_id_param,
    user_plan_startDt: {
      $gte: startDay,
    },
    user_plan_endDt: {
      $lte: endDay,
    },
  })
  .sort({user_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await UserPlan.countDocuments({
    user_id: user_id_param,
    user_plan_startDt: {
      $gte: startDay,
    },
    user_plan_endDt: {
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
  user_plan_dur_param
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const finalResult = await UserPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    user_plan_startDt: {
      $gte: startDay,
    },
    user_plan_endDt: {
      $lte: endDay,
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
  USER_PLAN_param,
  user_plan_dur_param
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const filter = {
    user_id: user_id_param,
    user_plan_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    user_plan_endDt: {
      $gte: startDay,
      $lte: endDay,
    }
  };
  const findResult = await UserPlan.find(filter).lean();

  const create = {
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    ...USER_PLAN_param,
    user_plan_regdate: koreanDate,
    user_plan_update: "",
  };
  const update = {
    $set: {
      ...USER_PLAN_param,
      user_plan_update: koreanDate,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await UserPlan.create(create);
  }
  else {
    finalResult = await UserPlan.findOneAndUpdate(filter, update, options).lean();
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  user_plan_dur_param
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const updateResult = await UserPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      user_plan_startDt: {
        $gte: startDay,
      },
      user_plan_endDt: {
        $lte: endDay,
      },
    },
    {
      $set: {
        user_plan_update: koreanDate,
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
    const doc = await UserPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await UserPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
