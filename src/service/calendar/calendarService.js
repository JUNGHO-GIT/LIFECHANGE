// calendarService.js

import * as repository from "../../repository/calendar/calendarRepository.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);

  const totalCnt = await repository.list.cnt(
    user_id_param, dateStart, dateEnd
  );

  const finalResult = await repository.list.list(
    user_id_param, dateStart, dateEnd
  );

  return {
    totalCnt: totalCnt,
    result: finalResult,
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

  const sectionCnt = finalResult?.calendar_section.length || 0;

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
  user_id_param, _id_param, section_id_param, duration_param
) => {

  const [dateStart, dateEnd] = duration_param.split(` ~ `);

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
      if (findAgain?.calendar_section.length === 0) {
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
}