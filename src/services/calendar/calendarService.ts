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
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  findResult = await repository.exist(
    user_id_param, dateType, dateStart, dateEnd
  );

  if (!findResult || findResult?.length <= 0) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    statusResult = "success";
    finalResult = findResult.reduce((acc: any, curr: any) => {
      const curDateType = curr.calendar_dateType;
      const curDateStart = curr.calendar_dateStart;
      const curDateEnd = curr.calendar_dateEnd;

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
  const dateType = DATE_param?.dateType;
  const dateStart = moment(DATE_param?.dateStart).subtract(1, "months").format("YYYY-MM-DD");
  const dateEnd = moment(DATE_param?.dateEnd).add(1, "months").format("YYYY-MM-DD");

  // sort, page 변수 선언
  const sort = PAGING_param?.sort === "asc" ? 1 : -1;
  const page = PAGING_param?.page ? PAGING_param.page : 1;

  totalCntResult = await repository.cnt(
    user_id_param, dateType, dateStart, dateEnd
  );

  findResult = await repository.list(
    user_id_param, dateType, dateStart, dateEnd, sort, page
  );

  if (!findResult || findResult?.length <= 0) {
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
  let exerciseSectionCntResult: number = 0;
  let foodSectionCntResult: number = 0;
  let moneySectionCntResult: number = 0;
  let sleepSectionCntResult: number = 0;

  // date 변수 선언
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param, dateType, dateStart, dateEnd
  );

  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
  }
  else {
    finalResult = findResult?.[0] || {};
    statusResult = "success";
  }

	// 섹션 카운트
	exerciseSectionCntResult = findResult?.[0]?.calendar_exercise_section?.length || 0;
	foodSectionCntResult = findResult?.[0]?.calendar_food_section?.length || 0;
	moneySectionCntResult = findResult?.[0]?.calendar_money_section?.length || 0;
	sleepSectionCntResult = findResult?.[0]?.calendar_sleep_section?.length || 0;
	sectionCntResult = (
		exerciseSectionCntResult +
		foodSectionCntResult +
		moneySectionCntResult +
		sleepSectionCntResult
	);

  return {
    status: statusResult,
    exerciseSectionCnt: exerciseSectionCntResult,
    foodSectionCnt: foodSectionCntResult,
    moneySectionCnt: moneySectionCntResult,
    sleepSectionCnt: sleepSectionCntResult,
		sectionCnt: sectionCntResult,
    result: finalResult,
  };
};