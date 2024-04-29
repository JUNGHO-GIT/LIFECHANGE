// diaryService.js

import * as repository from "../repository/diaryRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const totalCnt = await repository.totalCnt(
    customer_id_param, startDt_param, endDt_param
  );

  const finalResult = await repository.list.find(
    customer_id_param, startDt_param, endDt_param
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};