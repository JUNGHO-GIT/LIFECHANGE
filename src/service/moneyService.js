// moneyService.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../schema/Money.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_dur_param,
  filter_param,
  paging_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const sort = filter_param.order === "asc" ? 1 : -1;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const page = paging_param.page === 0 ? 1 : paging_param.page;
  const part = filter_param.part || "";
  const title = filter_param.title || "";

  const findResult = await Money.find({
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ money_date: sort })
  .lean();

  const finalResult = findResult.map((money) => {
    const filtered = money?.money_section.filter((item) => (
      (part === "전체" || part === "") ? true : item.money_part_val === part) &&
      (title === "전체" || title === "") ? true : item.money_title_val === title
    );

    function sliceData (data, page, limit) {
      const startIndex = (page - 1) * limit;
      let endIndex = startIndex + limit;
      endIndex = endIndex > data.length ? data.length : endIndex;
      return data.slice(startIndex, endIndex);
    }

    return {
      ...money,
      money_section: sliceData(filtered, page, limit),
    };
  });

  const totalCnt = finalResult.reduce((acc, cur) => (
    acc + cur?.money_section?.length || 0
  ), 0);

  return {
    totalCnt: totalCnt,
    result: finalResult,
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
    money_date: {
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
    money_date: {
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
      money_date: startDay,
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
      money_date: {
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
      money_date: {
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
