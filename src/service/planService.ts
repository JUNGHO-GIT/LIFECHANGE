// planService.ts

import Plan from "../schema/Plan";
import * as mongoose from "mongoose";
import moment from "moment";
import {planPartAll, planTitleAll} from "../assets/ts/planArray";

// 1-1. planList --------------------------------------------------------------------------------->
export const planList = async (
  user_id_param: any,
  plan_dur_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = plan_dur_param.split(` ~ `)[0];
  const endDay = plan_dur_param.split(` ~ `)[1];

  findQuery = {
    user_id: user_id_param,
    plan_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  findResult = await Plan.find(findQuery).sort({ plan_day: -1 });

  return findResult;
};

// 1-2. planAvg ---------------------------------------------------------------------------------->
export const planAvg = async (
  user_id_param: any,
  plan_dur_param: any,
  plan_part_val_param: any,
  plan_title_val_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = plan_dur_param.split(` ~ `)[0];
  const endDay = plan_dur_param.split(` ~ `)[1];

  if (plan_part_val_param === "전체") {
    let plan_part_before = planPartAll[0].toString();
    plan_part_val_param = plan_part_before.replace(/,/g, "|");
  }

  if (plan_title_val_param === "전체") {
    let plan_title_before = planTitleAll[0].plan_title.toString();
    plan_title_val_param = plan_title_before.replace(/,/g, "|");
  }

  findQuery = [
    {$unwind: "$planSection"},
    {$match: {
      user_id: user_id_param,
      "planSection.plan_part_val": {$regex: plan_part_val_param},
      "planSection.plan_title_val": {$regex: plan_title_val_param},
      plan_day: {
        $gte: startDay,
        $lte: endDay,
      },
    }},
    {$group: {
      _id: "$planSection.plan_title_val",
      count: {$sum: 1},
      plan_part_val: {$first: "$planSection.plan_part_val"},
      plan_title_val: {$first: "$planSection.plan_title_val"},
      plan_amount_avg: {$avg: "$planSection.plan_amount"},
    }}
  ];

  findResult = await Plan.aggregate(findQuery).sort({ _id: 1 });

  return findResult;
};

// 2. planDetail --------------------------------------------------------------------------------->
export const planDetail = async (
  _id_param : any,
  planSection_id_param : any
) => {

  let findQuery;
  let findResult;
  let finalResult;
  let planScheme;

  if (!planSection_id_param) {
    findQuery = {
      _id: _id_param
    };
    findResult = await Plan.findOne(findQuery);
    finalResult = findResult;
  }
  else {
    findQuery = {
      _id: _id_param
    };
    findResult = await Plan.findOne(findQuery);
    planScheme = findResult;

    if (planScheme) {
      const matchedSection = planScheme.planSection?.find((section: any) => {
        return section._id.toString() === planSection_id_param.toString();
      });
      finalResult = {
        ...planScheme.toObject(),
        planSection: [matchedSection]
      };
    }
  }
  return finalResult;
};

// 3. planInsert --------------------------------------------------------------------------------->
export const planInsert = async (
  user_id_param : any,
  PLAN_param : any
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    planSection : PLAN_param.planSection,
    plan_day : PLAN_param.planDay,
    plan_regdate : PLAN_param.plan_regdate,
    plan_update : PLAN_param.plan_update,
  };

  createResult = await Plan.create(createQuery);

  return createResult;
};

// 4. planUpdate --------------------------------------------------------------------------------->
export const planUpdate = async (
  _id_param : any,
  PLAN_param : any
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : PLAN_param}
  };

  updateResult = await PLAN_param.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

  return updateResult;
};

// 5. planDelete --------------------------------------------------------------------------------->
export const planDelete = async (
  _id_param : any,
  planSection_id_param : any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  // planSection_id_param이 제공되면 해당 섹션만 삭제
  // 여기서는 $pull 연산자를 사용하여 배열에서 특정 항목을 삭제
  // 이 연산자는 주어진 조건에 일치하는 항목을 배열에서 제거
  if (
    planSection_id_param !== null &&
    planSection_id_param !== undefined &&
    planSection_id_param !== ""
  ) {
    deleteQuery = [
      {_id: _id_param},
      {$pull: {
        planSection: { _id: planSection_id_param }
      }}
    ];
    deleteResult = await Plan.updateOne(deleteQuery);
  }

  // planSection_id_param이 제공되지 않으면 전체 작업을 삭제
  else if (
    planSection_id_param === null ||
    planSection_id_param === undefined ||
    planSection_id_param === ""
  ) {
    deleteQuery = {
      _id: _id_param
    };
    deleteResult = await Plan.deleteOne(deleteQuery);
  }
  return deleteResult;
};