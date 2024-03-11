// workService.ts

import Work from "../schema/Work";
import * as mongoose from "mongoose";
import moment from "moment";
import {workPartAll, workTitleAll} from "../assets/ts/workArray";

// 1-1. workList ---------------------------------------------------------------------------------->
export const workList = async (
  user_id_param: any,
  work_dur_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = work_dur_param.split(` ~ `)[0];
  const endDay = work_dur_param.split(` ~ `)[1];

  findQuery = {
    user_id: user_id_param,
    work_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  findResult = await Work.find(findQuery).sort({ work_day: -1 });

  return findResult;
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
  let finalResult;

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
    {$unwind: "$workSection"},
    {$match: {
      user_id: user_id_param,
      "workSection.work_part_val": {$regex: work_part_val_param},
      "workSection.work_title_val": {$regex: work_title_val_param},
      work_day: {
        $gte: startDay,
        $lte: endDay,
      },
    }},
    {$group: {
      _id: "$workSection.work_title_val",
      count: {$sum: 1},
      work_part_val: {$first: "$workSection.work_part_val"},
      work_title_val: {$first: "$workSection.work_title_val"},
      work_count_avg: {$avg: "$workSection.work_count"},
      work_set_avg: {$avg: "$workSection.work_set"},
      work_kg_avg: {$avg: "$workSection.work_kg"},
      work_rest_avg: {$avg: "$workSection.work_rest"},
    }}
  ];

  findResult = await Work.aggregate(findQuery).sort({ _id: 1 });

  return findResult;
};


// 2. workDetail ---------------------------------------------------------------------------------->
export const workDetail = async (
  _id_param : any,
  workSection_id_param : any
) => {

  let findQuery;
  let findResult;
  let finalResult;
  let workScheme;

  if (!workSection_id_param) {
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
    workScheme = findResult;

    if (workScheme) {
      const matchedSection = workScheme.workSection.find((section: any) => {
        return section._id.toString() === workSection_id_param.toString();
      });
      finalResult = {
        ...workScheme.toObject(),
        workSection: [matchedSection]
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
    workSection : WORK_param.workSection,
    work_start : WORK_param.work_start,
    work_end : WORK_param.work_end,
    work_time : WORK_param.work_time,
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
  workSection_id_param : any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  // workSection_id_param이 제공되면 해당 섹션만 삭제합니다.
  // 여기서는 $pull 연산자를 사용하여 배열에서 특정 항목을 삭제합니다.
  // 이 연산자는 주어진 조건에 일치하는 항목을 배열에서 제거합니다.
  if (
    workSection_id_param !== null &&
    workSection_id_param !== undefined &&
    workSection_id_param !== ""
  ) {
    deleteQuery = [
      {_id: _id_param},
      {$pull: {
        workSection: { _id: workSection_id_param }
      }}
    ];
    deleteResult = await Work.updateOne(deleteQuery);
  }

  // workSection_id_param이 제공되지 않으면 전체 작업을 삭제합니다.
  else if (
    workSection_id_param === null ||
    workSection_id_param === undefined ||
    workSection_id_param === ""
  ) {
    deleteQuery = {
      _id: _id_param
    };
    deleteResult = await Work.deleteOne(deleteQuery);
  }
  return deleteResult;
};