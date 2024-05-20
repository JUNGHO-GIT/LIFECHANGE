// moneyPlanService.js

import * as repository from "../../repository/money/moneyPlanRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);
  const dateType = FILTER_param.dateType;

  const sort = FILTER_param.order === "asc" ? 1 : -1;

  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;
  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );

  const finalResult = await repository.list.list(
    user_id_param, dateType, dateStart, dateEnd, sort, limit, page
  );

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    user_id_param, _id_param, dateStart, dateEnd
  );

  const sectionCnt = finalResult ? 1 : 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    user_id_param, "", dateStart, dateEnd
  );

  let finalResult = null;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, dateStart, dateEnd
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param, dateStart, dateEnd
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param, _id_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    user_id_param, _id_param, dateStart, dateEnd
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      user_id_param, _id_param
    );
    return "deleted";
  }
}