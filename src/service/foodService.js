// foodService.js

import mongoose from "mongoose";
import moment from "moment";
import {JSDOM} from "jsdom";
import axios from "axios";
import {Food} from "../schema/Food.js";

// 1-0. search ------------------------------------------------------------------------------------>
export const search = async (
  user_id_param,
  filter_param
) => {

  const URL_SEARCH = encodeURI(`http://www.fatsecret.kr/칼로리-영양소/search`);
  const query = filter_param.query;
  const page = filter_param.page;
  let finalResult = [];
  let pageCount = 0;
  let serv, gram;
  let servArray = [
    "개", "회", "알", "통", "봉", "컵", "팩", "줄", "장",
    "마리", "인분", "봉지", "한컵", "대접", "접시",
    "소접시", "테이블스푼"
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
    const regex = /(\s*)(\d+\s*.*)(\s*당\s*-\s*)(\s*칼\s*로\s*리\s*[:]\s*)(\s*\d+\s*.*)(\s*kcal\s*)(\s*[|]\s*)(\s*지\s*방\s*[:]\s*)(\s*\d+\s*.*)(\s*g\s*)(\s*[|]\s*)(\s*탄\s*수\s*화\s*물\s*[:]\s*)(\s*\d+\s*.*)(\s*g\s*)(\s*[|]\s*)(\s*단\s*백\s*질\s*[:]\s*)(\s*\d+\s*.*)(\s*g)/;
    const matches = param.match(regex);

    if (matches) {
      let found = false;
      for (let i = 0; i < servArray.length && !found; i++) {
        const el = servArray[i];
        if (matches[2].includes(el)) {
          const idx = matches[2].indexOf(el);
          const gramMatch = matches[2].slice(idx + el.length).trim().match(/(\d+)\s*g/);
          serv = matches[2].slice(0, idx + el.length).replace(/(\d+)\s+(.+)/, "$1$2").trim();
          gram  = gramMatch ? gramMatch[1] : "-";
          found = true;
        }
      };
    };

    return {
      serv: matches ? serv : "1회",
      gram: matches ? gram : "-",
      kcal: matches ? Math.round(parseFloat(matches[5].trim())) : "",
      fat: matches ? Math.round(parseFloat(matches[9].trim())) : "",
      carb: matches ? Math.round(parseFloat(matches[13].trim())) : "",
      protein: matches ? Math.round(parseFloat(matches[17].trim())) : "",
    };
  };

  function calcCount (param) {
    const count = param.split("중")[0].trim();
    return count;
  };

  function cleanText (param) {
    if (typeof param !== "string") {
      return "";
    }
    else {
      const match = param.match(/.*단백질: \d+\.?\d*g/);
      const fmtText = match ? match[0] : param;
      return fmtText.replace(/[\n\t]+/gm, " ").replace(/\s\s+/gm, " ").trim();
    }
  };

  tables.forEach((param) => {
    const rows = param.querySelectorAll("tr");
    Array.from(rows).forEach((prev) => {
      const titleElement = cleanText(prev.querySelector("a.prominent")?.textContent);
      const brandElement = cleanText(prev.querySelector("a.brand")?.textContent);
      console.log("===================================");
      console.log(JSON.stringify(prev.querySelector("div.smallText.greyText")?.textContent));
      const nutritionElement = cleanText(prev.querySelector("div.smallText.greyText")?.textContent);
      const nutritionData = calcServ(nutritionElement);

      finalResult.push({
        title: titleElement,
        brand: brandElement,
        serv: nutritionData.serv,
        gram: nutritionData.gram,
        kcal: nutritionData.kcal,
        fat: nutritionData.fat,
        carb: nutritionData.carb,
        protein: nutritionData.protein,
      });
      pageCount = Math.ceil(calcCount(document.querySelector(".searchResultSummary")?.textContent) / 10);
    });
  });

  return {
    pageCount: pageCount,
    result: finalResult,
  };
};

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  food_dur_param,
  filter_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const filter = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const sort = filter === "asc" ? 1 : -1;

  const findResult = Food.find({
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    }
  })

  const finalResult = await findResult
  .sort({food_date: sort})
  .skip((page - 1) * limit)
  .limit(limit);

  const totalCount = await Food.countDocuments(findResult);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  food_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const finalResult = await Food.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  const realCount = finalResult?.food_real?.food_section.length || 0;
  const planCount = finalResult?.food_plan?.food_section.length || 0;

  return {
    realCount: realCount,
    planCount: planCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  FOOD_param,
  food_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const findResult = await Food.findOne({
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_date: startDay,
      food_real: FOOD_param.food_real,
      food_plan: FOOD_param.food_plan,
      food_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      food_update: "",
    };
    finalResult = await Food.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = planYn_param === "Y"
    ? {$set: {
      food_plan: FOOD_param.food_plan,
      food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    }}
    : {$set: {
      food_real: FOOD_param.food_real,
      food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    }}

    finalResult = await Food.updateOne(updateQuery, updateAction);
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  food_dur_param,
  planYn_param
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
        [`food_${planYn_param === "Y" ? "plan" : "real"}.food_section`]: {
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
  );

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Food.findOne({
      user_id: user_id_param,
      food_date: {
        $gte: startDay,
        $lte: endDay,
      },
    });

    if (
      doc
      && (!doc.food_plan?.food_section || doc.food_plan?.food_section.length === 0)
      && (!doc.food_real?.food_section || doc.food_real?.food_section.length === 0)
    ) {
      finalResult = await Food.deleteOne({
        _id: doc._id
      });
    }
  }

  return {
    result: finalResult
  };
};
