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
  workSection_param: any
) => {

  const startDay = work_duration_param.split(` ~ `)[0];
  const endDay = work_duration_param.split(` ~ `)[1];

  const work_part_param = workSection_param.work_part_val;
  const work_title_param = workSection_param.work_title_val;

  const workAverage = await Work.aggregate ([
    {
      $match : {
        user_id : user_id_param,
        work_day : {
          $gte : startDay,
          $lte : endDay,
        },
        work_part : work_part_param,
        work_title : work_title_param
      },
    },
    {
      $group : {
        _id : "$work_title",
        work_title : {$first : "$work_title"},
        work_part : {$first : "$work_part"},
        work_count : {$avg : "$work_count"},
        work_kg : {$avg : "$work_kg"},
        work_rest : {$avg : "$work_rest"},
        work_time : {$avg : "$work_time"},
      },
    },
    {
      $sort : {
        work_title : 1,
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

// 5. workDelete ------------------------------------------------------------------------------->
export const workDelete = async (
  _id_param : any
) => {
  const workDelete = await Work.deleteOne ({
    _id : _id_param,
  });
  return workDelete;
};