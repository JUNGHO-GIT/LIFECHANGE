// moneyService.js

import moment from "moment";
import * as repository from "../../repository/real/moneyRepository.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

// 0-2. format ------------------------------------------------------------------------------------>
const dateFormat = (data) => {
  if (!data) {
    return 0;
  }
  else {
    const time = data.split(":");
    return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
  }
};
const intFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const toInt = parseInt(data, 10);
    return Math.round(toInt);
  }
  else {
    return Math.round(data);
  }
};

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataInOut = {
    "수입": {
      plan: "money_plan_in",
      real: "money_total_in"
    },
    "지출": {
      plan: "money_plan_out",
      real: "money_total_out"
    }
  };

  let finalResult = [];
  for (let key in dataInOut) {
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
      목표: intFormat(findResultPlan?.[dataInOut[key].plan] || 0),
      실제: intFormat(findResultReal?.[dataInOut[key].real] || 0),
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

  // in
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
  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  // out
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
    value: intFormat(item.value)
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
      수입: intFormat(findResult?.money_total_in || 0),
      지출: intFormat(findResult?.money_total_out || 0),
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

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let w = curMonthStart.clone();
    w.isBefore(curMonthEnd);
    w.add(1, "days")
  ) {
    const weekNum = w.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await Money.findOne({
        user_id: user_id_param,
        money_startDt: w.format("YYYY-MM-DD"),
        money_endDt: w.format("YYYY-MM-DD"),
      }).lean();

      if (findResult) {
        sumMoneyIn[weekNum - 1] += intFormat(findResult?.money_total_in || 0);
        sumMoneyOut[weekNum - 1] += intFormat(findResult?.money_total_out || 0);
        countRecords[weekNum - 1]++;
      }
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      수입: intFormat(sumMoneyIn[i] / countRecords[i]),
      지출: intFormat(sumMoneyOut[i] / countRecords[i]),
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

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  for (
    let m = curMonthStart.clone();
    m.isBefore(curMonthEnd);
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
      sumMoneyIn[monthNum] += intFormat(findResult?.money_total_in || 0);
      sumMoneyOut[monthNum] += intFormat(findResult?.money_total_out || 0);
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      수입: intFormat(sumMoneyIn[i] / countRecords[i]),
      지출: intFormat(sumMoneyOut[i] / countRecords[i]),
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

  const [startDt, endDt] = money_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await repository.totalCnt(
    user_id_param, part, title, startDt, endDt
  );

  const finalResult = await repository.findReal(
    user_id_param, part, title, sort, limit, page, startDt, endDt
  );

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

  const [startDt, endDt] = money_dur_param.split(` ~ `);

  const finalResult = await repository.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  MONEY_param,
  money_dur_param
) => {

  const [startDt, endDt] = money_dur_param.split(` ~ `);

  const findResult = await repository.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, MONEY_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, MONEY_param
    );
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  money_dur_param
) => {

  const [startDt, endDt] = money_dur_param.split(` ~ `);

  const finalResult = await repository.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult
  };
};