// workService.ts
import Work from "../schema/Work";
import * as mongoose from "mongoose";
import { workPartAll, workTitleAll } from "../assets/ts/workArray";

// 1-1. workList --------------------------------------------------------------------------------->
export const workList = async (
  user_id_param: any,
  work_duration_param: any
) => {

  const startDay = work_duration_param.split(` ~ `)[0];
  const endDay = work_duration_param.split(` ~ `)[1];

  /**
  const workSection = WORK_param.workSection;

  for (let i = 0; i < workSection.length; i++) {
    if (workSection[i].work_part_val == "전체") {
      workSection[i].work_part_val = workPartAll;
    }
    if (workSection[i].work_title_val == "전체") {
      workSection[i].work_title_val = workTitleAll;
    }
  }
  **/

  const workList = await Work.find ({
    user_id:  user_id_param,
    work_day : {
      $gte : startDay,
      $lte : endDay,
    }
  }).sort({work_day : -1});

  return workList;
};

// 1-2. workAverage ------------------------------------------------------------------------------->
export const workAverage = async (
  user_id_param: any,
  work_duration_param: any,
  work_part_val_param: any,
  work_title_val_param: any
) => {

  const startDay = work_duration_param.split(` ~ `)[0];
  const endDay = work_duration_param.split(` ~ `)[1];

  if (work_part_val_param === "전체") {
    let work_part_before = workPartAll[0].workPart.toString();
    work_part_val_param = work_part_before.replace(/,/g, "|");
  }
  if (work_title_val_param === "전체") {
    let work_title_before = workTitleAll[0].workTitle.toString();
    work_title_val_param = work_title_before.replace(/,/g, "|");
  }

  console.log("work_part_val_param  :  " + work_part_val_param);
  console.log("work_title_val_param  :  " + work_title_val_param);

  const workAverage = await Work.aggregate ([
    {
      $unwind: "$workSection"
    },
    {
      $match: {
        user_id : user_id_param,
        "workSection.work_part_val" : {$regex : work_part_val_param},
        "workSection.work_title_val" : {$regex : work_title_val_param},
        work_day : {
          $gte : startDay,
          $lte : endDay,
        },
      },
    },
    {
      $group: {
        _id: "$workSection.work_title_val",
        count: {$sum: 1},
        work_part_val : {$first: "$workSection.work_part_val"},
        work_title_val : {$first: "$workSection.work_title_val"},
        work_count_avg: {$avg: "$workSection.work_count"},
        work_set_avg: {$avg: "$workSection.work_set"},
        work_kg_avg: {$avg: "$workSection.work_kg"},
        work_rest_avg: {$avg: "$workSection.work_rest"},
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  return workAverage;
};

// 2. workDetail ------------------------------------------------------------------------------->
export const workDetail = async (
  _id_param : any,
  workSection_id_param : any
) => {
  console.log("log ==== _id_param :  " + _id_param);
  console.log("log ==== workSection_id_param :  " + workSection_id_param);
  
  let workDetail;

  if (workSection_id_param === null) {
    workDetail = await Work.findOne({ _id: _id_param });
  }
  if (workSection_id_param !== null) {
    const workScheme = await Work.findOne({ _id: _id_param });
    if (workScheme) {
      const matchedSection = workScheme.workSection.find((section: any) => section._id.toString() === workSection_id_param.toString());
      workDetail = {
        ...workScheme.toObject(),
        workSection: [matchedSection]
      };
    }
  }
  console.log("log ==== workDetail :  " + JSON.stringify(workDetail));
  return workDetail;
};

// 3. workInsert ---------------------------------------------------------------------------------->
export const workInsert = async (
  user_id_param : any,
  WORK_param : any
) => {
  const workInsert = await Work.create ({
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    workSection : WORK_param.workSection,
    work_start : WORK_param.work_start,
    work_end : WORK_param.work_end,
    work_time : WORK_param.work_time,
    work_day : WORK_param.work_day,
    work_regdate : WORK_param.work_regdate,
    work_update : WORK_param.work_update,
  });
  return workInsert;
};

// 4. workUpdate ---------------------------------------------------------------------------------->
export const workUpdate = async (
  _id_param : any,
  WORK_param : any
) => {
  const workUpdate = await Work.updateOne (
    {_id : _id_param},
    {$set : WORK_param}
  );
  return workUpdate;
};

// 5. workDelete ---------------------------------------------------------------------------------->
export const workDelete = async (
  _id_param : any,
  workSection_id_param : any
) => {
  
  console.log("log ==== _id_param :  " + _id_param);
  console.log("log ==== workSection_id_param :  " + workSection_id_param);
  
  let workDelete;
  
  if (
    workSection_id_param !== null ||
    workSection_id_param !== undefined ||
    workSection_id_param !== ""
  ) {
    // workSection_id_param이 제공되면 해당 섹션만 삭제합니다.
    // 여기서는 $pull 연산자를 사용하여 배열에서 특정 항목을 삭제합니다. 이 연산자는 주어진 조건에 일치하는 항목을 배열에서 제거합니다.
    workDelete = await Work.updateOne (
      {
        _id: _id_param
      },
      {
        $pull: {
          workSection: { _id: workSection_id_param }
        }
      }
    );
  }
  else if (
    workSection_id_param === null ||
    workSection_id_param === undefined ||
    workSection_id_param === ""
  ) {
    // workSection_id_param이 제공되지 않으면 전체 작업을 삭제합니다.
    workDelete = await Work.deleteOne (
      {
        _id: _id_param
      }
    );
  }
  return workDelete;
};
