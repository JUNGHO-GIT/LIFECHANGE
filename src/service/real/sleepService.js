// sleepService.js

import * as repo from "../../repository/real/sleepRepo.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);

  const totalCnt = await repo.totalCnt(
    user_id_param, startDt, endDt
  );

  const finalResult = await repo.findReal(
    user_id_param, sort, limit, page, startDt, endDt
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  sleep_dur_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const finalResult = await repo.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_param,
  sleep_dur_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const findResult = await repo.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repo.create(
      user_id_param, SLEEP_param, startDt, endDt
    );
  }
  else {
    finalResult = await repo.update(
      findResult._id, SLEEP_param
    );
  }

  return {
    result: finalResult
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_dur_param
) => {

  const [startDt, endDt] = sleep_dur_param.split(` ~ `);

  const finalResult = await repo.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return {
    result: finalResult
  };
};