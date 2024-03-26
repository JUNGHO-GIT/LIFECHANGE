// workService.ts

import Work from "../schema/Work";
import * as mongoose from "mongoose";
import moment from "moment";
import {workPartAll, workTitleAll} from "../assets/ts/workArray";

// 1-1. workList ---------------------------------------------------------------------------------->
export const workList = async (
  user_id_param: any,
  work_dur_param: any,
  planYn_param: any,
  filter_param: any,
) => {

  let totalCount;
  let findQuery;
  let findResult;
  let finalResult;

  const startDay = work_dur_param.split(` ~ `)[0];
  const endDay = work_dur_param.split(` ~ `)[1];

  // plan : Y, N
  let filterPlan = planYn_param;

  // asc, desc
  let order = filter_param.order;

  // page
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;

  // part, title 전체 선택 시
  let filterPart = filter_param.part !== "전체"
    ? { $regex: filter_param.part }
    : { $exists: true };
  let filterTitle = filter_param.title !== "전체"
    ? { $regex: filter_param.title }
    : { $exists: true };

  // findQuery 구성
  findQuery = {
    user_id: user_id_param,
    work_day: {
      $gte: startDay,
      $lte: endDay,
    },
    work_planYn: filterPlan,
    "work_section.work_part_val": filterPart,
    "work_section.work_title_val": filterTitle,
  };

  // asc, desc 정렬
  let sortCondition = {};
  if (order === "asc") {
    sortCondition = { work_day: 1 };
  }
  else {
    sortCondition = { work_day: -1 };
  }

  // totalCount
  totalCount = await Work
    .countDocuments(findQuery);

  // .find()에 정렬, 페이징 처리 추가
  findResult = await Work
    .find(findQuery)
    .sort(sortCondition)
    .skip((page - 1) * limit)
    .limit(limit);

  finalResult = {
    totalCount: totalCount,
    workList: findResult,
  };

  return finalResult;
};

// 1-2. workAvg ----------------------------------------------------------------------------------->
export const workAvg = async (
  user_id_param: any,
  work_dur_param: any,
  work_part_val_param: any,
  work_title_val_param: any
) => {

  let findQuery;
  let findResult;

  const startDay = work_dur_param.split(` ~ `)[0];
  const endDay = work_dur_param.split(` ~ `)[1];

  if (work_part_val_param === "전체") {
    let work_part_before = workPartAll[0].toString();
    work_part_val_param = work_part_before.replace(/,/g, "|");
  }

  if (work_title_val_param === "전체") {
    let work_title_before = workTitleAll[0].work_title.toString();
    work_title_val_param = work_title_before.replace(/,/g, "|");
  }

  findQuery = [
    {$unwind: "$work_section"},
    {$match: {
      user_id: user_id_param,
      "work_section.work_part_val": {$regex: work_part_val_param},
      "work_section.work_title_val": {$regex: work_title_val_param},
      work_day: {
        $gte: startDay,
        $lte: endDay,
      },
    }},
    {$group: {
      _id: "$work_section.work_title_val",
      count: {$sum: 1},
      work_part_val: {$first: "$work_section.work_part_val"},
      work_title_val: {$first: "$work_section.work_title_val"},
      work_count_avg: {$avg: "$work_section.work_count"},
      work_set_avg: {$avg: "$work_section.work_set"},
      work_kg_avg: {$avg: "$work_section.work_kg"},
      work_rest_avg: {$avg: "$work_section.work_rest"},
    }}
  ];

  findResult = await Work.aggregate(findQuery).sort({ _id: 1 });

  return findResult;
};


// 2. workDetail ---------------------------------------------------------------------------------->
export const workDetail = async (
  _id_param : any,
  work_section_id_param : any
) => {

  let findQuery;
  let findResult;
  let finalResult;
  let workSchema;

  if (!work_section_id_param) {
    findQuery = {
      _id: _id_param
    };
    findResult = await Work.findOne(findQuery);
    finalResult = findResult;
  }
  else {
    findQuery = {
      _id: _id_param
    };
    findResult = await Work.findOne(findQuery);
    workSchema = findResult;

    if (workSchema) {
      const matchedSection = workSchema.work_section.find((section: any) => {
        return section._id.toString() === work_section_id_param.toString();
      });
      finalResult = {
        ...workSchema.toObject(),
        work_section: [matchedSection]
      };
    }
  }
  return finalResult;
};

// 3. workInsert ---------------------------------------------------------------------------------->
export const workInsert = async (
  user_id_param : any,
  WORK_param : any
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    work_section : WORK_param.work_section,
    work_start : WORK_param.work_start,
    work_end : WORK_param.work_end,
    work_time : WORK_param.work_time,
    work_planYn : WORK_param.work_planYn,
    work_day : WORK_param.workDay,
    work_regdate : WORK_param.work_regdate,
    work_update : WORK_param.work_update,
  };

  createResult = await Work.create(createQuery);

  return createResult;
};

// 4. workUpdate ---------------------------------------------------------------------------------->
export const workUpdate = async (
  _id_param : any,
  WORK_param : any
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : WORK_param}
  };

  updateResult = await WORK_param.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

  return updateResult;
};

// 5. workDelete ---------------------------------------------------------------------------------->
export const workDelete = async (
  _id_param : any,
  work_section_id_param : any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  // work_section_id_param이 제공되면 해당 섹션만 삭제
  // 여기서는 $pull 연산자를 사용하여 배열에서 특정 항목을 삭제
  // 이 연산자는 주어진 조건에 일치하는 항목을 배열에서 제거
  if (
    work_section_id_param !== null &&
    work_section_id_param !== undefined &&
    work_section_id_param !== ""
  ) {
    deleteQuery = [
      {_id: _id_param},
      {$pull: {
        work_section: { _id: work_section_id_param }
      }}
    ];
    deleteResult = await Work.updateOne(deleteQuery);
  }

  // work_section_id_param이 제공되지 않으면 전체 작업을 삭제
  else if (
    work_section_id_param === null ||
    work_section_id_param === undefined ||
    work_section_id_param === ""
  ) {
    deleteQuery = {
      _id: _id_param
    };
    deleteResult = await Work.deleteOne(deleteQuery);
  }
  return deleteResult;
};