// foodService.js

import mongoose from "mongoose";
import moment from "moment";
import {JSDOM} from "jsdom";
import axios from "axios";
import {Food} from "../schema/Food.js";

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
        food_title: titleElement || "-",
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

  const [startDay, endDay] = food_dur_param.split(" ~ ");
  const part = FILTER_param.part || "전체";
  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResult = await Food.find({
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ food_date: sort })
  .lean();

  let totalCnt = 0;
  const finalResult = findResult.map((food) => {
    if (food && food.food_section) {
      let sections = food.food_section.filter((section) => (
        part === "전체" ? true : section.food_part === part
      ));

      // 배열 갯수 누적 계산
      totalCnt += sections.length;

      // section 배열에서 페이지에 맞는 항목만 선택합니다.
      const startIdx = (limit * page - 1) - (limit - 1);
      const endIdx = (limit * page);
      sections = sections.slice(startIdx, endIdx);

      food.food_section = sections;
    }
    return food;
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
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
    food_date: {
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
    food_date: {
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
      food_date: startDay,
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
      food_date: {
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
      food_date: {
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
