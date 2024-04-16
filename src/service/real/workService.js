// workService.js

import * as repository from "../../repository/real/workRepository.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDt, endDt] = work_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await repository.totalCnt(
    user_id_param, part, title, startDt, endDt
  );

  const finalResult = await repository.findReal(
    user_id_param, part, title, sort, limit, page, startDt, endDt
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
  work_dur_param
) => {

  const [startDt, endDt] = work_dur_param.split(` ~ `);

  const finalResult = await repository.detail(
    _id_param, user_id_param, startDt, endDt
  );

  const sectionCnt = finalResult?.work_section.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_param,
  work_dur_param
) => {

  const [startDt, endDt] = work_dur_param.split(` ~ `);

  const findResult = await repository.detail(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.create(
      user_id_param, WORK_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.update(
      findResult._id, WORK_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  work_dur_param
) => {

  const [startDt, endDt] = work_dur_param.split(` ~ `);

  const finalResult = await repository.deletes(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};