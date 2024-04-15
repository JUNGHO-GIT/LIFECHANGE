// workRepository.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";

// 0. common -------------------------------------------------------------------------------------->
const fmtDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataInOut = {
    "수입": {
      plan: "work_plan_in",
      real: "work_total_in"
    },
    "지출": {
      plan: "work_plan_out",
      real: "work_total_out"
    }
  };

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else if (typeof data === "string") {
      const toInt = parseInt(data, 10);
      return Math.round(toInt);
    }
    else {
      return Math.round(data);
    }
  };

  let finalResult = [];
  for (let key in dataInOut) {
    const findResultPlan = await WorkPlan.findOne({
      user_id: user_id_param,
      work_plan_startDt: {
        $gte: fmtDate,
        $lte: fmtDate
      },
      work_plan_endDt: {
        $gte: fmtDate,
        $lte: fmtDate
      }
    })
    .lean();
    const findResultReal = await Work.findOne({
      user_id: user_id_param,
      work_startDt: {
        $gte: fmtDate,
        $lte: fmtDate
      },
      work_endDt: {
        $gte: fmtDate,
        $lte: fmtDate
      }
    })
    .lean();

    finalResult.push({
      name: key,
      목표: fmtData(findResultPlan?.[dataInOut[key].plan] || 0),
      실제: fmtData(findResultReal?.[dataInOut[key].real] || 0),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-2. dash (pie) -------------------------------------------------------------------------------->
export const dashPie = async (
  user_id_param
) => {

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else if (typeof data === "string") {
      const toInt = parseInt(data, 10);
      return Math.round(toInt);
    }
    else {
      return Math.round(data);
    }
  };

  // in
  const findResultIn = await Work.aggregate([
    {
      $match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: fmtDate,
          $lte: fmtDate
        },
        work_endDt: {
          $gte: fmtDate,
          $lte: fmtDate
        },
      }
    },
    {
      $unwind: "$work_section"
    },
    {
      $match: {
        "work_section.work_part_val": "수입"
      }
    },
    {
      $group: {
        _id: "$work_section.work_title_val",
        value: {
          $sum: "$work_section.work_amount"
        }
      }
    }
  ]);
  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: fmtData(item.value)
  }));

  // out
  const findResultOut = await Work.aggregate([
    {
      $match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: fmtDate,
          $lte: fmtDate
        },
        work_endDt: {
          $gte: fmtDate,
          $lte: fmtDate
        },
      }
    },
    {
      $unwind: "$work_section"
    },
    {
      $match: {
        "work_section.work_part_val": "지출"
      }
    },
    {
      $group: {
        _id: "$work_section.work_title_val",
        value: {
          $sum: "$work_section.work_amount"
        }
      }
    }
  ]);
  const finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: fmtData(item.value)
  }));

  return {
    resultIn: finalResultIn,
    resultOut: finalResultOut
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else if (typeof data === "string") {
      const toInt = parseInt(data, 10);
      return Math.round(toInt);
    }
    else {
      return Math.round(data);
    }
  };

  let finalResult = [];
  for (let i in names) {
    const date = moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days");
    const findResult = await Work.findOne({
      user_id: user_id_param,
      work_startDt: date.format("YYYY-MM-DD"),
      work_endDt: date.format("YYYY-MM-DD"),
    })
    .lean();

    finalResult.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      수입: fmtData(findResult?.work_total_in || 0),
      지출: fmtData(findResult?.work_total_out || 0),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumWorkIn = Array(5).fill(0);
  let sumWorkOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else if (typeof data === "string") {
      const toInt = parseInt(data, 10);
      return Math.round(toInt);
    }
    else {
      return Math.round(data);
    }
  };

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let w = curMonthStart.clone();
    w.isBefore(curMonthEnd);
    w.add(1, "days")
  ) {
    const weekNum = w.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await Work.findOne({
        user_id: user_id_param,
        work_startDt: w.format("YYYY-MM-DD"),
        work_endDt: w.format("YYYY-MM-DD"),
      }).lean();

      if (findResult) {
        sumWorkIn[weekNum - 1] += fmtData(findResult?.work_total_in || 0);
        sumWorkOut[weekNum - 1] += fmtData(findResult?.work_total_out || 0);
        countRecords[weekNum - 1]++;
      }
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      수입: fmtData(sumWorkIn[i] / countRecords[i]),
      지출: fmtData(sumWorkOut[i] / countRecords[i]),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let sumWorkIn = Array(12).fill(0);
  let sumWorkOut = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else if (typeof data === "string") {
      const toInt = parseInt(data, 10);
      return Math.round(toInt);
    }
    else {
      return Math.round(data);
    }
  };

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let m = curMonthStart.clone();
    m.isBefore(curMonthEnd);
    m.add(1, "days")
  ) {
    const monthNum = m.month();

    const findResult = await Work.findOne({
      user_id: user_id_param,
      work_startDt: m.format("YYYY-MM-DD"),
      work_endDt: m.format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      sumWorkIn[monthNum] += fmtData(findResult?.work_total_in || 0);
      sumWorkOut[monthNum] += fmtData(findResult?.work_total_out || 0);
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      수입: fmtData(sumWorkIn[i] / countRecords[i]),
      지출: fmtData(sumWorkOut[i] / countRecords[i]),
    });
  };

  return {
    result: finalResult,
  };
};

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
      work_body_weight: 1,
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

  const filter = {
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_endDt: {
      $gte: startDay,
      $lte: endDay,
    }
  };
  const findResult = await Work.find(filter).lean();

  const create = {
    _id: new mongoose.Types.ObjectId(),
    user_id: user_id_param,
    work_startDt: startDay,
    work_endDt: endDay,
    work_start: WORK_param.work_start,
    work_end: WORK_param.work_end,
    work_time: WORK_param.work_time,
    work_body_weight: WORK_param.work_body_weight,
    work_section: WORK_param.work_section,
    work_regdate: koreanDate,
    work_update: "",
  };
  const update = {
    $set: {
      ...WORK_param,
      work_update: koreanDate,
    },
  };
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };

  let finalResult;
  if (findResult.length === 0) {
    finalResult = await Work.create(create);
  }
  else {
    finalResult = await Work.findOneAndUpdate(filter, update, options).lean();
  }

  return {
    result: finalResult
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
        work_update: koreanDate,
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

    if ((doc) && (!doc.work_section || doc.work_section.length === 0)) {
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