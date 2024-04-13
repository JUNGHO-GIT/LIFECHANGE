// workService.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);
  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await Work.countDocuments({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay
    },
    work_endDt: {
      $gte: startDay,
      $lte: endDay
    },
    ...(part !== "전체" && {
      "work_section.work_part_val": part
    }),
    ...(title !== "전체" && {
      "work_section.work_title_val": title
    }),
  })
  .lean();

  const findResult = await Work.aggregate([
    {$match: {
      user_id: user_id_param,
      work_startDt: {
        $gte: startDay,
        $lte: endDay
      },
      work_endDt: {
        $gte: startDay,
        $lte: endDay
      },
    }},
    {$project: {
      work_startDt: 1,
      work_endDt: 1,
      work_start: 1,
      work_end: 1,
      work_time: 1,
      work_section: {
        $filter: {
          input: "$work_section",
          as: "section",
          cond: {
            $and: [
              part === "전체"
              ? {$ne: ["$$section.work_part_val", null]}
              : {$eq: ["$$section.work_part_val", part]},
              title === "전체"
              ? {$ne: ["$$section.work_title_val", null]}
              : {$eq: ["$$section.work_title_val", title]}
            ]
          }
        }
      }
    }},
    {$sort: {work_startDt: sort}},
    {$skip: (page - 1) * limit},
    {$limit: limit}
  ]);

  const finalResult = {
    totalCnt: totalCnt,
    result: findResult
  };

  return finalResult;
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  work_dur_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const finalResult = await Work.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .lean();

  const sectionCnt = finalResult?.work_section?.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_param,
  work_dur_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const findResult = await Work.findOne({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_startDt: startDay,
      work_endDt: endDay,
      work_start: WORK_param.work_start,
      work_end: WORK_param.work_end,
      work_time: WORK_param.work_time,
      work_section: WORK_param.work_section,
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
        work_section: WORK_param.work_section,
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
  work_dur_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const updateResult = await Work.updateOne(
    {
      user_id: user_id_param,
      work_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
      work_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        work_section: {
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
      work_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
      work_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
    .lean();

    if (
      (doc) &&
      (!doc.work_section || doc.work_section.length === 0)
    ) {
      finalResult = await Work.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};