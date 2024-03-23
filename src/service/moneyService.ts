// moneyService.ts

import Money from "../schema/Money";
import * as mongoose from "mongoose";
import moment from "moment";
import {moneyPartAll, moneyTitleAll} from "../assets/ts/moneyArray";

// 1-1. moneyList --------------------------------------------------------------------------------->
export const moneyList = async (
  user_id_param: any,
  money_dur_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = money_dur_param.split(` ~ `)[0];
  const endDay = money_dur_param.split(` ~ `)[1];

  findQuery = {
    user_id: user_id_param,
    money_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  findResult = await Money.find(findQuery).sort({ money_day: -1 });

  return findResult;
};

// 1-2. moneyAvg ---------------------------------------------------------------------------------->
export const moneyAvg = async (
  user_id_param: any,
  money_dur_param: any,
  money_part_val_param: any,
  money_title_val_param: any
) => {

  let findQuery;
  let findResult;
  let finalResult;

  const startDay = money_dur_param.split(` ~ `)[0];
  const endDay = money_dur_param.split(` ~ `)[1];

  if (money_part_val_param === "전체") {
    let money_part_before = moneyPartAll[0].toString();
    money_part_val_param = money_part_before.replace(/,/g, "|");
  }

  if (money_title_val_param === "전체") {
    let money_title_before = moneyTitleAll[0].money_title.toString();
    money_title_val_param = money_title_before.replace(/,/g, "|");
  }

  findQuery = [
    {$unwind: "$moneySection"},
    {$match: {
      user_id: user_id_param,
      "moneySection.money_part_val": {$regex: money_part_val_param},
      "moneySection.money_title_val": {$regex: money_title_val_param},
      money_day: {
        $gte: startDay,
        $lte: endDay,
      },
    }},
    {$group: {
      _id: "$moneySection.money_title_val",
      count: {$sum: 1},
      money_part_val: {$first: "$moneySection.money_part_val"},
      money_title_val: {$first: "$moneySection.money_title_val"},
      money_amount_avg: {$avg: "$moneySection.money_amount"},
    }}
  ];

  findResult = await Money.aggregate(findQuery).sort({ _id: 1 });

  return findResult;
};

// 2. moneyDetail --------------------------------------------------------------------------------->
export const moneyDetail = async (
  _id_param : any,
  moneySection_id_param : any
) => {

  let findQuery;
  let findResult;
  let finalResult;
  let moneySchema;

  if (!moneySection_id_param) {
    findQuery = {
      _id: _id_param
    };
    findResult = await Money.findOne(findQuery);
    finalResult = findResult;
  }
  else {
    findQuery = {
      _id: _id_param
    };
    findResult = await Money.findOne(findQuery);
    moneySchema = findResult;

    if (moneySchema) {
      const matchedSection = moneySchema.moneySection?.find((section: any) => {
        return section._id.toString() === moneySection_id_param.toString();
      });
      finalResult = {
        ...moneySchema.toObject(),
        moneySection: [matchedSection]
      };
    }
  }
  return finalResult;
};

// 3. moneyInsert --------------------------------------------------------------------------------->
export const moneyInsert = async (
  user_id_param : any,
  MONEY_param : any
) => {

  let createQuery;
  let createResult;
  let finalResult;

  createQuery = {
    _id : new mongoose.Types.ObjectId(),
    user_id : user_id_param,
    moneySection : MONEY_param.moneySection,
    money_day : MONEY_param.moneyDay,
    money_regdate : MONEY_param.money_regdate,
    money_update : MONEY_param.money_update,
  };

  createResult = await Money.create(createQuery);

  return createResult;
};

// 4. moneyUpdate --------------------------------------------------------------------------------->
export const moneyUpdate = async (
  _id_param : any,
  MONEY_param : any
) => {

  let updateQuery;
  let updateResult;
  let finalResult;

  updateQuery = {
    filter_id : {_id : _id_param},
    filter_set : {$set : MONEY_param}
  };

  updateResult = await MONEY_param.updateOne(
    updateQuery.filter_id,
    updateQuery.filter_set
  );

  return updateResult;
};

// 5. moneyDelete --------------------------------------------------------------------------------->
export const moneyDelete = async (
  _id_param : any,
  moneySection_id_param : any
) => {

  let deleteQuery;
  let deleteResult;
  let finalResult;

  // moneySection_id_param이 제공되면 해당 섹션만 삭제
  // 여기서는 $pull 연산자를 사용하여 배열에서 특정 항목을 삭제
  // 이 연산자는 주어진 조건에 일치하는 항목을 배열에서 제거
  if (
    moneySection_id_param !== null &&
    moneySection_id_param !== undefined &&
    moneySection_id_param !== ""
  ) {
    deleteQuery = [
      {_id: _id_param},
      {$pull: {
        moneySection: { _id: moneySection_id_param }
      }}
    ];
    deleteResult = await Money.updateOne(deleteQuery);
  }

  // moneySection_id_param이 제공되지 않으면 전체 작업을 삭제
  else if (
    moneySection_id_param === null ||
    moneySection_id_param === undefined ||
    moneySection_id_param === ""
  ) {
    deleteQuery = {
      _id: _id_param
    };
    deleteResult = await Money.deleteOne(deleteQuery);
  }
  return deleteResult;
};