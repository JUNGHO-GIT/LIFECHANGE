// testService.js

import * as repository from "../repository/tweakRepository.js";

// 1-1. dataset ----------------------------------------------------------------------------------->
export const dataset = async (
  customer_id_param
) => {

  const findResult = await repository.dataset.list(
    customer_id_param
  );

  return findResult;
};

// 1-2. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await repository.list.cnt(
    customer_id_param, part, title, startDt_param, endDt_param
  );

  const finalResult = await repository.list.list(
    customer_id_param, sort, limit, page
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param
) => {

  const findResult = await repository.detail(
    customer_id_param, ""
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      customer_id_param, OBJECT_param
    );
  }
  else {
    finalResult = await repository.update(
      customer_id_param, findResult._id, OBJECT_param
    );
  }

  return finalResult
};