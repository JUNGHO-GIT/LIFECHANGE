// moneyService.ts

import * as repository from "@repositories/money/moneyRepository";

// 0. exist ----------------------------------------------------------------------------------------
export const exist = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResult: any = null;
  let finalResult: any = null;

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.exist.exist(
    user_id_param, dateType, dateStart, dateEnd
  );

  // sort by date 날짜 순으로 정렬
  finalResult = findResult[0]?.existDate?.sort((a: string, b: string) => {
    return a > b ? 1 : a < b ? -1 : 0;
  });

  return finalResult;
};

// 1. list (리스트는 gte lte) ----------------------------------------------------------------------
export const list = async (
  user_id_param: string,
  DATE_param: Record<string, any>,
  PAGING_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let totalCnt: number = 0;

  // date 변수 선언
  const dateTypeOrder = ["day", "week", "month", "year"];
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  totalCnt = await repository.list.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );

  findResult = await repository.list.listReal(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  if (findResult) {
    finalResult = findResult;
  }

  finalResult.sort((a: any, b: any) => {
    const dateTypeA = a.money_dateType;
    const dateTypeB = b.money_dateType;
    const dateStartA = new Date(a.money_dateStart);
    const dateStartB = new Date(b.money_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 2. detail (상세는 eq) ---------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  _id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let sectionCnt: number = 0;

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.detail.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (findResult) {
    finalResult = findResult;
    sectionCnt = findResult?.money_section.length || 0;
  }

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save -----------------------------------------------------------------------------------------
export const save = async (
  user_id_param: string,
  OBJECT_param: Record<string, any>,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResult: any = null;
  let finalResult: any = null;

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.save.detail(
    user_id_param, "", dateType, dateStart, dateEnd
  );

  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, dateType, dateStart, dateEnd
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param, dateType, dateStart, dateEnd
    );
  }

  return finalResult
};

// 4. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
  DATE_param: Record<string, any>,
) => {

  // findResult, finalResult 변수 선언
  let findResult: any = null;
  let finalResult: any = null;

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.deletes.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (findResult) {
    await repository.deletes.deletes(
      user_id_param, _id_param
    );
    finalResult = "deleted";
  }
  else {
    finalResult = null;
  }

  return finalResult;
};