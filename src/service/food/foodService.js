// foodService.js

import { JSDOM } from "jsdom";
import axios from "axios";
import * as repository from "../../repository/food/foodRepository.js";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const findResult = await repository.exist.exist(
    user_id_param, dateType, dateStart, dateEnd
  );

  // sort by date 날짜 순으로 정렬
  const finalResult = findResult[0]?.existDate?.sort((a, b) => {
    return a > b ? 1 : a < b ? -1 : 0;
  });

  return finalResult;
};

// 1-1. list ---------------------------------------------------------------------------------------
export const list = async (
  user_id_param, PAGING_param, DATE_param
) => {

  const dateTypeOrder = ["day", "week", "month", "year"];
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );

  const finalResult = await repository.list.listReal(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  finalResult.sort((a, b) => {
    const dateTypeA = a.food_dateType;
    const dateTypeB = b.food_dateType;
    const dateStartA = new Date(a.food_dateStart);
    const dateStartB = new Date(b.food_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 1-2. find ---------------------------------------------------------------------------------------
export const find = async (
  PAGING_param, lang_param
) => {

  let URL_SEARCH = encodeURI(`https://www.fatsecret.kr/칼로리-영양소/search`)
  const query = PAGING_param.query;
  const page = PAGING_param.page === 0 ? "" : PAGING_param.page;

  let serv = "";
  let gram = "";
  let finalResult = [];

  const getFindResult = () => {
    return new Promise((resolve, reject) => {
      axios.get(URL_SEARCH, {
        params: {
          q: query,
          pg: page,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };

  const findResult = await getFindResult();
  const document = new JSDOM(findResult).window.document;

  // ex. 116중 11에서 20 .. -> 116
  const count = document.querySelector(".searchResultSummary")?.textContent;
  const countMatch = count ? count.match(/(\d+)중\s+(\d+)에서\s+(\d+)/) : null;
  const totalCnt = countMatch ? parseFloat(countMatch[1]) : 0;
  const tables = document.querySelectorAll(`table.generic.searchResult`);

  // 브랜드 이름 처리
  const getBrand = (param) => {
    if (!param) {
      return "";
    }

    // 1. 중첩괄호 처리
    const regex1 = /([(])(\s*)([가-힣a-zA-Z0-9'"!? ]+)(\s*)([(][a-zA-Z0-9'"!? ]+?[)])([)])/;
    const match = param.match(regex1);
    const firstResult = match ? match[3]?.trim() : param;

    // 2. 괄호 처리
    const regex2 = /([(])(\s*)([가-힣a-zA-Z0-9'"!? ]+)(\s*)([)])/;
    const match2 = firstResult.match(regex2);
    const secondResult = match2 ? match2[3]?.trim() : firstResult;

    return secondResult;
  };

  // 영양정보 처리
  const getServ = (param) => {
    const regex = /(\s*)(\d+\s*.*\n*)(\s*당\s*-\s*)(\s*칼\s*로\s*리\s*[:]\s*)(\d+\s*.*\n*)(kcal)(\s*[|]\s*)(\s*지\s*방\s*[:]\s*)(\d+\s*.*\n*)(g)(\s*[|]\s*)(\s*탄\s*수\s*화\s*물\s*[:]\s*)(\d+\s*.*\n*)(g)(\s*[|]\s*)(\s*단\s*백\s*질\s*[:]\s*)(\d+\s*.*\n*)(g)/;
    const matches = param.match(regex);

    // 단위 찾기
    if (matches) {
      let found = false;
      let servArray = [
        "개", "회", "알", "통", "봉", "컵", "팩", "줄", "장", "마리", "인분", "봉지", "한컵", "대접", "접시", "소접시", "테이블스푼"
      ];
      // 1. servArray에 포함된 단어가 있는 경우
      servArray.forEach((el) => {
        if (matches[2]?.includes(el)) {
          const idx = matches[2]?.indexOf(el);
          const gramMatch = matches[2]?.slice(idx + el.length).trim().match(/(\d+)\s*(g|ml|l|kg)/);
          serv = matches[2]?.slice(0, idx + el.length).replace(/(\d+)\s+(.+)/, "$1$2").trim();
          gram  = gramMatch ? gramMatch[1] : "0";
          found = true;
        }
      });

      // 2. servArray에 포함된 단어가 없는 경우
      if (!found) {
        const gramDirectMatch = matches[2]?.trim().match(/(\d+)\s*(g|ml|l|kg)/);
        if (gramDirectMatch) {
          serv = "1회";
          gram = gramDirectMatch[1];
        }
        else {
          const gramMatch = matches[2]?.trim().match(/(\d+)\s*(g|ml|l|kg)/);
          serv = matches ? matches[2]?.replace(/(\d+)\s+(.+)/, "$1$2").trim() : "1회";
          gram = gramMatch ? gramMatch[1] : "0";
        }
      }
    }
    return {
      count: (serv.match(/(\d+\.\d+|\d+)/) || [""])[0],
      serv: (serv.match(/[^\d]+$/) || [""])[0],
      gram: gram ? gram : "0",
      kcal: matches ? matches[5] : "0",
      fat: matches ? matches[9] : "0",
      carb: matches ? matches[13] : "0",
      protein: matches ? matches[17] : "0",
    };
  };

  tables.forEach((param, tableIndex) => {
    const rows = param.querySelectorAll("tr");
    Array.from(rows).forEach((prev, rowIndex) => {
      const titleElement = prev.querySelector("a.prominent")?.textContent?.trim();
      const brandElement = getBrand(prev.querySelector("a.brand")?.textContent?.trim());
      const nutritionElement = getServ(prev.querySelector("div.smallText.greyText.greyLink")?.textContent?.trim());

      finalResult.push({
        food_query: query,
        food_perNumber: page * 10 + tableIndex * rows.length + rowIndex + 1,
        food_part_idx: 1,
        food_part_val: "breakfast",
        food_name: titleElement === "" ? " " : titleElement,
        food_brand: brandElement === "" ? " " : brandElement,
        food_count: nutritionElement.count || "0",
        food_serv: nutritionElement.serv || "회",
        food_gram: nutritionElement.gram || "0",
        food_kcal: nutritionElement.kcal || "0",
        food_fat: nutritionElement.fat || "0",
        food_carb: nutritionElement.carb || "0",
        food_protein: nutritionElement.protein || "0",
      });
    });
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = async (
  user_id_param, _id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const finalResult = await repository.detail.detail (
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  const sectionCnt = finalResult?.food_section.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param, OBJECT_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  let finalResult = null;
  const findResult = await repository.save.detail(
    user_id_param, "", dateType, dateStart, dateEnd
  );

  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, dateType, dateStart, dateEnd
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param, dateType, dateStart, dateEnd
    );
  }

  return finalResult
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param, _id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const findResult = await repository.deletes.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      user_id_param, _id_param
    );
    return "deleted";
  }
};