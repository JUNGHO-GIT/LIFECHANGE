// exerciseGoalService.ts

import { strToDecimal, decimalToStr } from "@scripts/utils";
import * as repositoryGoal from "@repositories/exercise/exerciseGoalRepository";
import * as repositoryReal from "@repositories/exercise/exerciseRepository";

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

  findResult = await repositoryGoal.exist(
    user_id_param, dateType, dateStart, dateEnd
  );

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

  totalCnt = await repositoryGoal.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  findResult = await repositoryGoal.list(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  findResult.sort((a: any, b: any) => {
    const dateTypeA = a.exercise_goal_dateType;
    const dateTypeB = b.exercise_goal_dateType;
    const dateStartA = new Date(a.exercise_goal_dateStart);
    const dateStartB = new Date(b.exercise_goal_dateStart);
    const sortOrder = sort;

    const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
    const dateDiff = dateStartA.getTime() - dateStartB.getTime();

    if (dateTypeDiff !== 0) {
      return dateTypeDiff;
    }
    return sortOrder === 1 ? dateDiff : -dateDiff;
  });

  finalResult = await Promise.all(findResult.map(async (goal: any) => {
    const dateStart = goal?.exercise_goal_dateStart;
    const dateEnd = goal?.exercise_goal_dateEnd;

    const listReal = await repositoryReal.list(
      user_id_param, dateType, dateStart, dateEnd, sort, page
    );

    // totalVolume 이 0이 아닌 경우의 수를 계산해서 total count를 구함
    const exerciseTotalCount = listReal.reduce((acc, curr) => (
      acc + (curr?.exercise_total_volume !== "0" ? 1 : 0)
    ), 0);
    const exerciseTotalVolume = listReal.reduce((acc, curr) => (
      acc + (parseFloat(curr?.exercise_total_volume) ?? 0)
    ), 0);
    const exerciseTotalCardio = listReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.exercise_total_cardio ?? "00:00")
    ), 0);

    // 기간중 가장 최신의 몸무게를 가져옴
    const exerciseCurBodyWeight = listReal.reduce((latest, curr) => {
      if (curr?.exercise_total_weight) {
        return curr.exercise_total_weight;
      }
      return latest;
    }, null);

    return {
      ...goal,
      exercise_total_count: String(exerciseTotalCount),
      exercise_total_volume: String(exerciseTotalVolume),
      exercise_total_cardio: decimalToStr(exerciseTotalCardio),
      exercise_total_weight: String(exerciseCurBodyWeight),
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

  findResult = await repositoryGoal.detail(
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

  findResult = await repositoryGoal.save(
    user_id_param, "", OBJECT_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    statusResult = "fail";
    finalResult = null;
  }
  else {
    statusResult = "success";
    finalResult = findResult;
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
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateType = DATE_param.dateType;
  const dateStart = DATE_param.dateStart;
  const dateEnd = DATE_param.dateEnd;

  findResult = await repositoryGoal.update(
    user_id_param, _id_param, OBJECT_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    statusResult = "fail";
    finalResult = null;
  }
  else {
    statusResult = "success";
    finalResult = findResult;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
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

  findResult = await repositoryGoal.deletes(
    user_id_param, _id_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    statusResult = "fail";
    finalResult = null;
  }
  else {
    statusResult = "success";
    finalResult = findResult;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};