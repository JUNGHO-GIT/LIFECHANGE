// workService.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  filter_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const filter = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const sort = filter === "asc" ? 1 : -1;

  const findResult = Work.find({
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    }
  })

  const finalResult = await findResult
  .sort({work_date: sort})
  .skip((page - 1) * limit)
  .limit(limit);

  const totalCount = await Work.countDocuments(findResult);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  work_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const finalResult = await Work.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  const realCount = finalResult?.work_real?.work_section.length || 0;
  const planCount = finalResult?.work_plan?.work_section.length || 0;

  return {
    realCount: realCount,
    planCount: planCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_param,
  work_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const findResult = await Work.findOne({
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_date: startDay,
      work_real: WORK_param.work_real,
      work_plan: WORK_param.work_plan,
      work_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      work_update: "",
    };
    finalResult = await Work.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = planYn_param === "Y"
    ? {$set: {
      work_plan: WORK_param.work_plan,
      work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    }}
    : {$set: {
      work_real: WORK_param.work_real,
      work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    }}

    finalResult = await Work.updateOne(updateQuery, updateAction);
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  work_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const updateResult = await Work.updateOne(
    {
      user_id: user_id_param,
      work_date: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        [`work_${planYn_param === "Y" ? "plan" : "real"}.work_section`]: {
          _id: _id_param
        },
      },
      $set: {
        work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await Work.findOne({
      user_id: user_id_param,
      work_date: {
        $gte: startDay,
        $lte: endDay,
      },
    });

    if (
      doc
      && (!doc.work_plan?.work_section || doc.work_plan?.work_section.length === 0)
      && (!doc.work_real?.work_section || doc.work_real?.work_section.length === 0)
    ) {
      finalResult = await Work.deleteOne({
        _id: doc._id
      });
    }
  }

  return {
    result: finalResult
  };
};