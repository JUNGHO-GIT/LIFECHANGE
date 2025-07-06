// exerciseGoalService.ts

import { strToDecimal, decimalToStr } from "@assets/scripts/utils";
import * as repository from "@repositories/exercise/exerciseGoalRepository";

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
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

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
      const curDateType = curr.exercise_goal_dateType;
      const curDateStart = curr.exercise_goal_dateStart;
      const curDateEnd = curr.exercise_goal_dateEnd;

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
    result: finalResult
  };
};

// 1. list -----------------------------------------------------------------------------------------
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
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  // sort, page 변수 선언
  const sort = PAGING_param?.sort === "asc" ? 1 : -1;
  const page = PAGING_param?.page || 0;

  totalCntResult = await repository.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );
  findResult = await repository.listGoal(
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

  if (!findResult || findResult.length <= 0) {
    finalResult = [];
    statusResult = "fail";
  }
  else {
    finalResult = await Promise.all(findResult.map(async (goal: any) => {
      const dateStart = goal?.exercise_goal_dateStart;
      const dateEnd = goal?.exercise_goal_dateEnd;

      const listReal = await repository.listReal(
        user_id_param, dateType, dateStart, dateEnd,
      );

      // totalVolume 이 0이 아닌 경우의 수를 계산해서 total count를 구함
      const exerciseTotalCount = listReal.reduce((acc: any, curr: any) => (
        acc + (curr?.exercise_total_volume !== "0" ? 1 : 0)
      ), 0);
      const exerciseTotalVolume = listReal.reduce((acc: any, curr: any) => (
        acc + parseFloat(curr?.exercise_total_volume || "0")
      ), 0);
      const exerciseTotalCardio = listReal.reduce((acc: any, curr: any) => (
        acc + strToDecimal(curr?.exercise_total_cardio || "00:00")
      ), 0);
      const exerciseCurScale = listReal.reduce((latest: any, curr: any) => {
        if (curr?.exercise_total_scale) {
          return curr.exercise_total_scale;
        }
        return latest;
      }, "0");

      return {
        ...goal,
        exercise_total_count: String(exerciseTotalCount),
        exercise_total_volume: String(exerciseTotalVolume.toFixed(0)),
        exercise_total_cardio: decimalToStr(exerciseTotalCardio),
        exercise_total_scale: String(exerciseCurScale),
      };
    }));
    statusResult = "success";
  }

  return {
    status: statusResult,
    totalCnt: totalCntResult,
    result: finalResult,
  }
};

// 2. detail ---------------------------------------------------------------------------------------
export const detail = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";
  let sectionCntResult: number = 0;

  // date 변수 선언
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param, dateType, dateStart, dateEnd
  );

  // real = section.length
  // goal = 0 or 1
  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
    sectionCntResult = 0;
  }
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

// 3. create ---------------------------------------------------------------------------------------
export const create = async (
  user_id_param: string,
  OBJECT_param: any,
  DATE_param: any,
) => {

  // result 변수 선언
  let findResult: any = null;
  let deleteResult: any = null;
  let createResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const existingDateType = OBJECT_param.exercise_goal_dateType;
  const existingDateStart = OBJECT_param.exercise_goal_dateStart;
  const existingDateEnd = OBJECT_param.exercise_goal_dateEnd;
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param, existingDateType, existingDateStart, existingDateEnd
  );

  if (!findResult) {
    createResult = await repository.create(
      user_id_param, OBJECT_param, dateType, dateStart, dateEnd
    );
  }
  else {
    deleteResult = await repository.deletes(
      user_id_param, existingDateType, existingDateStart, existingDateEnd
    );
    if (!deleteResult) {
      finalResult = null;
      statusResult = "fail";
    }
    else {
      createResult = await repository.create(
        user_id_param, OBJECT_param, dateType, dateStart, dateEnd
      );
    }
  }

  if (!createResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = createResult;
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
  OBJECT_param: any,
  DATE_param: any,
  type_param: string,
) => {

  // result 변수 선언
  let findResult: any = null;
  let deleteResult: any = null;
  let updateResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const existingDateType = OBJECT_param.exercise_goal_dateType;
  const existingDateStart = OBJECT_param.exercise_goal_dateStart;
  const existingDateEnd = OBJECT_param.exercise_goal_dateEnd;
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param, existingDateType, existingDateStart, existingDateEnd
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    // update (기존항목 유지 + 타겟항목으로 수정)
    if (type_param === "update") {
      updateResult = await repository.update.update(
        user_id_param, OBJECT_param, dateType, dateStart, dateEnd
      );
      if (!updateResult) {
        finalResult = null;
        statusResult = "fail";
      }
      else {
        finalResult = updateResult;
        statusResult = "success";
      }
    }
    // replace (기존항목 제거 + 타겟항목을 교체)
    else if (type_param === "replace") {
      deleteResult = await repository.deletes(
        user_id_param, existingDateType, existingDateStart, existingDateEnd
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = "fail";
      }
      else {
        updateResult = await repository.update.replace(
          user_id_param, OBJECT_param, dateType, dateStart, dateEnd
        );
      }
      if (!updateResult) {
        finalResult = null;
        statusResult = "fail";
      }
      else {
        finalResult = updateResult;
        statusResult = "success";
      }
    }
  }

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

// 5. delete ---------------------------------------------------------------------------------------
export const deletes = async (
  user_id_param: string,
  DATE_param: any,
) => {

  // result 변수 선언
  let deleteResult: any = null;
  let finalResult: any = null;
  let statusResult: string = "";

  // date 변수 선언
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  deleteResult = await repository.deletes(
    user_id_param, dateType, dateStart, dateEnd
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