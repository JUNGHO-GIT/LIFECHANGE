// moneyService.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../schema/Money.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_dur_param,
  filter_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);

  const sort = filter_param.order === "asc" ? 1 : -1;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const part = filter_param.part || "";
  const title = filter_param.title || "";

  const planYn = planYn_param === "Y" ? "money_plan" : "money_real";

  const findResult = await Money.find({
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ money_date: sort })
  .lean();

  const finalResult = findResult.map((prev) => {
    const filtered = prev[planYn]?.money_section.filter((item) => (
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
      ...prev,
      [planYn]: {
        ...prev[planYn],
        money_section: sliceData(filtered, page, limit),
      },
    };
  });

  const totalCount = finalResult.reduce((acc, cur) => (
    acc + cur[planYn]?.money_section?.length || 0
  ), 0);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  money_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "money_plan" : "money_real";

  const finalResult = await Money.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  const sectionCount = finalResult?.[planYn]?.money_section?.length || 0;

  return {
    sectionCount: sectionCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_param,
  money_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "money_plan" : "money_real";

  const findResult = await Money.findOne({
    user_id: user_id_param,
    money_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      money_date: startDay,
      [planYn]: MONEY_param[planYn],
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
        [planYn]: MONEY_param[planYn],
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
  money_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "money_plan" : "money_real";

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
        [`${planYn}.money_section`]: {
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
    }).lean();

    if (
      (doc) &&
      (!doc[planYn]?.money_section || doc[planYn]?.money_section?.length === 0)
    ) {
      finalResult = await Money.deleteOne({
        _id: doc._id
      }).lean();
    }
  }

  return {
    result: finalResult
  };
};
