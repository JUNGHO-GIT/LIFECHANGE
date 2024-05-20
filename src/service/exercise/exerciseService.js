// exerciseService.js

import * as repository from "../../repository/exercise/exerciseRepository.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, FILTER_param, PAGING_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const part = FILTER_param.part === "" ? "전체" : FILTER_param.part;
  const title = FILTER_param.title === "" ? "전체" : FILTER_param.title;

  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;
  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;

  const totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd, part, title
  );

  const finalResult = await repository.list.list(
    user_id_param, dateType, dateStart, dateEnd, part, title, sort, limit, page
  );

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const finalResult = await repository.detail.detail(
    user_id_param, _id_param, dateStart, dateEnd
  );

  const sectionCnt = finalResult?.exercise_section.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

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
  user_id_param, _id_param, section_id_param, DATE_param
) => {

  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const findResult = await repository.deletes.detail(
    user_id_param, _id_param, dateStart, dateEnd
  );
  if (!findResult) {
    return null;
  }
  else {
    const updateResult = await repository.deletes.update(
      user_id_param, _id_param, section_id_param, dateStart, dateEnd
    );
    if (!updateResult) {
      return null;
    }
    else {
      const findAgain = await repository.deletes.detail(
        user_id_param, _id_param, dateStart, dateEnd
      );
      if (findAgain?.exercise_section.length === 0) {
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