// planService.js

import mongoose from "mongoose";
import moment from "moment";
import {Plan} from "../schema/Plan.js";

// 0-1. dash(bar) --------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataFields = {
    "취침": { plan: "plan_night", real: "plan_night" },
    "기상": { plan: "plan_morning", real: "plan_morning" },
    "수면": { plan: "plan_time", real: "plan_time" }
  };

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  let finalResult = [];
  for (let key in dataFields) {
    const findResult = await Plan.findOne({
      user_id: user_id_param,
      plan_date: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    }).lean();

    finalResult.push({
      name: key,
      목표: fmtData(
        findResult?.plan_plan?.plan_section?.map((item) => item[dataFields[key].plan]).join(":")
      ),
      실제: fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item[dataFields[key].real]).join(":")
      ),
    });
  }

  return {
    result: finalResult,
  };
};

// 0-2. dash(line) -------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  let finalResult = [];
  for (let i = 0; i < 7; i++) {
    const findResult = await Plan.findOne({
      user_id: user_id_param,
      plan_date: moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days").format("YYYY-MM-DD"),
    }).lean();

    finalResult.push({
      name: names[i],
      취침: fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_night).join(":")
      ),
      기상: fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_morning).join(":")
      ),
      수면: fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_time).join(":")
      ),
    });
  }

  return {
    result: finalResult,
  };
};

// 0-3. dash(avg-week) ---------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumPlanStart = Array(5).fill(0);
  let sumPlanEnd = Array(5).fill(0);
  let sumPlanTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  for (let i = 0; i < 7; i++) {
    const findResult = await Plan.findOne({
      user_id: user_id_param,
      plan_date: moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days").format("YYYY-MM-DD"),
    }).lean();

    if (findResult) {
      const weekNum = Math.max(moment(findResult.plan_date).week() - moment(findResult.plan_date).startOf("month").week() + 1);
      sumPlanStart[weekNum - 1] += fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_night).join(":")
      );
      sumPlanEnd[weekNum - 1] += fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_morning).join(":")
      );
      sumPlanTime[weekNum - 1] += fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_time).join(":")
      );
      countRecords[weekNum - 1]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: names[i],
      취침: sumPlanStart[i] / countRecords[i] || 0,
      기상: sumPlanEnd[i] / countRecords[i] || 0,
      수면: sumPlanTime[i] / countRecords[i] || 0,
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash(avg-month) --------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let sumPlanStart = Array(12).fill(0);
  let sumPlanEnd = Array(12).fill(0);
  let sumPlanTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  for (
    let m = moment(moment().tz("Asia/Seoul").startOf("year"));
    m.isBefore(moment().tz("Asia/Seoul").endOf("year"));
    m.add(1, "days")
  ) {
    const findResult = await Plan.findOne({
      user_id: user_id_param,
      plan_date: m.format("YYYY-MM-DD"),
    }).lean();

    if (findResult) {
      const monthNum = m.month();
      sumPlanStart[monthNum] += fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_night).join(":")
      );
      sumPlanEnd[monthNum] += fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_morning).join(":")
      );
      sumPlanTime[monthNum] += fmtData(
        findResult?.plan_real?.plan_section?.map((item) => item.plan_time).join(":")
      );
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      취침: sumPlanStart[i] / countRecords[i] || 0,
      기상: sumPlanEnd[i] / countRecords[i] || 0,
      수면: sumPlanTime[i] / countRecords[i] || 0,
    });
  };

  return {
    result: finalResult,
  };
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  plan_dur_param,
  filter_param,
  paging_param,
  planYn_param
) => {

  const [startDay, endDay] = plan_dur_param.split(` ~ `);
  const part = filter_param.part || "전체";
  const sort = filter_param.order === "asc" ? 1 : -1;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const page = paging_param.page === 0 ? 1 : paging_param.page;
  const planYn = planYn_param === "Y" ? "plan_plan" : "plan_real";

  const findResult = await Plan.find({
    user_id: user_id_param,
    plan_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ plan_date: sort })
  .lean();

  let totalCount = 0;
  const finalResult = findResult.map((plan) => {
    if (plan[planYn] && plan[planYn].plan_section) {
      let sections = plan[planYn].plan_section.filter((section) => (
        part === "전체" ? true : section.plan_part === part
      ));

      // 배열 갯수 누적 계산
      totalCount += sections.length;

      // section 배열에서 페이지에 맞는 항목만 선택합니다.
      const startIdx = (limit * page - 1) - (limit - 1);
      const endIdx = (limit * page);
      sections = sections.slice(startIdx, endIdx);

      plan[planYn].plan_section = sections;
    }
    return plan;
  });

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  plan_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = plan_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "plan_plan" : "plan_real";

  const finalResult = await Plan.findOne({
    _id: _id_param === "" ? { $exists: true } : _id_param,
    user_id: user_id_param,
    plan_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  const sectionCount = finalResult?.[planYn]?.plan_section?.length || 0;

  return {
    sectionCount: sectionCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_param,
  plan_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = plan_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "plan_plan" : "plan_real";

  const findResult = await Plan.findOne({
    user_id: user_id_param,
    plan_date: {
      $gte: startDay,
      $lte: endDay,
    },
  }).lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      plan_date: startDay,
      [planYn]: SLEEP_param[planYn],
      plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      plan_update: "",
    };
    finalResult = await Plan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        [planYn]: SLEEP_param[planYn],
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };
    finalResult = await Plan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  plan_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = plan_dur_param.split(` ~ `);
  const planYn = planYn_param === "Y" ? "plan_plan" : "plan_real";

  const updateResult = await Plan.updateOne(
    {
      user_id: user_id_param,
      plan_date: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        [`${planYn}.plan_section`]: {
          _id: _id_param
        },
      },
      $set: {
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await Plan.findOne({
      user_id: user_id_param,
      plan_date: {
        $gte: startDay,
        $lte: endDay,
      },
    }).lean();

    if (
      (doc) &&
      (!doc[planYn]?.plan_section || doc[planYn]?.plan_section?.length === 0)
    ) {
      finalResult = await Plan.deleteOne({
        _id: doc._id
      }).lean();
    }
  }

  return {
    result: finalResult
  };
};
