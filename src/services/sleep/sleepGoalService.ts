// sleepGoalService.ts

import { strToDecimal, decimalToStr } from "@scripts/utils";
import * as repository from "@repositories/sleep/sleepGoalRepository";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.exist(
    user_id_param, dateType, dateStart, dateEnd
  );

  if (!findResult || findResult.length <= 0) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = findResult.reduce((acc: any, curr: any) => {
      const curDateType = curr.sleep_goal_dateType;
      const curDateStart = curr.sleep_goal_dateStart;
      const curDateEnd = curr.sleep_goal_dateEnd;

      acc[curDateType].push(`${curDateStart} ~ ${curDateEnd}`);

      return acc;
    }, {
      day: [],
      week: [],
      month: [],
      year: [],
      select: [],
    });
  }

  return {
    status: statusResult,
    result: finalResult
  };
};

// 1-1. list ---------------------------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  DATE_param: any,
  PAGING_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let totalCntResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateTypeOrder = ["day", "week", "month", "year"];
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // sort, page 변수 선언
  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page || 0;

  totalCntResult = await repository.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  findResult = await repository.listGoal(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );
  findResult.sort((a: any, b: any) => {
    const dateTypeA = a.sleep_goal_dateType;
    const dateTypeB = b.sleep_goal_dateType;
    const dateStartA = new Date(a.sleep_goal_dateStart);
    const dateStartB = new Date(b.sleep_goal_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  if (!findResult || findResult.length <= 0) {
    finalResult = [];
    statusResult = "fail";
  }
  else {
    finalResult = await Promise.all(findResult.map(async (goal: any) => {
      const dateStart = goal?.sleep_goal_dateStart;
      const dateEnd = goal?.sleep_goal_dateEnd;

      const listReal = await repository.listReal(
        user_id_param, dateType, dateStart, dateEnd
      );

      // 각 평균값 구하기
      const bedTime = listReal.reduce((acc, curr) => (
        acc + strToDecimal(curr?.sleep_bedTime)
      ), 0) / listReal.length;
      const wakeTime = listReal.reduce((acc, curr) => (
        acc + strToDecimal(curr?.sleep_wakeTime)
      ), 0) / listReal.length;
      const sleepTime = listReal.reduce((acc, curr) => (
        acc + strToDecimal(curr?.sleep_sleepTime)
      ), 0) / listReal.length;

      return {
        ...goal,
        sleep_bedTime: decimalToStr(bedTime),
        sleep_wakeTime: decimalToStr(wakeTime),
        sleep_sleepTime: decimalToStr(sleepTime)
      };
    }));
    statusResult = "success";
  }

  return {
    status: statusResult,
    totalCnt: totalCntResult,
    result: finalResult,
  };
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  _id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";
  let sectionCntResult: any = null;

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
    sectionCntResult = 0;
  }
  // real은 section.length, goal은 0 or 1
  else {
    finalResult = findResult;
    statusResult = "success";
    sectionCntResult = 1;
  }

  return {
    status: statusResult,
    sectionCnt: sectionCntResult,
    result: finalResult,
  };
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param: string,
  OBJECT_param: any,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let saveResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.detail(
    user_id_param, "", dateType, dateStart, dateEnd
  );

  if (!findResult) {
    saveResult = await repository.save(
      user_id_param, "", OBJECT_param, dateType, dateStart, dateEnd
    );
  }
  else {
    saveResult = await repository.update(
      user_id_param, findResult._id, OBJECT_param, dateType, dateStart, dateEnd
    );
  }

  if (!saveResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = saveResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4. update ---------------------------------------------------------------------------------------
export const update = async (
  user_id_param: string,
  _id_param: string,
  OBJECT_param: any,
  DATE_param: any,
) => {

  // result 변수 선언
  let updateResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  updateResult = await repository.update(
    user_id_param, _id_param, OBJECT_param, dateType, dateStart, dateEnd
  );

  if (!updateResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = updateResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 5. delete --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let deleteResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  deleteResult = await repository.deletes(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (!deleteResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = deleteResult;
    statusResult = "success";
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};