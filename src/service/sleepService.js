// sleepService.js

import * as repository from "../repository/sleepRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const page = parseInt(PAGING_param.page) === 0 ? 1 : PAGING_param.page;
  const limit = parseInt(PAGING_param.limit) === 0 ? 5 : PAGING_param.limit;

  const totalCnt = await repository.list.cnt(
    customer_id_param, startDt_param, endDt_param
  );

  const finalResult = await repository.list.list(
    customer_id_param, sort, limit, page, startDt_param, endDt_param
  );

  console.log("===================================");
  console.log("finalResult : " + JSON.stringify(finalResult, null, 2));

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  customer_id_param, _id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    customer_id_param, _id_param, startDt_param, endDt_param
  );

  const sectionCnt = finalResult?.sleep_section.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, OBJECT_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    customer_id_param, "", startDt_param, endDt_param
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      customer_id_param, OBJECT_param, startDt_param, endDt_param
    );
  }
  else {
    finalResult = await repository.save.update(
      customer_id_param, findResult._id, OBJECT_param, startDt_param, endDt_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  customer_id_param, _id_param, section_id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    customer_id_param, _id_param, startDt_param, endDt_param
  );

  if (!findResult) {
    return null;
  }
  else {
    const updateResult = await repository.deletes.update(
      customer_id_param, _id_param, section_id_param, startDt_param, endDt_param
    );
    if (!updateResult) {
      return null;
    }
    else {
      const findAgain = await repository.deletes.detail(
        customer_id_param, _id_param, startDt_param, endDt_param
      );
      if (findAgain?.sleep_section.length === 0) {
        await repository.deletes.deletes(
          customer_id_param, _id_param
        );
        return "deleted";
      }
      else {
        return findAgain;
      }
    }
  }
};