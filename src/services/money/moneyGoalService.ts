// moneyGoalService.ts

import * as repository from "@repositories/money/moneyGoalRepository";

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

  if (!findResult || findResult.length <= 0) {
    statusResult = "fail";
    finalResult = null;
  }
  else {
    statusResult = "success";
    finalResult = findResult[0]?.existDate?.sort((a: string, b: string) => {
      return a > b ? 1 : a < b ? -1 : 0;
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
  let totalCnt: number = 0;

  // date 변수 선언
  const dateTypeOrder = ["day", "week", "month", "year"];
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  // sort, page 변수 선언
  const sort = PAGING_param.sort === "asc" ? 1 : -1;
  const page = PAGING_param.page || 0;

  totalCnt = await repository.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  findResult = await repository.list.listGoal(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  findResult.sort((a: any, b: any) => {
    const dateTypeA = a.money_goal_dateType;
    const dateTypeB = b.money_goal_dateType;
    const dateStartA = new Date(a.money_goal_dateStart);
    const dateStartB = new Date(b.money_goal_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  finalResult = await Promise.all(findResult.map(async (goal: any) => {
    const dateStart = goal?.money_goal_dateStart;
    const dateEnd = goal?.money_goal_dateEnd;

    const listReal = await repository.list(
      user_id_param, dateType, dateStart, dateEnd
    );

    const moneyTotalIncome = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.money_total_income) ?? 0)
    ), 0);
    const moneyTotalExpense = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.money_total_expense) ?? 0)
    ), 0);

    return {
      ...goal,
      money_total_income: String(moneyTotalIncome),
      money_total_expense: String(moneyTotalExpense)
    };
  }));

  return {
    totalCnt : totalCnt,
    result : finalResult
  }
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
  let sectionCnt: number = 0;

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repository.detail(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (findResult) {
    finalResult = findResult;
    sectionCnt = findResult ? 1 : 0;
  }

  return {
    sectionCnt: sectionCnt,
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
  let finalResult: any = null;
  let statusResult: string = "";

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

// 5. deletes --------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  _id_param: string,
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

  return {
    status: statusResult,
    result: finalResult
  };
};