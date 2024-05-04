// moneyService.js

import * as repository from "../repository/moneyRepository.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const page = parseInt(PAGING_param.page) === 0 ? 1 : PAGING_param.page;
  const limit = parseInt(PAGING_param.limit) === 0 ? 5 : PAGING_param.limit;
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const totalCnt = await repository.list.cnt(
    user_id_param, part, title, startDt_param, endDt_param
  );

  const findResult1 = await repository.list.list(
    user_id_param, part, title, sort, limit, page, startDt_param, endDt_param
  );

  const findResult2 = await repository.list.property(
    user_id_param
  );

  const finalResult = findResult1.map((item) => {
    return {
      ...item,
      money_property: findResult2[0]?.money_total_in - findResult2[0]?.money_total_out,
    };
  });

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    user_id_param, _id_param, startDt_param, endDt_param
  );

  const sectionCnt = finalResult?.money_section.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    user_id_param, "", startDt_param, endDt_param
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, startDt_param, endDt_param
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param, startDt_param, endDt_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param, _id_param, section_id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    user_id_param, _id_param, startDt_param, endDt_param
  );

  if (!findResult) {
    return null;
  }
  else {
    const updateResult = await repository.deletes.update(
      user_id_param, _id_param, section_id_param, startDt_param, endDt_param
    );
    if (!updateResult) {
      return null;
    }
    else {
      const findAgain = await repository.deletes.detail(
        user_id_param, _id_param, startDt_param, endDt_param
      );
      if (findAgain?.money_section.length === 0) {
        await repository.deletes.deletes(
          user_id_param, _id_param
        );
        return "deleted";
      }
      else {
        return findAgain;
      }
    }
  }
};