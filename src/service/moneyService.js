// moneyService.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../schema/Money.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await Money.countDocuments({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    money_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .lean();

  const findResult = await Money.find({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    money_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({money_startDt: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  return {
    totalCnt: totalCnt,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  money_dur_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const finalResult = await Money.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    money_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    money_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .lean();

  const sectionCnt = finalResult?.money_section?.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_param,
  money_dur_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const findResult = await Money.findOne({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    money_endDt: {
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
      money_startDt: startDay,
      money_endDt: endDay,
      money_section: MONEY_param.money_section,
      money_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      money_update: "",
    };
    finalResult = await Money.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        money_section: MONEY_param.money_section,
        money_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };
    finalResult = await Money.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  money_dur_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const updateResult = await Money.updateOne(
    {
      user_id: user_id_param,
      money_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
        money_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        money_section: {
          _id: _id_param
        },
      },
      $set: {
        money_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await Money.findOne({
      user_id: user_id_param,
      money_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
        money_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
    .lean();

    if (
      (doc) &&
      (!doc.money_section || doc.money_section.length === 0)
    ) {
      finalResult = await Money.deleteOne({
        _id: doc._id
      })
    .lean();
    }
  }

  return {
    result: finalResult
  };
};
