// workDashService.js

import moment from "moment";
import * as repo from "../../repository/dash/workDashRepo.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");

// 0-2. format ------------------------------------------------------------------------------------>
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
      plan: "work_plan_in",
      real: "work_total_in"
    },
    "지출": {
      plan: "work_plan_out",
      real: "work_total_out"
    }
  };

  let finalResult = [];

  for (let key in dataInOut) {
    const findResultPlan = await WorkPlan.findOne({
      user_id: user_id_param,
      work_plan_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      work_plan_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();
    const findResultReal = await Work.findOne({
      user_id: user_id_param,
      work_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      work_endDt: {
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
  const findResultIn = await Work.aggregate([
    {
      $match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
        work_endDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
      }
    },
    {
      $unwind: "$work_section"
    },
    {
      $match: {
        "work_section.work_part_val": "수입"
      }
    },
    {
      $group: {
        _id: "$work_section.work_title_val",
        value: {
          $sum: "$work_section.work_amount"
        }
      }
    }
  ]);
  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  // out
  const findResultOut = await Work.aggregate([
    {
      $match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
        work_endDt: {
          $gte: koreanDate,
          $lte: koreanDate
        },
      }
    },
    {
      $unwind: "$work_section"
    },
    {
      $match: {
        "work_section.work_part_val": "지출"
      }
    },
    {
      $group: {
        _id: "$work_section.work_title_val",
        value: {
          $sum: "$work_section.work_amount"
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
    const findResult = await Work.findOne({
      user_id: user_id_param,
      work_startDt: date.format("YYYY-MM-DD"),
      work_endDt: date.format("YYYY-MM-DD"),
    })
    .lean();

    finalResult.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      수입: intFormat(findResult?.work_total_in || 0),
      지출: intFormat(findResult?.work_total_out || 0),
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

  let sumWorkIn = Array(5).fill(0);
  let sumWorkOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  for (
    let week = curMonthStart.clone();
    week.isBefore(curMonthEnd);
    week.add(1, "days")
  ) {
    const weekNum = w.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await Work.findOne({
        user_id: user_id_param,
        work_startDt: w.format("YYYY-MM-DD"),
        work_endDt: w.format("YYYY-MM-DD"),
      }).lean();

      if (findResult) {
        sumWorkIn[weekNum - 1] += intFormat(findResult?.work_total_in || 0);
        sumWorkOut[weekNum - 1] += intFormat(findResult?.work_total_out || 0);
        countRecords[weekNum - 1]++;
      }
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      수입: intFormat(sumWorkIn[i] / countRecords[i]),
      지출: intFormat(sumWorkOut[i] / countRecords[i]),
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

  let sumWorkIn = Array(12).fill(0);
  let sumWorkOut = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  for (
    let month = curMonthStart.clone();
    month.isBefore(curMonthEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await Work.findOne({
      user_id: user_id_param,
      work_startDt: m.format("YYYY-MM-DD"),
      work_endDt: m.format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      sumWorkIn[monthNum] += intFormat(findResult?.work_total_in || 0);
      sumWorkOut[monthNum] += intFormat(findResult?.work_total_out || 0);
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      수입: intFormat(sumWorkIn[i] / countRecords[i]),
      지출: intFormat(sumWorkOut[i] / countRecords[i]),
    });
  };

  return {
    result: finalResult,
  };
};