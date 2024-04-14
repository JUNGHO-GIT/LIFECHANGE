// foodService.js

import mongoose from "mongoose";
import moment from "moment";
import {JSDOM} from "jsdom";
import axios from "axios";
import {Food} from "../schema/Food.js";
import {FoodPlan} from "../schema/FoodPlan.js";

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

  const dataKcal = {
    "칼로리": { plan: "food_plan_kcal", real: "food_total_kcal" }
  };
  const dataNut = {
    "탄수화물": { plan: "food_plan_carb", real: "food_total_carb" },
    "단백질": { plan: "food_plan_protein", real: "food_total_protein" },
    "지방": { plan: "food_plan_fat", real: "food_total_fat" },
  };

  const fmtData = (data) => {
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

  // kcal
  let finalResultKcal = [];
  for (let key in dataKcal) {
    const findResultPlan = await FoodPlan.findOne({
      user_id: user_id_param,
      food_plan_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      food_plan_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();

    const findResultReal = await Food.findOne({
      user_id: user_id_param,
      food_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      food_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();

    finalResultKcal.push({
      name: key,
      목표: fmtData(findResultPlan?.[dataKcal[key].plan]),
      실제: fmtData(findResultReal?.[dataKcal[key].real])
    });
  };

  // carb, protein, fat
  let finalResultNut = [];
  for (let key in dataNut) {
    const findResultPlan = await FoodPlan.findOne({
      user_id: user_id_param,
      food_plan_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      food_plan_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();

    const findResultReal = await Food.findOne({
      user_id: user_id_param,
      food_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      food_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      }
    })
    .lean();

    finalResultNut.push({
      name: key,
      목표: fmtData(findResultPlan?.[dataNut[key].plan]),
      실제: fmtData(findResultReal?.[dataNut[key].real])
    });
  };

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-2. dash (pie) -------------------------------------------------------------------------------->
export const dashPie = async (
  user_id_param
) => {
  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

  const fmtData = (data) => {
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

  // kcal
  const findResultKcal = await Food.aggregate([
    {$match: {
      user_id: user_id_param,
      food_startDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
      food_endDt: {
        $gte: koreanDate,
        $lte: koreanDate
      },
    }},
    {$unwind: "$food_section"
    },
    {$group: {
      _id: "$food_section.food_title_val",
      value: {
        $sum: {
          $toDouble: "$food_section.food_kcal"
        }
      }
    }}
  ]);

  // carb, protein, fat
  const findResultNut = await Food.aggregate([
    {$match: {
      user_id: user_id_param,
      food_startDt: { $gte: koreanDate, $lte: koreanDate },
      food_endDt: { $gte: koreanDate, $lte: koreanDate }
    }},
    {$project: {
      _id: 0,
      food_total_carb: 1,
      food_total_protein: 1,
      food_total_fat: 1
    }}
  ]);

  const finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: fmtData(item.value)
  }));

  const finalResultNut = [
    { name: "탄수화물", value: fmtData(findResultNut[0]?.food_total_carb) },
    { name: "단백질", value: fmtData(findResultNut[0]?.food_total_protein) },
    { name: "지방", value: fmtData(findResultNut[0]?.food_total_fat) }
  ];

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
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
    else if (typeof data === "string") {
      const toInt = parseInt(data, 10);
      return Math.round(toInt);
    }
    else {
      return Math.round(data);
    }
  };

  // kcal
  let finalResultKcal = [];

  // carb, protein, fat
  let finalResultNut = [];

  for (let i in names) {
    const date = moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days");
    const findResult = await Food.findOne({
      user_id: user_id_param,
      food_startDt: date.format("YYYY-MM-DD"),
      food_endDt: date.format("YYYY-MM-DD"),
    })
    .lean();

    finalResultKcal.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      칼로리: fmtData(findResult?.food_total_kcal)
    });

    finalResultNut.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      탄수화물: fmtData(findResult?.food_total_carb),
      단백질: fmtData(findResult?.food_total_protein),
      지방: fmtData(findResult?.food_total_fat),
    });
  };

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumFoodKcal = Array(5).fill(0);
  let sumFoodCarb = Array(5).fill(0);
  let sumFoodProtein = Array(5).fill(0);
  let sumFoodFat = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  const fmtData = (data) => {
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

  for (
    let w = curMonthStart.clone();
    w.isBefore(curMonthEnd);
    w.add(1, "days")
  ) {
    const weekNum = w.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await Food.findOne({
        user_id: user_id_param,
        food_startDt: w.format("YYYY-MM-DD"),
        food_endDt: w.format("YYYY-MM-DD"),
      }).lean();

      if (findResult) {
        sumFoodKcal[weekNum - 1] += fmtData(findResult?.food_total_kcal);
        sumFoodCarb[weekNum - 1] += fmtData(findResult?.food_total_carb);
        sumFoodProtein[weekNum - 1] += fmtData(findResult?.food_total_protein);
        sumFoodFat[weekNum - 1] += fmtData(findResult?.food_total_fat);
        countRecords[weekNum - 1]++;
      }
    }
  };

  let finalResultKcal = [];
  let finalResultNut = [];
  for (let i = 0; i < 5; i++) {
    finalResultKcal.push({
      name: names[i],
      칼로리: fmtData(sumFoodKcal[i] / countRecords[i])
    });
    finalResultNut.push({
      name: names[i],
      탄수화물: fmtData(sumFoodCarb[i] / countRecords[i]),
      단백질: fmtData(sumFoodProtein[i] / countRecords[i]),
      지방: fmtData(sumFoodFat[i] / countRecords[i]),
    });
  };

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let sumFoodKcal = Array(12).fill(0);
  let sumFoodCarb = Array(12).fill(0);
  let sumFoodProtein = Array(12).fill(0);
  let sumFoodFat = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const curMonthStart = moment().tz("Asia/Seoul").startOf('month');
  const curMonthEnd = moment().tz("Asia/Seoul").endOf('month');

  const fmtData = (data) => {
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

  for (
    let m = curMonthStart.clone();
    m.isBefore(curMonthEnd);
    m.add(1, "days")
  ) {
    const monthNum = m.month();

    const findResult = await Food.findOne({
      user_id: user_id_param,
      food_startDt: m.format("YYYY-MM-DD"),
      food_endDt: m.format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      sumFoodKcal[monthNum] += fmtData(findResult?.food_total_kcal);
      sumFoodCarb[monthNum] += fmtData(findResult?.food_total_carb);
      sumFoodProtein[monthNum] += fmtData(findResult?.food_total_protein);
      sumFoodFat[monthNum] += fmtData(findResult?.food_total_fat);
      countRecords[monthNum]++;
    }
  };

  let finalResultKcal = [];
  let finalResultNut = [];
  for (let i = 0; i < 12; i++) {
    finalResultKcal.push({
      name: names[i],
      칼로리: fmtData(sumFoodKcal[i] / countRecords[i])
    });
    finalResultNut.push({
      name: names[i],
      탄수화물: fmtData(sumFoodCarb[i] / countRecords[i]),
      단백질: fmtData(sumFoodProtein[i] / countRecords[i]),
      지방: fmtData(sumFoodFat[i] / countRecords[i]),
    });
  };

  return {
    result: {
      kcal: finalResultKcal,
      nut: finalResultNut
    }
  };
};

// 1-0. search ------------------------------------------------------------------------------------>
export const search = async (
  user_id_param,
  FILTER_param
) => {

  const URL_SEARCH = encodeURI(`http://www.fatsecret.kr/칼로리-영양소/search`);
  const query = FILTER_param.query;
  const page = FILTER_param.page;

  let finalResult = [];
  let totalCnt = 0;
  let serv;
  let gram;
  let servArray = [
    "개", "회", "알", "통", "봉", "컵", "팩", "줄", "장", "마리", "인분", "봉지", "한컵", "대접", "접시", "소접시", "테이블스푼"
  ];

  function getSearchResult () {
    return new Promise((resolve, reject) => {
      axios.get(URL_SEARCH, {
        params: {
          q: query,
          pg: page,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };

  const searchResult = await getSearchResult();
  const document = new JSDOM(searchResult).window.document;
  const tables = document.querySelectorAll(`table.generic.searchResult`);

  function calcServ(param) {
    const regex = /(\s*)(\d+\s*.*\n*)(\s*당\s*-\s*)(\s*칼\s*로\s*리\s*[:]\s*)(\d+\s*.*\n*)(kcal)(\s*[|]\s*)(\s*지\s*방\s*[:]\s*)(\d+\s*.*\n*)(g)(\s*[|]\s*)(\s*탄\s*수\s*화\s*물\s*[:]\s*)(\d+\s*.*\n*)(g)(\s*[|]\s*)(\s*단\s*백\s*질\s*[:]\s*)(\d+\s*.*\n*)(g)/;
    const matches = param.match(regex);

    if (matches) {
      let found = false;
      // 1. servArray에 포함된 단어가 있는 경우
      servArray.forEach((el) => {
        if (matches[2].includes(el)) {
          const idx = matches[2].indexOf(el);
          const gramMatch = matches[2].slice(idx + el.length).trim().match(/(\d+)\s*g/);
          serv = matches[2].slice(0, idx + el.length).replace(/(\d+)\s+(.+)/, "$1$2").trim();
          gram  = gramMatch ? gramMatch[1] : "-";
          found = true;
        }
      });

      // 2. servArray에 포함된 단어가 없는 경우, gram 정보 직접 확인
      if (!found) {
        const gramDirectMatch = param.trim().match(/(\d+)\s*g/);
        if (gramDirectMatch) {
          serv = "1회";
          gram = gramDirectMatch[1];
        }
        else {
          const gramMatch = matches[2].trim().match(/(\d+)\s*g/);
          serv = matches ? matches[2].replace(/(\d+)\s+(.+)/, "$1$2").trim() : "1회";
          gram = gramMatch ? gramMatch[1] : "-";
        }
      }
    }
    return {
      count: (serv.match(/(\d+\.\d+|\d+)/) || [""])[0],
      serv: (serv.match(/[^\d]+$/) || [""])[0],
      gram: gram || "-",
      kcal: matches ? matches[5] : "-",
      fat: matches ? matches[9] : "-",
      carb: matches ? matches[13] : "-",
      protein: matches ? matches[17] : "-",
    };
  };

  tables.forEach((param) => {
    const rows = param.querySelectorAll("tr");
    Array.from(rows).forEach((prev) => {
      const titleElement = prev.querySelector("a.prominent")?.textContent?.trim();
      const brandElement = prev.querySelector("a.brand")?.textContent?.trim();
      const nutritionElement = calcServ(prev.querySelector("div.smallText.greyText.greyLink")?.textContent?.trim());

      finalResult.push({
        food_title_val: titleElement || "-",
        food_brand: brandElement || "-",
        food_count: nutritionElement.count,
        food_serv: nutritionElement.serv,
        food_gram: nutritionElement.gram,
        food_kcal: nutritionElement.kcal,
        food_fat: nutritionElement.fat,
        food_carb: nutritionElement.carb,
        food_protein: nutritionElement.protein,
      });

      const count = document.querySelector(".searchResultSummary")?.textContent;
      totalCnt = count ? Math.ceil(parseInt(count.split("중")[0].trim(), 10) / 10) : 0;
    });
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  food_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);
  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await Food.countDocuments({
    user_id: user_id_param,
    food_startDt: {
      $gte: startDay,
      $lte: endDay
    },
    food_endDt: {
      $gte: startDay,
      $lte: endDay
    },
    ...(part !== "전체" && {
      "food_section.food_part_val": part
    }),
    ...(title !== "전체" && {
      "food_section.food_title_val": title
    }),
  })
  .lean();

  const findResult = await Food.aggregate([
    {$match: {
      user_id: user_id_param,
      food_startDt: {
        $gte: startDay,
        $lte: endDay
      },
      food_endDt: {
        $gte: startDay,
        $lte: endDay
      },
    }},
    {$project: {
      food_startDt: 1,
      food_endDt: 1,
      food_section: {
        $filter: {
          input: "$food_section",
          as: "section",
          cond: {
            $and: [
              part === "전체"
              ? {$ne: ["$$section.food_part_val", null]}
              : {$eq: ["$$section.food_part_val", part]},
              title === "전체"
              ? {$ne: ["$$section.food_title_val", null]}
              : {$eq: ["$$section.food_title_val", title]}
            ]
          }
        }
      }
    }},
    {$sort: {food_startDt: sort}},
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
  food_dur_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const finalResult = await Food.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    food_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    food_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .lean();

  const sectionCnt = finalResult?.food_section?.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  FOOD_param,
  food_dur_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const findResult = await Food.findOne({
    user_id: user_id_param,
    food_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    food_endDt: {
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
      food_startDt: startDay,
      food_endDt: endDay,
      food_total_kcal: FOOD_param.food_total_kcal,
      food_total_carb: FOOD_param.food_total_carb,
      food_total_protein: FOOD_param.food_total_protein,
      food_total_fat: FOOD_param.food_total_fat,
      food_section: FOOD_param.food_section,
      food_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      food_update: "",
    };
    finalResult = await Food.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        food_section: FOOD_param.food_section,
        food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };

    finalResult = await Food.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  food_dur_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const updateResult = await Food.updateOne(
    {
      user_id: user_id_param,
      food_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
        food_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        food_section: {
          _id: _id_param
        },
      },
      $set: {
        food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await Food.findOne({
      user_id: user_id_param,
      food_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
        food_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
    .lean();

    if (
      (doc) &&
      (!doc?.food_section || doc?.food_section?.length === 0)
    ) {
      finalResult = await Food.deleteOne({
        _id: doc._id
      })
    .lean();
    }
  }

  return {
    result: finalResult
  };
};
