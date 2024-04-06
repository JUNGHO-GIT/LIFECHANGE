// testService.js

import {JSDOM} from "jsdom";
import axios from "axios";

// 1. search -------------------------------------------------------------------------------------->
export const search = async (
  query_param,
  page_param
) => {

  const URL_SEARCH = encodeURI(`http://www.fatsecret.kr/칼로리-영양소/search`);
  let finalResult = [];
  let searchResult;
  let totalCount = 0;
  let pageCount = 0;

  const searchFood = async (query, page) => {
    try {
      const response = await axios.get(URL_SEARCH, {
        params: {
          q: query,
          pg: page,
        },
      });
      return await response.data;
    }
    catch (error) {
      console.error(error);
      throw new Error(`searchFood: ${error}`);
    }
  };

  const domParser = (html) => {

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const tables = document.querySelectorAll(`table.generic.searchResult`);

    function calcCount (param) {
      const count = param.split("중")[0].trim();
      return count;
    };

    function cleanText (text) {
      if (typeof text !== "string") {
        return "";
      }
      else {
        const match = text.match(/.*단백질: \d+\.?\d*g/);
        const fmtText = match ? match[0] : text;
        return fmtText.replace(/[\n\t]+/gm, " ").replace(/\s\s+/gm, " ").trim();
      }
    };

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tr");
      Array.from(rows).forEach((prev) => {
        const titleElement = cleanText(prev.querySelector("a.prominent")?.textContent);
        const brandElement = cleanText(prev.querySelector("a.brand")?.textContent);
        const nutritionElement = cleanText(prev.querySelector("div.smallText.greyText")?.textContent);

        const regex = /(\s*)(.*)(당\s*-\s*)(칼\s*로\s*리\s*[:])(\s*.*kcal\s)(\s*[|]\s*)(지\s*방\s*[:])(\s*.*g\s*)(\s*[|]\s*)(탄\s*수\s*화\s*물\s*[:])(\s*.*g\s*)(\s*[|]\s*)(단\s*백\s*질\s*[:])(\s*.*g\s*)/;
        const matches = nutritionElement.match(regex);

        if (matches) {
          finalResult.push({
            title: titleElement,
            brand: brandElement,
            serv: matches[2]?.trim(),
            kcal: matches[5]?.trim(),
            fat: matches[8]?.trim(),
            carb: matches[11]?.trim(),
            protein: matches[14]?.trim(),
          });
          totalCount = calcCount(document.querySelector(".searchResultSummary")?.textContent);
          pageCount = Math.ceil(totalCount / 10);
        }
      });
    });

    return finalResult;
  };

  searchResult = searchFood(query_param, page_param);
  finalResult = domParser(await searchResult);

  return {
    pageCount: pageCount,
    result: finalResult,
  };
};