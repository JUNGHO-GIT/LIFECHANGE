// workPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {WorkPlan} from "../schema/WorkPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
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

  const totalCnt = await WorkPlan.countDocuments({
    user_id: user_id_param,
    work_plan_start: {
      $lte: endDay,
    },
    work_plan_end: {
      $gte: startDay,
    },
  });

  const findResult = await WorkPlan.find({
    user_id: user_id_param,
    work_plan_start: {
      $lte: endDay,
    },
    work_plan_end: {
      $gte: startDay,
    },
  })
  .sort({work_plan_start: sort})
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
  work_plan_dur_param,
  FILTER_param,
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  const finalResult = await WorkPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    work_plan_start: {
      $lte: endDay,
    },
    work_plan_end: {
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
  WORK_PLAN_param,
  work_plan_dur_param,
  FILTER_param,
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  let finalResult;
  let schema;

  if (FILTER_param.schema === "food") {
    schema = {
      plan_food: {
        plan_kcal: WORK_PLAN_param.plan_food.plan_kcal
      },
    };
  }

  if (FILTER_param.schema === "money") {
    schema = {
      plan_money: {
        plan_in: WORK_PLAN_param.plan_money.plan_in,
        plan_out: WORK_PLAN_param.plan_money.plan_out,
      },
    };
  }

  if (FILTER_param.schema === "sleep") {
    schema = {
      plan_sleep: {
        plan_night: WORK_PLAN_param.plan_sleep.plan_night,
        plan_morning: WORK_PLAN_param.plan_sleep.plan_morning,
        plan_time: WORK_PLAN_param.plan_sleep.plan_time,
      },
    };
  }

  if (FILTER_param.schema === "work") {
    schema = {
      plan_work: {
        plan_count_total: WORK_PLAN_param.plan_work.plan_count_total,
        plan_cardio_time: WORK_PLAN_param.plan_work.plan_cardio_time,
        plan_score_name: WORK_PLAN_param.plan_work.plan_score_name,
        plan_score_kg: WORK_PLAN_param.plan_work.plan_score_kg,
        plan_score_rep: WORK_PLAN_param.plan_work.plan_score_rep,
      },
    };
  }

  const findResult = await WorkPlan.findOne({
    user_id: user_id_param,
    work_plan_start: {
      $lte: endDay,
    },
    work_plan_end: {
      $gte: startDay,
    }
  })
  .lean();

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_plan_start: startDay,
      work_plan_end: endDay,
      ...schema,
      plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      plan_update: ""
    };
    finalResult = await WorkPlan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        ...schema,
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    };
    finalResult = await WorkPlan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  work_plan_dur_param,
  FILTER_param,
) => {

  const [startDay, endDay] = work_plan_dur_param.split(` ~ `);

  const updateResult = await WorkPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      work_plan_start: {
        $lte: endDay,
      },
      work_plan_end: {
        $gte: startDay,
      },
    },
    {
      $set: {
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
