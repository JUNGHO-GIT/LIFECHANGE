// moneyService.js

import * as repository from "../repository/moneyRepository.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, duration_param, FILTER_param, PAGING_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = parseInt(FILTER_param.limit) === 0 ? 5 : parseInt(FILTER_param.limit);
  const page = parseInt(PAGING_param.page) === 0 ? 1 : parseInt(PAGING_param.page);
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await repository.totalCnt(
    customer_id_param, part, title, startDt, endDt
  );

  const finalResult = await repository.list.find(
    customer_id_param, part, title, sort, limit, page, startDt, endDt
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param, customer_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, customer_id_param, startDt, endDt
  );

  const sectionCnt = finalResult?.money_section.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    "", customer_id_param, startDt, endDt
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      customer_id_param, OBJECT_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.save.update(
      findResult._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param, section_id_param, customer_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    _id_param, customer_id_param, startDt, endDt
  );

  if (!findResult) {
    return null;
  }
  else {
    const updateResult = await repository.deletes.update(
      _id_param, section_id_param, customer_id_param, startDt, endDt
    );
    if (!updateResult) {
      return null;
    }
    else {
      const findAgain = await repository.deletes.detail(
        _id_param, customer_id_param, startDt, endDt
      );
      if (findAgain?.money_section.length === 0) {
        await repository.deletes.deletes(
          _id_param
        );
        return "deleted";
      }
      else {
        return findAgain;
      }
    }
  }
};