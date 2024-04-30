// testService.js

import * as repository from "../repository/tweakRepository.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await repository.totalCnt(
    customer_id_param, part, title, startDt_param, endDt_param
  );

  const finalResult = await repository.list.find(
    customer_id_param, part, title, sort, limit, page, startDt_param, endDt_param
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};