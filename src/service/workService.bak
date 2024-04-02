// workService.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";
import {workPartAll, workTitleAll} from "../assets/js/workArray.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  work_id_param,
  work_dur_param,
  planYn_param,
  filter_param,
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
    work_id: work_id_param,
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

  // 정렬, 페이징 처리
  findResult = await Work
    .find(findQuery)
    .sort(sortCondition)
    .skip((page - 1) * limit)
    .limit(limit);

  // totalCount
  totalCount = await Work
    .countDocuments(findQuery);

  finalResult = {
    totalCount: totalCount,
    result: findResult,
  };

  return finalResult;
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  work_id_param,
  work_day_param,
  planYn_param,
  _id_param
) => {

  let sectionCount;
  let findQuery;
  let findResult;
  let finalResult;

  // 입력시 데이터조회
  // 리스트에서 데이터조회
  let idParam = _id_param !== ""
    ? { $regex: _id_param }
    : { $exists: true };

  findQuery = {
    work_id: work_id_param,
    work_day: work_day_param,
    work_planYn: planYn_param,
    _id: idParam,
  };

  findResult = await Work
    .findOne(findQuery);

  // sectionCount
  sectionCount = findResult !== null
    ? findResult.work_section.length
    : 1;

  finalResult = {
    sectionCount: sectionCount,
    result: findResult,
  };

  return finalResult;
};

// 3. insert -------------------------------------------------------------------------------------->
export const insert = async (
  work_id_param,
  WORK_param
) => {

  let createQuery;
  let createResult;
  let updateQuery;
  let findQuery;
  let findResult;

  findQuery = {
    work_id: work_id_param,
    work_day: WORK_param.work_day,
  };

  findResult = await Work.findOne(findQuery);

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    work_id : work_id_param,
    work_section : WORK_param.work_section,
    work_start : WORK_param.work_start,
    work_end : WORK_param.work_end,
    work_time : WORK_param.work_time,
    work_planYn : WORK_param.work_planYn,
    work_day : WORK_param.work_day,
    work_regdate : WORK_param.work_regdate,
    work_update : WORK_param.work_update,
  };

  updateQuery = {
    work_section : WORK_param.work_section,
    work_start : WORK_param.work_start,
    work_end : WORK_param.work_end,
    work_time : WORK_param.work_time,
    work_planYn : WORK_param.work_planYn,
    work_update : WORK_param.work_update,
  };

  if (!findResult) {
    createResult = await Work.create(
      createQuery
    );
  };
  if (findResult) {
    createResult = await Work.updateOne(
      findQuery,
      {$set: updateQuery}
    );
  };

  return createResult;
}

// 4. update -------------------------------------------------------------------------------------->
export const update = async (
  _id_param,
  WORK_param
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

// 5. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  work_section_id_param
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