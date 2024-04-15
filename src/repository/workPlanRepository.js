// workPlanRepository.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";
import {WorkPlan} from "../schema/WorkPlan.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 1-1. compare ----------------------------------------------------------------------------------->
export const compare = async (
  user_id_param,
  work_dur_param,
  work_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDayReal, endDayReal] = work_dur_param.split(` ~ `);
  const [startDayPlan, endDayPlan] = work_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResultReal = await Work.find({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    },
    work_endDt: {
      $gte: startDayReal,
      $lte: endDayReal,
    }
  })
  .sort({work_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const findResultPlan = await WorkPlan.find({
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDayPlan,
    },
    work_plan_endDt: {
      $lte: endDayPlan,
    },
  })
  .sort({work_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await WorkPlan.countDocuments({
    user_id: user_id_param,
    money_plan_startDt: {
      $gte: startDayReal
    },
    money_plan_endDt: {
      $lte: endDayReal
    },
  });

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  const finalResult = findResultPlan?.map((plan) => {
    const matches = findResultReal?.filter((real) => (
      real && plan &&
      real.work_startDt && real.work_endDt &&
      plan.work_plan_startDt && plan.work_plan_endDt &&
      real.work_startDt <= plan.work_plan_endDt &&
      real.work_endDt >= plan.work_plan_startDt
    ));

    const totalCount = matches.reduce((sum, curr) => (
      sum + 1
    ), 0);

    const totalCardio = matches.reduce((sum, curr) => (
      sum + curr.work_section.reduce((acc, section) => (
        section.work_part_val === "유산소" ? acc + fmtData(curr.work_time) : acc
      ), 0)
    ), 0);

    return {
      ...plan,
      work_total_count: totalCount,
      work_cardio_time: totalCardio,
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
  work_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResult = await WorkPlan.find({
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDay,
    },
    work_plan_endDt: {
      $lte: endDay,
    },
  })
  .sort({work_plan_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCnt = await WorkPlan.countDocuments({
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDay,
    },
    work_plan_endDt: {
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
  work_plan_dur_param
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  const finalResult = await WorkPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    work_plan_startDt: startDay,
    work_plan_endDt: endDay
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_PLAN_param,
  work_plan_dur_param
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  const filter = {
    user_id: user_id_param,
    work_plan_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_plan_endDt: {
      $gte: startDay,
      $lte: endDay,
    }
  };
  const findResult = await WorkPlan.find(filter).lean();

  const create = {
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    work_plan_startDt: startDay,
    work_plan_endDt: endDay,
    work_plan_body_weight: WORK_PLAN_param.work_plan_body_weight,
    work_plan_total_count: WORK_PLAN_param.work_plan_total_count,
    work_plan_cardio_time: WORK_PLAN_param.work_plan_cardio_time,
    work_plan_regdate: koreanDate,
    work_plan_update: "",
  };
  const update = {
    $set: {
      ...WORK_PLAN_param,
      work_plan_update: koreanDate,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await WorkPlan.create(create);
  }
  else {
    finalResult = await WorkPlan.findOneAndUpdate(filter, update, options).lean();
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  work_plan_dur_param
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  const updateResult = await WorkPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      work_plan_startDt: {
        $gte: startDay,
      },
      work_plan_endDt: {
        $lte: endDay,
      },
    },
    {
      $set: {
        work_plan_update: koreanDate,
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
    const doc = await WorkPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await WorkPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
