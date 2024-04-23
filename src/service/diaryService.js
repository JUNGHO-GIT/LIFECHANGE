// diaryService.js

import * as repository from "../repository/diaryRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  customer_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const totalCnt = await repository.totalCnt(
    customer_id_param, startDt, endDt
  );

  const finalResult = await repository.list.find(
    customer_id_param, startDt, endDt
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param, customer_id_param, category_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, customer_id_param, category_param, startDt, endDt
  );

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  customer_id_param, category_param, OBJECT_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    "", customer_id_param, category_param, startDt, endDt
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
  _id_param, customer_id_param, category_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    _id_param, customer_id_param, category_param, startDt, endDt
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      _id_param
    );
    return "deleted";
  }
}