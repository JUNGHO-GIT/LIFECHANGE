// moneyService.js

import mongoose from "mongoose";
import moment from "moment";
import {Money} from "../schema/Money.js";
import {MoneyPlan} from "../schema/MoneyPlan.js";

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

  const dataFields = {
    "수입": {
      plan: "money_plan_in",
      real: "money_real_in"
    },
    "지출": {
      plan: "money_plan_out",
      real: "money_real_out"
    }
  };

  let finalResult = [];
  for (let key in dataFields) {
    const findResultPlan = await MoneyPlan.findOne({
      user_id: user_id_param,
      money_plan_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      money_plan_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();
    const findResultReal = await Money.findOne({
      user_id: user_id_param,
      money_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      money_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();

    finalResult.push({
      name: key,
      목표: findResultPlan?.[dataFields[key].plan] || 0,
      실제: findResultReal?.[dataFields[key].real] || 0
    });
  };

  return {
    result: finalResult,
  };
};

// 0-2. dash (pie) -------------------------------------------------------------------------------->
export const dashPie = async (
  user_id_param
) => {
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
  const findResultIn = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
        money_endDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
      }
    },
    {
      $unwind: "$money_section"
    },
    {
      $match: {
        "money_section.money_part_val": "수입"
      }
    },
    {
      $group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }
    }
  ]);
  const findResultOut = await Money.aggregate([
    {
      $match: {
        user_id: user_id_param,
        money_startDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
        money_endDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
      }
    },
    {
      $unwind: "$money_section"
    },
    {
      $match: {
        "money_section.money_part_val": "지출"
      }
    },
    {
      $group: {
        _id: "$money_section.money_title_val",
        value: {
          $sum: "$money_section.money_amount"
        }
      }
    }
  ]);

  const finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: item.value
  }));

  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: item.value
  }));

  return {
    resultIn: finalResultIn,
    resultOut: finalResultOut
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let finalResult = [];
  for (let i in names) {
    const date = moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days");
    const findResult = await Money.findOne({
      user_id: user_id_param,
      money_startDt: date.format("YYYY-MM-DD"),
      money_endDt: date.format("YYYY-MM-DD"),
    })
    .lean();

    finalResult.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      수입: findResult?.money_section?.filter((item) => item.money_part_val === "수입")
        .reduce((acc, cur) => acc + cur.money_amount, 0) || 0,
      지출: findResult?.money_section?.filter((item) => item.money_part_val === "지출")
        .reduce((acc, cur) => acc + cur.money_amount, 0) || 0,
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumMoneyIn = Array(5).fill(0);
  let sumMoneyOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  const currentMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const currentMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let w = currentMonthStart.clone();
    w.isBefore(currentMonthEnd);
    w.add(1, "days")
  ) {
    const weekNum = w.week() - currentMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await Money.findOne({
        user_id: user_id_param,
        money_startDt: w.format("YYYY-MM-DD"),
        money_endDt: w.format("YYYY-MM-DD"),
      }).lean();

      if (findResult) {
        sumMoneyIn[weekNum - 1] += findResult?.money_section?.filter((item) => item.money_part_val === "수입")
          .reduce((acc, cur) => acc + cur.money_amount, 0);
        sumMoneyOut[weekNum - 1] += findResult?.money_section?.filter((item) => item.money_part_val === "지출")
          .reduce((acc, cur) => acc + cur.money_amount, 0);
        countRecords[weekNum - 1]++;
      }
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      수입: countRecords[i] > 0 ? (sumMoneyIn[i] / countRecords[i]).toFixed(0) : "0",
      지출: countRecords[i] > 0 ? (sumMoneyOut[i] / countRecords[i]).toFixed(0) : "0",
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let sumMoneyIn = Array(12).fill(0);
  let sumMoneyOut = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const currentMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const currentMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let m = currentMonthStart.clone();
    m.isBefore(currentMonthEnd);
    m.add(1, "days")
  ) {
    const monthNum = m.month();

    const findResult = await Money.findOne({
      user_id: user_id_param,
      money_startDt: m.format("YYYY-MM-DD"),
      money_endDt: m.format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      sumMoneyIn[monthNum] += findResult?.money_section?.filter((item) => item.money_part_val === "수입")
        .reduce((acc, cur) => acc + cur.money_amount, 0);
      sumMoneyOut[monthNum] += findResult?.money_section?.filter((item) => item.money_part_val === "지출")
        .reduce((acc, cur) => acc + cur.money_amount, 0);
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      수입: countRecords[i] > 0 ? (sumMoneyIn[i] / countRecords[i]).toFixed(0) : "0",
      지출: countRecords[i] > 0 ? (sumMoneyOut[i] / countRecords[i]).toFixed(0) : "0",
    });
  };

  return {
    result: finalResult,
  };
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  money_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = money_dur_param.split(` ~ `);
  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await Money.countDocuments({
    user_id: user_id_param,
    money_startDt: {
      $gte: startDay,
      $lte: endDay
    },
    money_endDt: {
      $gte: startDay,
      $lte: endDay
    },
    ...(part !== "전체" && {
      "money_section.money_part_val": part
    }),
    ...(title !== "전체" && {
      "money_section.money_title_val": title
    }),
  })
  .lean();

  const findResult = await Money.aggregate([
    {$match: {
      user_id: user_id_param,
      money_startDt: {
        $gte: startDay,
        $lte: endDay
      },
      money_endDt: {
        $gte: startDay,
        $lte: endDay
      },
    }},
    {$project: {
      money_startDt: 1,
      money_endDt: 1,
      money_section: {
        $filter: {
          input: "$money_section",
          as: "section",
          cond: {
            $and: [
              part === "전체"
              ? {$ne: ["$$section.money_part_val", null]}
              : {$eq: ["$$section.money_part_val", part]},
              title === "전체"
              ? {$ne: ["$$section.money_title_val", null]}
              : {$eq: ["$$section.money_title_val", title]}
            ]
          }
        }
      }
    }},
    {$sort: {money_startDt: sort}},
    {$skip: (page - 1) * limit},
    {$limit: limit}
  ]);

  const finalResult = {
    totalCnt: totalCnt,
    result: findResult
  };

  return finalResult;
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
