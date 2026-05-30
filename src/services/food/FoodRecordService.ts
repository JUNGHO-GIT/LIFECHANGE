/**
 * @file FoodRecordService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/food/FoodRecordRepository";

// 0. exist ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const exist = async (
  usrIdPrm: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  // date 변수 선언
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.exist(
    usrIdPrm, dateType, dateStart, dateEnd,
  );

  if (!findResult || findResult?.length <= 0) {
    finalResult = null;
    statusResult = `fail`;
  }
  else {
    statusResult = `success`;
    finalResult = findResult.reduce((acc: any, curr: any) => {
      const curDateType: any = curr.food_record_dateType;
      const curDateStart: any = curr.food_record_dateStart;
      const curDateEnd: any = curr.food_record_dateEnd;

      acc[curDateType].push(`${curDateStart} - ${curDateEnd}`);

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
    result: finalResult,
  };
};

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
export const list = async (
  usrIdPrm: string,
  DATE_param: any,
  PAGING_param: any,
) => {

  if (typeof DATE_param === `string`) { try { DATE_param = JSON.parse(DATE_param); } catch (e) {} }
  if (typeof PAGING_param === `string`) { try { PAGING_param = JSON.parse(PAGING_param); } catch (e) {} }

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let ttlCntRes: number = 0;
  let statusResult: string = ``;

  // date 변수 선언
  const dtTypOrdr: string[] = [ `day`, `week`, `month`, `year` ];
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  // sort, page, part 변수 선언
  const sort: 1 | -1 = PAGING_param?.sort === `asc` ? 1 : -1;
  const page: number = PAGING_param?.page ?? 1;
  const part: string = PAGING_param?.part ?? `all`;

  findResult = await repository.list(
    usrIdPrm, dateType, dateStart, dateEnd, sort, page, part,
  );

  if (!findResult || findResult?.length <= 0) {
    finalResult = [];
    statusResult = `fail`;
  }
  else {
    findResult?.sort((a: any, b: any) => {
      const dateTypeA: string = a.food_record_dateType;
      const dateTypeB: string = b.food_record_dateType;
      const dateStartA: Date = new Date(a.food_record_dateStart);
      const dateStartB: Date = new Date(b.food_record_dateStart);
      const sortOrder: number = sort;

      const dateTypeDiff: number = dtTypOrdr.indexOf(dateTypeA) - dtTypOrdr.indexOf(dateTypeB);
      const dateDiff: number = dateStartA.getTime() - dateStartB.getTime();

      if (dateTypeDiff !== 0) {
        return dateTypeDiff;
      }
      return sortOrder === 1 ? dateDiff : -dateDiff;
    });
    finalResult = findResult;
    statusResult = `success`;
    ttlCntRes = findResult.length;
  }

  return {
    status: statusResult,
    totalCnt: ttlCntRes,
    result: finalResult,
  };
};

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (
  usrIdPrm: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;
  let secCntRes: number = 0;

  // date 변수 선언
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.detail(
    usrIdPrm, dateType, dateStart, dateEnd,
  );

  // record = section?.length
  // goal = 0 or 1
  if (!findResult) {
    finalResult = null;
    statusResult = `fail`;
    secCntRes = 0;
  }
  else {
    finalResult = findResult;
    statusResult = `success`;
    secCntRes = findResult.food_section?.length;
  }

  return {
    status: statusResult,
    sectionCnt: secCntRes,
    result: finalResult,
  };
};

// 3. create ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const create = async (
  usrIdPrm: string,
  OBJECT_param: any,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let deleteResult: any = null;
  let createResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  // date 변수 선언
  const exstDtTyp: string = OBJECT_param.food_record_dateType;
  const exstDtStrt: string = OBJECT_param.food_record_dateStart;
  const exstDtEnd: string = OBJECT_param.food_record_dateEnd;
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.detail(
    usrIdPrm, exstDtTyp, exstDtStrt, exstDtEnd,
  );

  if (!findResult) {
    createResult = await repository.create(
      usrIdPrm, OBJECT_param, dateType, dateStart, dateEnd,
    );
  }
  else {
    deleteResult = await repository.deletes(
      usrIdPrm, exstDtTyp, exstDtStrt, exstDtEnd,
    );
    if (!deleteResult) {
      finalResult = null;
      statusResult = `fail`;
    }
    else {
      createResult = await repository.create(
        usrIdPrm, OBJECT_param, dateType, dateStart, dateEnd,
      );
    }
  }

  if (!createResult) {
    finalResult = null;
    statusResult = `fail`;
  }
  else {
    finalResult = createResult;
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4. update ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const update = async (
  usrIdPrm: string,
  OBJECT_param: any,
  DATE_param: any,
  type_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let deleteResult: any = null;
  let updateResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  // date 변수 선언
  const exstDtTyp: string = OBJECT_param.food_record_dateType;
  const exstDtStrt: string = OBJECT_param.food_record_dateStart;
  const exstDtEnd: string = OBJECT_param.food_record_dateEnd;
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.detail(
    usrIdPrm, exstDtTyp, exstDtStrt, exstDtEnd,
  );

  if (!findResult) {
    finalResult = null;
    statusResult = `fail`;
  }
  else {
    // update (기존항목 유지 + 타겟항목으로 수정)
    if (type_param === `update`) {
      updateResult = await repository.update.update(
        usrIdPrm, OBJECT_param, dateType, dateStart, dateEnd,
      );
      if (!updateResult) {
        finalResult = null;
        statusResult = `fail`;
      }
      else {
        finalResult = updateResult;
        statusResult = `success`;
      }
    }
    // insert (기존항목 제거 + 타겟항목에 추가)
    else if (type_param === `insert`) {
      deleteResult = await repository.deletes(
        usrIdPrm, exstDtTyp, exstDtStrt, exstDtEnd,
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = `fail`;
      }
      else {
        updateResult = await repository.update.insert(
          usrIdPrm, OBJECT_param, dateType, dateStart, dateEnd,
        );
      }
      if (!updateResult) {
        finalResult = null;
        statusResult = `fail`;
      }
      else {
        finalResult = updateResult;
        statusResult = `success`;
      }
    }
    // replace (기존항목 제거 + 타겟항목을 교체)
    else if (type_param === `replace`) {
      deleteResult = await repository.deletes(
        usrIdPrm, exstDtTyp, exstDtStrt, exstDtEnd,
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = `fail`;
      }
      else {
        updateResult = await repository.update.replace(
          usrIdPrm, OBJECT_param, dateType, dateStart, dateEnd,
        );
      }
      if (!updateResult) {
        finalResult = null;
        statusResult = `fail`;
      }
      else {
        finalResult = updateResult;
        statusResult = `success`;
      }
    }
  }

  if (!updateResult) {
    finalResult = null;
    statusResult = `fail`;
  }
  else {
    finalResult = updateResult;
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 5. delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const deletes = async (
  usrIdPrm: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let deleteResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  // date 변수 선언
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  deleteResult = await repository.deletes(
    usrIdPrm, dateType, dateStart, dateEnd,
  );

  if (!deleteResult) {
    finalResult = null;
    statusResult = `fail`;
  }
  else {
    finalResult = deleteResult;
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
