// sleepRecordService.ts

import * as repository from "@repositories/sleep/SleepRecordRepository";
import { timeToDecimal, decimalToTime } from "@assets/scripts/utils";

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
      const curDateType = curr.sleep_record_dateType;
      const curDateStart = curr.sleep_record_dateStart;
      const curDateEnd = curr.sleep_record_dateEnd;

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
    // group records by dateStart to ensure single entry per date
    const grouped: Record<string, any> = {};
    findResult.forEach((doc: any) => {
      const key = doc.sleep_record_dateStart;
      if (!grouped[key]) {
        grouped[key] = {
          docs: [],
          totalBedDecimal: 0,
          totalWakeDecimal: 0,
          totalSleepDecimal: 0,
          bedCount: 0,
          wakeCount: 0,
          sleepCount: 0,
        };
      }
      grouped[key].docs.push(doc);
      const sections = doc?.sleep_section || [];
      sections.forEach((sec: any) => {
  grouped[key].totalBedDecimal += timeToDecimal(sec?.sleep_record_bedTime || "00:00");
        grouped[key].bedCount++;
  grouped[key].totalWakeDecimal += timeToDecimal(sec?.sleep_record_wakeTime || "00:00");
        grouped[key].wakeCount++;
  grouped[key].totalSleepDecimal += timeToDecimal(sec?.sleep_record_sleepTime || "00:00");
        grouped[key].sleepCount++;
      });
    });

    // build final array from grouped results
    const groupedArray = Object.keys(grouped).map((dateKey) => {
      const g = grouped[dateKey];
      const firstDoc = g.docs[0];
  const avgBed = decimalToTime(g.totalBedDecimal / (g.bedCount || 1));
  const avgWake = decimalToTime(g.totalWakeDecimal / (g.wakeCount || 1));
  const avgSleep = decimalToTime(g.totalSleepDecimal / (g.sleepCount || 1));
      return {
        _id: firstDoc?._id || null,
        sleep_record_dateType: firstDoc?.sleep_record_dateType,
        sleep_record_dateStart: dateKey,
        sleep_record_dateEnd: firstDoc?.sleep_record_dateEnd,
        sleep_record_bedTime: avgBed,
        sleep_record_wakeTime: avgWake,
        sleep_record_sleepTime: avgSleep,
        // keep representative sleep_section (first doc) for detail navigation
        sleep_section: firstDoc?.sleep_section || [],
      };
    });

    // sort grouped array
    groupedArray.sort((a: any, b: any) => {
      const dateTypeA = a.sleep_record_dateType;
      const dateTypeB = b.sleep_record_dateType;
      const dateStartA = new Date(a.sleep_record_dateStart);
      const dateStartB = new Date(b.sleep_record_dateStart);
      const dateTypeDiff = dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
      const dateDiff = dateStartA.getTime() - dateStartB.getTime();
      if (dateTypeDiff !== 0) {
        return dateTypeDiff;
      }
      return sort === 1 ? dateDiff : -dateDiff;
    });

    finalResult = groupedArray;
    // set total count to number of unique dates
    totalCntResult = groupedArray.length;
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

  // date 변수 선언
  const dateType = DATE_param?.dateType;
  const dateStart = DATE_param?.dateStart;
  const dateEnd = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param, dateType, dateStart, dateEnd
  );

  // record = section?.length
  // goal = 0 or 1
  if (!findResult) {
    finalResult = null;
    statusResult = "fail";
    sectionCntResult = 0;
  }
  else {
    finalResult = findResult;
    statusResult = "success";
    sectionCntResult = findResult.sleep_section?.length;
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
  const existingDateType = OBJECT_param.sleep_record_dateType;
  const existingDateStart = OBJECT_param.sleep_record_dateStart;
  const existingDateEnd = OBJECT_param.sleep_record_dateEnd;
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
  const existingDateType = OBJECT_param.sleep_record_dateType;
  const existingDateStart = OBJECT_param.sleep_record_dateStart;
  const existingDateEnd = OBJECT_param.sleep_record_dateEnd;
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
    // insert (기존항목 제거 + 타겟항목에 추가)
    else if (type_param === "insert") {
      deleteResult = await repository.deletes(
        user_id_param, existingDateType, existingDateStart, existingDateEnd
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = "fail";
      }
      else {
        updateResult = await repository.update.insert(
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