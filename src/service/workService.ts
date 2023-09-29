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
    work_part_val_param = workPartAll[0].workPart;
  }
  if (work_title_val_param === "전체") {
    work_title_val_param = workTitleAll[0].workTitle;
  }

  console.log("work_part_val_param  :  " + work_part_val_param);
  console.log("work_title_val_param  :  " + work_title_val_param);

  const workAverage = await Work.aggregate ([
    {
      $unwind: "$workSection"
    },
    {
      $match: {
        "workSection.work_part_val": work_part_val_param,
        "workSection.work_title_val": work_title_val_param,
        user_id: user_id_param,
        work_day: {
          $gte: startDay,
          $lte: endDay,
        },
      },
    },
    {
      $group: {
        _id: "$workSection.work_title_val",
        work_part_val : { $first: "$workSection.work_part_val" },
        work_title_val : { $first: "$workSection.work_title_val" },
        work_count_avg: { $avg: "$workSection.work_count" },
        work_set_avg: { $avg: "$workSection.work_set" },
        work_kg_avg: { $avg: "$workSection.work_kg" },
        work_rest_avg: { $avg: "$workSection.work_rest" },
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


// 2. workDetail ---------------------------------------------------------------------------------->
export const workDetail = async (
  _id_param : any
) => {
  const workDetail = await Work.findOne ({
    _id : _id_param,
  });
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
  _id_param : any
) => {
  const workDelete = await Work.deleteOne ({
    _id : _id_param,
  });
  return workDelete;
};