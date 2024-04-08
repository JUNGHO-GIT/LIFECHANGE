// workService.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";

/* // 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  filter_param,
  planYn_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const part = filter_param.part || "";
  const sort = filter_param.order === "asc" ? 1 : -1;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const planYn = planYn_param === "Y" ? "work_plan" : "work_real";

  const findResult = Work.find({
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    }
  }).lean();

  const finalResult = await findResult
  .sort({work_date: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  const totalCount = await Work.countDocuments(findResult).lean();

  return {
    totalCount: totalCount,
    result: finalResult,
  };
}; */

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  filter_param,
  planYn_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);
  const part = filter_param.part || "";
  const sort = filter_param.order === "asc" ? 1 : -1;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const planYn = planYn_param === "Y" ? "work_plan" : "work_real";

  const findResult = await Work.find({
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ work_date: sort })
  .lean();

  const finalResult = findResult.map((prev) => {
    const filtered = prev[planYn]?.work_section.filter((item) => (
      part === "전체" ? true : item.work_part_val === part
    ));

    function sliceData (data, page, limit) {
      const startIndex = (page - 1) * limit;
      let endIndex = startIndex + limit;
      endIndex = endIndex > data.length ? data.length : endIndex;
      return data.slice(startIndex, endIndex);
    }

    return {
      ...prev,
      [planYn]: {
        ...prev[planYn],
        work_section: sliceData(filtered, page, limit),
      },
    };
  });

  const totalCount = finalResult.reduce((acc, cur) => (
    acc + cur[planYn]?.work_section?.length || 0
  ), 0);

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
  const planYn = planYn_param === "Y" ? "work_plan" : "work_real";

  const finalResult = await Work.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  const sectionCount = finalResult?.[planYn]?.work_section?.length || 0;

  return {
    sectionCount: sectionCount,
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
  const planYn = planYn_param === "Y" ? "work_plan" : "work_real";

  const findResult = await Work.findOne({
    user_id: user_id_param,
    work_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_date: startDay,
      [planYn]: WORK_param[planYn],
      work_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      work_update: "",
    };
    finalResult = await Work.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        [planYn]: WORK_param[planYn],
        work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };
    finalResult = await Work.updateOne(updateQuery, updateAction).lean();
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
  const planYn = planYn_param === "Y" ? "work_plan" : "work_real";

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
        [`${planYn}.work_section`]: {
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
  ).lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Work.findOne({
      user_id: user_id_param,
      work_date: {
        $gte: startDay,
        $lte: endDay,
      },
    }).lean();

    if (
      (doc) &&
      (!doc[planYn]?.work_section || doc[planYn]?.work_section?.length === 0)
    ) {
      finalResult = await Work.deleteOne({
        _id: doc._id
      }).lean();
    }
  }

  return {
    result: finalResult
  };
};