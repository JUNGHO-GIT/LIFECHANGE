// calendarService.ts

import * as repository from "@repositories/calendar/calendarRepository";
import moment from "moment-timezone";

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
      const curDateType = curr.calendar_dateType;
      const curDateStart = curr.calendar_dateStart;
      const curDateEnd = curr.calendar_dateEnd;

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

// 1. list -----------------------------------------------------------------------------------------
// page는 무조건 0부터 시작
export const list = async (
  user_id_param: string,
  DATE_param: any,
  PAGING_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null
  let statusResult: string = "";
  let totalCntResult: any = null;

  // 플러스 마이너스 1개월
  const dateType = DATE_param.dateType;
  const dateStart = moment(DATE_param.dateStart).subtract(1, "months").format("YYYY-MM-DD");
  const dateEnd = moment(DATE_param.dateEnd).add(1, "months").format("YYYY-MM-DD");

  // sort, page 변수 선언
  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page || 0;

  totalCntResult = await repository.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );

  findResult = await repository.list(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  if (!findResult || findResult.length <= 0) {
    finalResult = [];
    statusResult = "fail";
  }
  else {
    finalResult = findResult;
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
  let sectionCntResult: number = 0;

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
  else {
    finalResult = findResult;
    statusResult = "success";
    sectionCntResult = findResult?.calendar_section.length || 0;
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
  let updateResult: any = null;
  let deleteResult: any = null;
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