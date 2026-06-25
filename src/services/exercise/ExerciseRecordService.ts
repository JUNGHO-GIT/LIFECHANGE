/**
 * @file ExerciseRecordService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import * as repository from "@repositories/exercise/ExerciseRecordRepository";
import * as goalRepository from "@repositories/exercise/ExerciseGoalRepository";

// 0. exist ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const exist = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  // date 변수 선언
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.exist(
    user_id_param,
    dateType,
    dateStart,
    dateEnd,
  );

  if (!findResult || findResult?.length <= 0) {
    finalResult = null;
    statusResult = `fail`;
  } else {
    statusResult = `success`;
    finalResult = findResult.reduce(
      (acc: any, curr: any) => {
        const curDateType: any = curr.exercise_record_dateType;
        const curDateStart: any = curr.exercise_record_dateStart;
        const curDateEnd: any = curr.exercise_record_dateEnd;

        acc[curDateType].push(`${curDateStart} - ${curDateEnd}`);

        return acc;
      },
      {
        day: [],
        week: [],
        month: [],
        year: [],
        select: [],
      },
    );
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const list = async (
  user_id_param: string,
  DATE_param: any,
  PAGING_param: any,
) => {
  if (typeof DATE_param === `string`) {
    try {
      DATE_param = JSON.parse(DATE_param);
    } catch (e) {}
  }
  if (typeof PAGING_param === `string`) {
    try {
      PAGING_param = JSON.parse(PAGING_param);
    } catch (e) {}
  }

  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let totalCntResult: number = 0;
  let statusResult: string = ``;

  // date 변수 선언
  const dateTypeOrder: string[] = [`day`, `week`, `month`, `year`];
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  // sort, page, part, title 변수 선언
  const sort: 1 | -1 = PAGING_param?.sort === `asc` ? 1 : -1;
  const page: number = PAGING_param?.page ?? 1;
  const part: string = PAGING_param?.part ?? `all`;
  const title: string = PAGING_param?.title ?? `all`;

  findResult = await repository.list(
    user_id_param,
    dateType,
    dateStart,
    dateEnd,
    sort,
    page,
    part,
    title,
  );

  if (!findResult || findResult?.length <= 0) {
    finalResult = [];
    statusResult = `fail`;
  } else {
    findResult?.sort((a: any, b: any) => {
      const dateTypeA: string = a.exercise_record_dateType;
      const dateTypeB: string = b.exercise_record_dateType;
      const dateStartA: Date = new Date(a.exercise_record_dateStart);
      const dateStartB: Date = new Date(b.exercise_record_dateStart);
      const sortOrder: number = sort;

      const dateTypeDiff: number =
        dateTypeOrder.indexOf(dateTypeA) - dateTypeOrder.indexOf(dateTypeB);
      const dateDiff: number = dateStartA.getTime() - dateStartB.getTime();

      if (dateTypeDiff !== 0) {
        return dateTypeDiff;
      }
      return sortOrder === 1 ? dateDiff : -dateDiff;
    });
    const findGoal: any[] = await goalRepository.listGoal(
      user_id_param,
      dateType,
      dateStart,
      dateEnd,
      1,
      page,
    );
    finalResult = findResult.map((record: any) => {
      const goal: any = findGoal?.find((item: any) => (
        record?.exercise_record_dateStart >= item?.exercise_goal_dateStart &&
        record?.exercise_record_dateEnd <= item?.exercise_goal_dateEnd
      ));

      return {
        ...record,
        exercise_goal_count: goal?.exercise_goal_count ?? `0`,
        exercise_goal_volume: goal?.exercise_goal_volume ?? `0`,
        exercise_goal_cardio: goal?.exercise_goal_cardio ?? `00:00`,
        exercise_goal_scale: goal?.exercise_goal_scale ?? `0`,
      };
    });
    statusResult = `success`;
    totalCntResult = finalResult.length;
  }

  return {
    status: statusResult,
    totalCnt: totalCntResult,
    result: finalResult,
  };
};

// 2. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const detail = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;
  let sectionCntResult: number = 0;

  // date 변수 선언
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param,
    dateType,
    dateStart,
    dateEnd,
  );

  // record = section?.length
  // goal = 0 or 1
  if (!findResult) {
    finalResult = null;
    statusResult = `fail`;
    sectionCntResult = 0;
  } else {
    finalResult = findResult;
    statusResult = `success`;
    sectionCntResult = findResult.exercise_section?.length;
  }

  return {
    status: statusResult,
    sectionCnt: sectionCntResult,
    result: finalResult,
  };
};

// 3. create ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
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
  let statusResult: string = ``;

  // date 변수 선언
  const existingDateType: string = OBJECT_param.exercise_record_dateType;
  const existingDateStart: string = OBJECT_param.exercise_record_dateStart;
  const existingDateEnd: string = OBJECT_param.exercise_record_dateEnd;
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param,
    existingDateType,
    existingDateStart,
    existingDateEnd,
  );

  if (!findResult) {
    createResult = await repository.create(
      user_id_param,
      OBJECT_param,
      dateType,
      dateStart,
      dateEnd,
    );
  } else {
    deleteResult = await repository.deletes(
      user_id_param,
      existingDateType,
      existingDateStart,
      existingDateEnd,
    );
    if (!deleteResult) {
      finalResult = null;
      statusResult = `fail`;
    } else {
      createResult = await repository.create(
        user_id_param,
        OBJECT_param,
        dateType,
        dateStart,
        dateEnd,
      );
    }
  }

  if (!createResult) {
    finalResult = null;
    statusResult = `fail`;
  } else {
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
  let statusResult: string = ``;

  // date 변수 선언
  const existingDateType: string = OBJECT_param.exercise_record_dateType;
  const existingDateStart: string = OBJECT_param.exercise_record_dateStart;
  const existingDateEnd: string = OBJECT_param.exercise_record_dateEnd;
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  findResult = await repository.detail(
    user_id_param,
    existingDateType,
    existingDateStart,
    existingDateEnd,
  );

  if (!findResult) {
    finalResult = null;
    statusResult = `fail`;
  } else {
    // update (기존항목 유지 + 타겟항목으로 수정)
    if (type_param === `update`) {
      updateResult = await repository.update.update(
        user_id_param,
        OBJECT_param,
        dateType,
        dateStart,
        dateEnd,
      );
      if (!updateResult) {
        finalResult = null;
        statusResult = `fail`;
      } else {
        finalResult = updateResult;
        statusResult = `success`;
      }
    }
    // insert (기존항목 제거 + 타겟항목에 추가)
    else if (type_param === `insert`) {
      deleteResult = await repository.deletes(
        user_id_param,
        existingDateType,
        existingDateStart,
        existingDateEnd,
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = `fail`;
      } else {
        updateResult = await repository.update.insert(
          user_id_param,
          OBJECT_param,
          dateType,
          dateStart,
          dateEnd,
        );
      }
      if (!updateResult) {
        finalResult = null;
        statusResult = `fail`;
      } else {
        finalResult = updateResult;
        statusResult = `success`;
      }
    }
    // replace (기존항목 제거 + 타겟항목을 교체)
    else if (type_param === `replace`) {
      deleteResult = await repository.deletes(
        user_id_param,
        existingDateType,
        existingDateStart,
        existingDateEnd,
      );
      if (!deleteResult) {
        finalResult = null;
        statusResult = `fail`;
      } else {
        updateResult = await repository.update.replace(
          user_id_param,
          OBJECT_param,
          dateType,
          dateStart,
          dateEnd,
        );
      }
      if (!updateResult) {
        finalResult = null;
        statusResult = `fail`;
      } else {
        finalResult = updateResult;
        statusResult = `success`;
      }
    }
    // 알 수 없는 type_param 은 명시적 fail 처리
    else {
      finalResult = null;
      statusResult = `fail`;
    }
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 5. delete ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const deletes = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let deleteResult: any = null;
  let finalResult: any = null;
  let statusResult: string = ``;

  // date 변수 선언
  const dateType: string = DATE_param?.dateType;
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  deleteResult = await repository.deletes(
    user_id_param,
    dateType,
    dateStart,
    dateEnd,
  );

  if (!deleteResult) {
    finalResult = null;
    statusResult = `fail`;
  } else {
    finalResult = deleteResult;
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
