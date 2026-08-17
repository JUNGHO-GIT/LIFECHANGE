/**
 * @file ExerciseRecordChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { timeToDecimal } from "@assets/scripts/utils";
import * as repository from "@repositories/exercise/ExerciseRecordChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ------------------------------------------------------------------------
export const bar = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param?.dateStart;
  const dateEnd: string = DATE_param?.dateEnd;

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.barGoal(user_id_param, dateStart, dateEnd),
      repository.barRecord(user_id_param, dateStart, dateEnd),
    ]);

    // findResult 배열을 순회하며 결과 저장
    finalResult = findResultGoal?.map((item: any) => ({
      name: String(`scale`),
      date: String(dateStart),
      goal: String(item.exercise_goal_scale ?? `0`),
      record: String(findResultRecord[0]?.exercise_record_total_scale ?? `0`),
    }));
    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 1-2. chart (bar - week) -------------------------------------------------------------------------
export const barWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.weekStartFmt;
  const dateEnd: string = DATE_param.weekEndFmt;
  const weekStartFmt: string = DATE_param.weekStartFmt;

  // ex. mon, tue
  const name: string[] = [`mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`];

  // ex. 00-00
  const date: string[] = Array.from({ length: 7 }, (_, i) => {
    return moment(weekStartFmt).clone().add(i, `days`).format(`MM-DD`);
  });

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.barGoal(user_id_param, dateStart, dateEnd),
      repository.barRecord(user_id_param, dateStart, dateEnd),
    ]);

    // name 배열 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay: string = moment(weekStartFmt)
        .clone()
        .add(index, `days`)
        .format(`YYYY-MM-DD`);

      const findIndexGoal: number = findResultGoal?.findIndex(
        (item: any) => item.exercise_goal_dateStart === targetDay,
      );

      const findIndexRecord: number = findResultRecord?.findIndex(
        (item: any) => item.exercise_record_dateStart === targetDay,
      );

      finalResult.push({
        name: String(data),
        date: String(date[index]),
        goal:
          findIndexGoal !== -1
            ? String(findResultGoal[findIndexGoal]?.exercise_goal_scale)
            : `0`,
        record:
          findIndexRecord !== -1
            ? String(
                findResultRecord[findIndexRecord]?.exercise_record_total_scale,
              )
            : `0`,
      });
    });
    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 1-3. chart (bar - month) ------------------------------------------------------------------------
export const barMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultGoal: any[] = [];
  let findResultRecord: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.monthStartFmt;
  const dateEnd: string = DATE_param.monthEndFmt;
  const monthStartFmt: string = DATE_param.monthStartFmt;
  const monthEndFmt: string = DATE_param.monthEndFmt;

  // ex. 00일
  const name: string[] = Array.from(
    { length: moment(monthEndFmt).date() },
    (_, i) => `${i + 1}`,
  );

  // ex. 00-00
  const date: string[] = Array.from(
    { length: moment(monthEndFmt).date() },
    (_, i) => moment(monthStartFmt).clone().add(i, `days`).format(`MM-DD`),
  );

  try {
    // promise 사용하여 병렬 처리
    [findResultGoal, findResultRecord] = await Promise.all([
      repository.barGoal(user_id_param, dateStart, dateEnd),
      repository.barRecord(user_id_param, dateStart, dateEnd),
    ]);

    // name 배열 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      const targetDay: string = moment(monthStartFmt)
        .clone()
        .add(index, `days`)
        .format(`YYYY-MM-DD`);

      const findIndexGoal: number = findResultGoal?.findIndex(
        (item: any) => item.exercise_goal_dateStart === targetDay,
      );

      const findIndexRecord: number = findResultRecord?.findIndex(
        (item: any) => item.exercise_record_dateStart === targetDay,
      );

      finalResult.push({
        name: String(data),
        date: String(date[index]),
        goal:
          findIndexGoal !== -1
            ? String(findResultGoal[findIndexGoal]?.exercise_goal_scale)
            : `0`,
        record:
          findIndexRecord !== -1
            ? String(
                findResultRecord[findIndexRecord]?.exercise_record_total_scale,
              )
            : `0`,
      });
    });
    statusResult = `success`;
  } catch {
    finalResult = [];
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-1. chart (pie - week) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.weekStartFmt;
  const dateEnd: string = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultPart, findResultTitle] = await Promise.all([
      repository.piePart(user_id_param, dateStart, dateEnd),
      repository.pieTitle(user_id_param, dateStart, dateEnd),
    ]);

    // findResultPart 배열을 순회하며 결과 저장
    finalResultPart = findResultPart?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // findResultTitle 배열을 순회하며 결과 저장
    finalResultTitle = findResultTitle?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultPart || finalResultPart.length === 0) {
      finalResultPart = [{ name: `Empty`, value: 100 }];
    }
    if (!finalResultTitle || finalResultTitle.length === 0) {
      finalResultTitle = [{ name: `Empty`, value: 100 }];
    }

    finalResult = {
      part: finalResultPart,
      title: finalResultTitle,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      part: [],
      title: [],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-2. chart (pie - month) ------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.monthStartFmt;
  const dateEnd: string = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultPart, findResultTitle] = await Promise.all([
      repository.piePart(user_id_param, dateStart, dateEnd),
      repository.pieTitle(user_id_param, dateStart, dateEnd),
    ]);

    // findResultPart 배열을 순회하며 결과 저장
    finalResultPart = findResultPart?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // findResultTitle 배열을 순회하며 결과 저장
    finalResultTitle = findResultTitle?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultPart || finalResultPart.length === 0) {
      finalResultPart = [{ name: `Empty`, value: 100 }];
    }
    if (!finalResultTitle || finalResultTitle.length === 0) {
      finalResultTitle = [{ name: `Empty`, value: 100 }];
    }

    finalResult = {
      part: finalResultPart,
      title: finalResultTitle,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      part: [],
      title: [],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-4. chart (pie - year) -------------------------------------------------------------------------
// pie 차트는 무조건 int 리턴
export const pieYear = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultPart: any[] = [];
  let findResultTitle: any[] = [];
  let finalResultPart: any[] = [];
  let finalResultTitle: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의
  const dateStart: string = DATE_param.yearStartFmt;
  const dateEnd: string = DATE_param.yearEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResultPart, findResultTitle] = await Promise.all([
      repository.piePart(user_id_param, dateStart, dateEnd),
      repository.pieTitle(user_id_param, dateStart, dateEnd),
    ]);

    // findResultPart 배열을 순회하며 결과 저장
    finalResultPart = findResultPart?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // findResultTitle 배열을 순회하며 결과 저장
    finalResultTitle = findResultTitle?.map((item: any) => ({
      name: String(item._id),
      value: Number(item.value) ?? 0,
    }));

    // 데이터가 없을 때 기본값 설정
    if (!finalResultPart || finalResultPart.length === 0) {
      finalResultPart = [{ name: `Empty`, value: 100 }];
    }
    if (!finalResultTitle || finalResultTitle.length === 0) {
      finalResultTitle = [{ name: `Empty`, value: 100 }];
    }

    finalResult = {
      part: finalResultPart,
      title: finalResultTitle,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      part: [{ name: `Empty`, value: 100 }],
      title: [{ name: `Empty`, value: 100 }],
    };
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 3-1. chart (line - week) ------------------------------------------------------------------------
export const lineWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultScale: any[] = [];
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultScale: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의 (현재 월의 전체 범위)
  const monthStartFmt: string = moment(DATE_param.weekStartFmt)
    .startOf(`month`)
    .format(`YYYY-MM-DD`);
  const monthEndFmt: string = moment(DATE_param.weekStartFmt)
    .endOf(`month`)
    .format(`YYYY-MM-DD`);
  const dateStart: string = monthStartFmt;
  const dateEnd: string = monthEndFmt;

  // ex. 1주 ~ 6주 (weekRanges가 최대 6개까지 생성되므로 6개 필요)
  const name: string[] = [`1주`, `2주`, `3주`, `4주`, `5주`, `6주`];

  // 해당 월의 1일이 포함된 주의 시작일 (월요일 기준)
  const firstWeekStart: moment.Moment =
    moment(monthStartFmt).startOf(`isoWeek`);

  // 주차별 날짜 범위 계산 (해당 월의 날짜가 포함된 주만)
  const weekRanges: { start: string; end: string; label: string }[] = [];
  let currentWeekStart: moment.Moment = moment(firstWeekStart);
  let weekIndex: number = 0;

  while (weekIndex < 6) {
    const weekEnd: moment.Moment = moment(currentWeekStart).add(6, `days`);
    const weekEndDate: string = weekEnd.format(`YYYY-MM-DD`);
    const weekStartDate: string = currentWeekStart.format(`YYYY-MM-DD`);

    // 해당 주에 현재 월의 날짜가 하나라도 포함되어 있는지 확인
    const hasMonthDate: boolean =
      weekStartDate <= monthEndFmt && weekEndDate >= monthStartFmt;

    hasMonthDate &&
      weekRanges.push({
        start: weekStartDate,
        end: weekEndDate,
        label: currentWeekStart.format(`MM-DD`),
      });

    currentWeekStart.add(7, `days`);
    weekIndex++;

    // 주의 시작일이 다음 달로 넘어가면 중단
    currentWeekStart.isAfter(moment(monthEndFmt).add(7, `days`)) &&
      (weekIndex = 6);
  }

  try {
    // promise 사용하여 병렬 처리
    [findResultScale, findResultVolume, findResultCardio] = await Promise.all([
      repository.lineScale(user_id_param, dateStart, dateEnd),
      repository.lineVolume(user_id_param, dateStart, dateEnd),
      repository.lineCardio(user_id_param, dateStart, dateEnd),
    ]);

    // 주차별 총합 계산
    weekRanges.forEach((range: any, index: number) => {
      let weekScaleSum: number = 0;
      let weekVolumeSum: number = 0;
      let weekCardioSum: number = 0;

      findResultScale?.forEach((item: any) => {
        const itemDate: string = item.exercise_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          (weekScaleSum += Number(item.exercise_record_total_scale ?? 0));
      });

      findResultVolume?.forEach((item: any) => {
        const itemDate: string = item.exercise_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          (weekVolumeSum += Number(item.exercise_record_total_volume ?? 0));
      });

      findResultCardio?.forEach((item: any) => {
        const itemDate: string = item.exercise_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          (weekCardioSum += timeToDecimal(
            item.exercise_record_total_cardio ?? `00:00`,
          ));
      });

      finalResultScale.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        scale: String(weekScaleSum),
      });
      finalResultVolume.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        volume: String(weekVolumeSum),
      });
      finalResultCardio.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        cardio: String(weekCardioSum),
      });
    });

    finalResult = {
      scale: finalResultScale,
      volume: finalResultVolume,
      cardio: finalResultCardio,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      scale: [],
      volume: [],
      cardio: [],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 3-2. chart (line - month) -----------------------------------------------------------------------
export const lineMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultScale: any[] = [];
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultScale: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // date 변수 정의 (현재 연도 전체 범위)
  const yearStartFmt: string = moment(DATE_param.monthStartFmt)
    .startOf(`year`)
    .format(`YYYY-MM-DD`);
  const yearEndFmt: string = moment(DATE_param.monthStartFmt)
    .endOf(`year`)
    .format(`YYYY-MM-DD`);
  const dateStart: string = yearStartFmt;
  const dateEnd: string = yearEndFmt;

  // ex. 1월, 2월, ..., 12월
  const name: string[] = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

  // 월별 날짜 범위 계산
  const monthRanges: { start: string; end: string; label: string }[] =
    Array.from({ length: 12 }, (_v, i: number) => {
      const monthStart: moment.Moment = moment(yearStartFmt)
        .add(i, `months`)
        .startOf(`month`);
      const monthEnd: moment.Moment = moment(monthStart).endOf(`month`);
      return {
        start: monthStart.format(`YYYY-MM-DD`),
        end: monthEnd.format(`YYYY-MM-DD`),
        label: monthStart.format(`MM`),
      };
    });

  try {
    // promise 사용하여 병렬 처리
    [findResultScale, findResultVolume, findResultCardio] = await Promise.all([
      repository.lineScale(user_id_param, dateStart, dateEnd),
      repository.lineVolume(user_id_param, dateStart, dateEnd),
      repository.lineCardio(user_id_param, dateStart, dateEnd),
    ]);

    // 월별 총합 계산
    monthRanges.forEach((range: any, index: number) => {
      let monthScaleSum: number = 0;
      let monthVolumeSum: number = 0;
      let monthCardioSum: number = 0;

      findResultScale?.forEach((item: any) => {
        const itemDate: string = item.exercise_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          (monthScaleSum += Number(item.exercise_record_total_scale ?? 0));
      });

      findResultVolume?.forEach((item: any) => {
        const itemDate: string = item.exercise_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          (monthVolumeSum += Number(item.exercise_record_total_volume ?? 0));
      });

      findResultCardio?.forEach((item: any) => {
        const itemDate: string = item.exercise_record_dateStart;
        itemDate >= range.start &&
          itemDate <= range.end &&
          (monthCardioSum += timeToDecimal(
            item.exercise_record_total_cardio ?? `00:00`,
          ));
      });

      finalResultScale.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        scale: String(monthScaleSum),
      });
      finalResultVolume.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        volume: String(monthVolumeSum),
      });
      finalResultCardio.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        cardio: String(monthCardioSum),
      });
    });

    finalResult = {
      scale: finalResultScale,
      volume: finalResultVolume,
      cardio: finalResultCardio,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      scale: [],
      volume: [],
      cardio: [],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4-1. chart (avg - week) -------------------------------------------------------------------------
export const avgWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumVolume: number[] = new Array<number>(5).fill(0);
  let sumCardio: number[] = new Array<number>(5).fill(0);
  let countRecordsVolume: number[] = new Array<number>(5).fill(0);
  let countRecordsCardio: number[] = new Array<number>(5).fill(0);

  // date 변수 정의
  const monthStartFmt: string = DATE_param.monthStartFmt;

  // weekStartDate 정의
  const weekStartDate: moment.Moment[] = Array.from({ length: 5 }, (_, i) =>
    moment(monthStartFmt).startOf(`month`).add(i, `weeks`),
  );

  // ex. 00주차
  const name: string[] = Array.from({ length: 5 }, (_, i) => `week${i + 1}`);

  // ex. 00-00 - 00-00
  const date: string[] = Array.from({ length: 5 }, (_, i) => {
    const startOfWeek: string = weekStartDate[i]
      .clone()
      .startOf(`isoWeek`)
      .format(`MM-DD`);
    const endOfWeek: string = weekStartDate[i]
      .clone()
      .endOf(`isoWeek`)
      .format(`MM-DD`);
    return `${startOfWeek} - ${endOfWeek}`;
  });

  // 주차별 YYYY-MM-DD 범위 (per-bucket aggregate 와 동일 매칭)
  const weekDateStart: string[] = Array.from({ length: 5 }, (_v, i: number) =>
    weekStartDate[i].clone().startOf(`isoWeek`).format(`YYYY-MM-DD`),
  );
  const weekDateEnd: string[] = Array.from({ length: 5 }, (_v, i: number) =>
    weekStartDate[i].clone().endOf(`isoWeek`).format(`YYYY-MM-DD`),
  );

  // 전체 범위 (첫 주 시작 ~ 마지막 주 끝)
  const rangeStart: string = weekDateStart[0];
  const rangeEnd: string = weekDateEnd[4];

  try {
    // 전체 범위를 한 번만 조회 후 메모리에서 주차별 버킷 합산 (N쿼리 -> 2쿼리)
    [findResultVolume, findResultCardio] = await Promise.all([
      repository.avgVolume(user_id_param, rangeStart, rangeEnd),
      repository.avgCardio(user_id_param, rangeStart, rangeEnd),
    ]);

    // sum, count 설정
    weekDateStart.forEach((_v: string, index: number) => {
      findResultVolume.forEach((item: any) => {
        if (
          item.exercise_record_dateStart >= weekDateStart[index] &&
          item.exercise_record_dateStart <= weekDateEnd[index] &&
          item.exercise_record_dateEnd >= weekDateStart[index] &&
          item.exercise_record_dateEnd <= weekDateEnd[index]
        ) {
          sumVolume[index] += Number(item.exercise_record_total_volume ?? `0`);
          countRecordsVolume[index]++;
        }
      });
      findResultCardio.forEach((item: any) => {
        if (
          item.exercise_record_dateStart >= weekDateStart[index] &&
          item.exercise_record_dateStart <= weekDateEnd[index] &&
          item.exercise_record_dateEnd >= weekDateStart[index] &&
          item.exercise_record_dateEnd <= weekDateEnd[index]
        ) {
          sumCardio[index] += Number(
            timeToDecimal(item.exercise_record_total_cardio) ?? `0`,
          );
          countRecordsCardio[index]++;
        }
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResultVolume.push({
        name: String(data),
        date: String(date[index]),
        volume:
          countRecordsVolume[index] > 0
            ? String((sumVolume[index] / countRecordsVolume[index]).toFixed(1))
            : `0`,
      });
      finalResultCardio.push({
        name: String(data),
        date: String(date[index]),
        cardio:
          countRecordsCardio[index] > 0
            ? String(sumCardio[index] / countRecordsCardio[index])
            : `0`,
      });
    });

    finalResult = {
      volume: finalResultVolume,
      cardio: finalResultCardio,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      volume: [],
      cardio: [],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 4-2. chart (avg - month) ---------------------------------------------------------------------
export const avgMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResultVolume: any[] = [];
  let findResultCardio: any[] = [];
  let finalResultVolume: any[] = [];
  let finalResultCardio: any[] = [];
  let finalResult: any = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumVolume: number[] = new Array<number>(12).fill(0);
  let sumCardio: number[] = new Array<number>(12).fill(0);
  let countRecordsVolume: number[] = new Array<number>(12).fill(0);
  let countRecordsCardio: number[] = new Array<number>(12).fill(0);

  // date 변수 정의
  const yearStartFmt: string = DATE_param.yearStartFmt;

  // monthStartDate 정의
  const monthStartDate: moment.Moment[] = Array.from({ length: 12 }, (_, i) =>
    moment(yearStartFmt).startOf(`year`).add(i, `months`),
  );

  // ex. 00 월
  const name: string[] = Array.from({ length: 12 }, (_, i) => `month${i + 1}`);

  // ex. 00-00 - 00-00
  const date: string[] = Array.from({ length: 12 }, (_, i) => {
    const startOfMonth: string = moment(yearStartFmt)
      .add(i, `months`)
      .startOf(`month`)
      .format(`MM-DD`);
    const endOfMonth: string = moment(yearStartFmt)
      .add(i, `months`)
      .endOf(`month`)
      .format(`MM-DD`);
    return `${startOfMonth} - ${endOfMonth}`;
  });

  // 월별 YYYY-MM-DD 범위 (per-bucket aggregate 와 동일 매칭)
  const monthDateStart: string[] = Array.from({ length: 12 }, (_v, i: number) =>
    monthStartDate[i].clone().startOf(`month`).format(`YYYY-MM-DD`),
  );
  const monthDateEnd: string[] = Array.from({ length: 12 }, (_v, i: number) =>
    monthStartDate[i].clone().endOf(`month`).format(`YYYY-MM-DD`),
  );

  // 전체 범위 (첫 달 시작 ~ 마지막 달 끝)
  const rangeStart: string = monthDateStart[0];
  const rangeEnd: string = monthDateEnd[11];

  try {
    // 전체 범위를 한 번만 조회 후 메모리에서 월별 버킷 합산 (N쿼리 -> 2쿼리)
    [findResultVolume, findResultCardio] = await Promise.all([
      repository.avgVolume(user_id_param, rangeStart, rangeEnd),
      repository.avgCardio(user_id_param, rangeStart, rangeEnd),
    ]);

    // sum, count 설정
    monthDateStart.forEach((_v: string, index: number) => {
      findResultVolume.forEach((item: any) => {
        if (
          item.exercise_record_dateStart >= monthDateStart[index] &&
          item.exercise_record_dateStart <= monthDateEnd[index] &&
          item.exercise_record_dateEnd >= monthDateStart[index] &&
          item.exercise_record_dateEnd <= monthDateEnd[index]
        ) {
          sumVolume[index] += Number(item.exercise_record_total_volume ?? `0`);
          countRecordsVolume[index]++;
        }
      });
      findResultCardio.forEach((item: any) => {
        if (
          item.exercise_record_dateStart >= monthDateStart[index] &&
          item.exercise_record_dateStart <= monthDateEnd[index] &&
          item.exercise_record_dateEnd >= monthDateStart[index] &&
          item.exercise_record_dateEnd <= monthDateEnd[index]
        ) {
          sumCardio[index] += Number(
            timeToDecimal(item.exercise_record_total_cardio) ?? `0`,
          );
          countRecordsCardio[index]++;
        }
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResultVolume.push({
        name: String(data),
        date: String(date[index]),
        volume:
          countRecordsVolume[index] > 0
            ? String((sumVolume[index] / countRecordsVolume[index]).toFixed(1))
            : `0`,
      });
      finalResultCardio.push({
        name: String(data),
        date: String(date[index]),
        cardio:
          countRecordsCardio[index] > 0
            ? String(sumCardio[index] / countRecordsCardio[index])
            : `0`,
      });
    });

    finalResult = {
      volume: finalResultVolume,
      cardio: finalResultCardio,
    };
    statusResult = `success`;
  } catch {
    finalResult = {
      volume: [],
      cardio: [],
    };
    statusResult = `fail`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};
