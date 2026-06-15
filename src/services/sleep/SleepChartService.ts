/**
 * @file SleepChartService.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { timeToDecimal } from "@assets/scripts/utils";
import * as repository from "@repositories/sleep/SleepChartRepository";
import moment from "moment-timezone";

// 1-1. chart (bar - today) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
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

    // helper to sum values across sections for a given key
    const sumSections = (sections: any[], key: string) =>
      (sections ?? []).reduce(
        (acc: number, sec: any) =>
          acc + Number(timeToDecimal(sec?.[key] ?? `00:00`)),
        0,
      );

    // findResult 배열을 순회하며 결과 저장
    finalResult = findResultGoal?.flatMap((item: any) => {
      // try to find matching record for the goal's date
      const matchedRecord: any =
        (findResultRecord ?? []).find(
          (r: any) => r?.sleep_record_dateStart === item?.sleep_goal_dateStart,
        ) ?? null;
      const sections: any[] = matchedRecord?.sleep_section ?? [];
      return [
        {
          name: String(`bedTime`),
          date: String(item?.sleep_goal_dateStart ?? dateStart),
          goal: String(timeToDecimal(item?.sleep_goal_bedTime) ?? `0`),
          record: String(sumSections(sections, `sleep_record_bedTime`) ?? `0`),
        },
        {
          name: String(`wakeTime`),
          date: String(item?.sleep_goal_dateStart ?? dateStart),
          goal: String(timeToDecimal(item?.sleep_goal_wakeTime) ?? `0`),
          record: String(sumSections(sections, `sleep_record_wakeTime`) ?? `0`),
        },
        {
          name: String(`sleepTime`),
          date: String(item?.sleep_goal_dateStart ?? dateStart),
          goal: String(timeToDecimal(item?.sleep_goal_sleepTime) ?? `0`),
          record: String(
            sumSections(sections, `sleep_record_sleepTime`) ?? `0`,
          ),
        },
      ];
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

// 2-2. chart (pie - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// pie 차트는 무조건 int 리턴
export const pieWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumBedTime: number = 0;
  let sumWakeTime: number = 0;
  let sumSleepTime: number = 0;
  let countRecords: number = 0;
  let totalSleep: number = 0;

  // date 변수 정의
  const dateStart: string = DATE_param.weekStartFmt;
  const dateEnd: string = DATE_param.weekEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.pieAll(user_id_param, dateStart, dateEnd),
    ]);

    // sum, count 설정 — 모든 섹션을 합산
    findResult.forEach((data: any, index: number) => {
      const sections: any[] = data?.sleep_section ?? [];
      sections.forEach((sec: any) => {
        sumBedTime += Number(
          timeToDecimal(sec?.sleep_record_bedTime ?? `00:00`),
        );
        sumWakeTime += Number(
          timeToDecimal(sec?.sleep_record_wakeTime ?? `00:00`),
        );
        sumSleepTime += Number(
          timeToDecimal(sec?.sleep_record_sleepTime ?? `00:00`),
        );
        countRecords++;
      });
    });

    // totalSleep 계산
    totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

    // finalResult 배열에 결과 저장
    finalResult = [
      {
        name: String(`bedTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumBedTime / totalSleep) * 100) : 0,
        ),
      },
      {
        name: String(`wakeTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumWakeTime / totalSleep) * 100) : 0,
        ),
      },
      {
        name: String(`sleepTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumSleepTime / totalSleep) * 100) : 0,
        ),
      },
    ];

    // 데이터가 없을 때 기본값 설정
    const hasData = finalResult.some((item: any) => item.value > 0);
    if (!hasData || !finalResult || finalResult.length === 0) {
      finalResult = [{ name: `Empty`, value: 100 }];
    }

    statusResult = `success`;
  } catch {
    finalResult = [{ name: `Empty`, value: 100 }];
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-3. chart (pie - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
// pie 차트는 무조건 int 리턴
export const pieMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumBedTime: number = 0;
  let sumWakeTime: number = 0;
  let sumSleepTime: number = 0;
  let countRecords: number = 0;
  let totalSleep: number = 0;

  // date 변수 정의
  const dateStart: string = DATE_param.monthStartFmt;
  const dateEnd: string = DATE_param.monthEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.pieAll(user_id_param, dateStart, dateEnd),
    ]);

    // sum, count 설정 — 모든 섹션을 합산
    findResult.forEach((data: any, _index: number) => {
      const sections: any[] = data?.sleep_section ?? [];
      sections.forEach((sec: any) => {
        sumBedTime += Number(
          timeToDecimal(sec?.sleep_record_bedTime ?? `00:00`),
        );
        sumWakeTime += Number(
          timeToDecimal(sec?.sleep_record_wakeTime ?? `00:00`),
        );
        sumSleepTime += Number(
          timeToDecimal(sec?.sleep_record_sleepTime ?? `00:00`),
        );
        countRecords++;
      });
    });

    // totalSleep 계산
    totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

    // finalResult 배열에 결과 저장
    finalResult = [
      {
        name: String(`bedTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumBedTime / totalSleep) * 100) : 0,
        ),
      },
      {
        name: String(`wakeTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumWakeTime / totalSleep) * 100) : 0,
        ),
      },
      {
        name: String(`sleepTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumSleepTime / totalSleep) * 100) : 0,
        ),
      },
    ];

    // 데이터가 없을 때 기본값 설정
    const hasData = finalResult.some((item: any) => item.value > 0);
    if (!hasData || !finalResult || finalResult.length === 0) {
      finalResult = [{ name: `Empty`, value: 100 }];
    }

    statusResult = `success`;
  } catch {
    finalResult = [{ name: `Empty`, value: 100 }];
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 2-4. chart (pie - year) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
// pie 차트는 무조건 int 리턴
export const pieYear = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumBedTime: number = 0;
  let sumWakeTime: number = 0;
  let sumSleepTime: number = 0;
  let countRecords: number = 0;
  let totalSleep: number = 0;

  // date 변수 정의
  const dateStart: string = DATE_param.yearStartFmt;
  const dateEnd: string = DATE_param.yearEndFmt;

  try {
    // promise 사용하여 병렬 처리
    [findResult] = await Promise.all([
      repository.pieAll(user_id_param, dateStart, dateEnd),
    ]);

    // sum, count 설정 — 모든 섹션을 합산
    findResult.forEach((data: any, _index: number) => {
      const sections: any[] = data?.sleep_section ?? [];
      sections.forEach((sec: any) => {
        sumBedTime += Number(
          timeToDecimal(sec?.sleep_record_bedTime ?? `00:00`),
        );
        sumWakeTime += Number(
          timeToDecimal(sec?.sleep_record_wakeTime ?? `00:00`),
        );
        sumSleepTime += Number(
          timeToDecimal(sec?.sleep_record_sleepTime ?? `00:00`),
        );
        countRecords++;
      });
    });

    // totalSleep 계산
    totalSleep = sumBedTime + sumWakeTime + sumSleepTime;

    // finalResult 배열에 결과 저장
    finalResult = [
      {
        name: String(`bedTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumBedTime / totalSleep) * 100) : 0,
        ),
      },
      {
        name: String(`wakeTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumWakeTime / totalSleep) * 100) : 0,
        ),
      },
      {
        name: String(`sleepTime`),
        value: Number(
          totalSleep > 0 ? Math.round((sumSleepTime / totalSleep) * 100) : 0,
        ),
      },
    ];

    // 데이터가 없을 때 기본값 설정
    const hasData = finalResult.some((item: any) => item.value > 0);
    if (!hasData || !finalResult || finalResult.length === 0) {
      finalResult = [{ name: `Empty`, value: 100 }];
    }

    statusResult = `success`;
  } catch {
    finalResult = [{ name: `Empty`, value: 100 }];
    statusResult = `success`;
  }

  return {
    status: statusResult,
    result: finalResult,
  };
};

// 3-1. chart (line - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const lineWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
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

  // ex. 1주, 2주, 3주, 4주, 5주
  const name: string[] = [`1주`, `2주`, `3주`, `4주`, `5주`];

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
    [findResult] = await Promise.all([
      repository.lineAll(user_id_param, dateStart, dateEnd),
    ]);

    // 주차별 총합 계산
    weekRanges.forEach((range: any, index: number) => {
      let weekBedTimeSum: number = 0;
      let weekWakeTimeSum: number = 0;
      let weekSleepTimeSum: number = 0;

      findResult?.forEach((item: any) => {
        const itemDate: string = item.sleep_record_dateStart;
        if (itemDate >= range.start && itemDate <= range.end) {
          const sections: any[] = item?.sleep_section ?? [];
          sections.forEach((sec: any) => {
            weekBedTimeSum += timeToDecimal(
              sec?.sleep_record_bedTime ?? `00:00`,
            );
            weekWakeTimeSum += timeToDecimal(
              sec?.sleep_record_wakeTime ?? `00:00`,
            );
            weekSleepTimeSum += timeToDecimal(
              sec?.sleep_record_sleepTime ?? `00:00`,
            );
          });
        }
      });

      finalResult.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        bedTime: String(weekBedTimeSum.toFixed(1)),
        wakeTime: String(weekWakeTimeSum.toFixed(1)),
        sleepTime: String(weekSleepTimeSum.toFixed(1)),
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

// 3-2. chart (line - month) ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const lineMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
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
    [findResult] = await Promise.all([
      repository.lineAll(user_id_param, dateStart, dateEnd),
    ]);

    // 월별 총합 계산
    monthRanges.forEach((range: any, index: number) => {
      let monthBedTimeSum: number = 0;
      let monthWakeTimeSum: number = 0;
      let monthSleepTimeSum: number = 0;

      findResult?.forEach((item: any) => {
        const itemDate: string = item.sleep_record_dateStart;
        if (itemDate >= range.start && itemDate <= range.end) {
          const sections: any[] = item?.sleep_section ?? [];
          sections.forEach((sec: any) => {
            monthBedTimeSum += timeToDecimal(
              sec?.sleep_record_bedTime ?? `00:00`,
            );
            monthWakeTimeSum += timeToDecimal(
              sec?.sleep_record_wakeTime ?? `00:00`,
            );
            monthSleepTimeSum += timeToDecimal(
              sec?.sleep_record_sleepTime ?? `00:00`,
            );
          });
        }
      });

      finalResult.push({
        name: String(name[index]),
        date: String(`${range.start} - ${range.end}`),
        bedTime: String(monthBedTimeSum.toFixed(1)),
        wakeTime: String(monthWakeTimeSum.toFixed(1)),
        sleepTime: String(monthSleepTimeSum.toFixed(1)),
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

// 4-1. chart (avg - week) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const avgWeek = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumBedTime: number[] = new Array<number>(5).fill(0);
  let sumWakeTime: number[] = new Array<number>(5).fill(0);
  let sumSleepTime: number[] = new Array<number>(5).fill(0);
  let countRecords: number[] = new Array<number>(5).fill(0);

  // date 변수 정의
  const monthStartFmt: string = DATE_param.monthStartFmt;

  // weekStartDate 정의
  const weekStartDate: moment.Moment[] = Array.from(
    { length: 5 },
    (_v, i: number) => moment(monthStartFmt).startOf(`month`).add(i, `weeks`),
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

  // 주차별 [start, end] 범위(avgAll 동일 isoWeek 경계)
  const weekRange: { start: string; end: string }[] = weekStartDate.map(
    (startDate: moment.Moment) => ({
      start: startDate.clone().startOf(`isoWeek`).format(`YYYY-MM-DD`),
      end: startDate.clone().endOf(`isoWeek`).format(`YYYY-MM-DD`),
    }),
  );

  try {
    // 반복 aggregate 통합: 전체 주 범위를 1회만 조회 후 메모리 버킷팅
    [findResult] = await Promise.all([
      repository.avgAll(
        user_id_param,
        weekRange[0].start,
        weekRange[weekRange.length - 1].end,
      ),
    ]);

    // sum, count 설정 (avgAll 매칭 술어: dateStart/dateEnd 모두 구간 내)
    weekRange.forEach((range: any, index: number) => {
      findResult.forEach((item: any) => {
        if (
          item?.sleep_record_dateStart >= range.start &&
          item?.sleep_record_dateStart <= range.end &&
          item?.sleep_record_dateEnd >= range.start &&
          item?.sleep_record_dateEnd <= range.end
        ) {
          const sections: any[] = item?.sleep_section ?? [];
          sections.forEach((sec: any) => {
            sumBedTime[index] += Number(
              timeToDecimal(sec?.sleep_record_bedTime ?? `00:00`) ?? `0`,
            );
            sumWakeTime[index] += Number(
              timeToDecimal(sec?.sleep_record_wakeTime ?? `00:00`) ?? `0`,
            );
            sumSleepTime[index] += Number(
              timeToDecimal(sec?.sleep_record_sleepTime ?? `00:00`) ?? `0`,
            );
            countRecords[index]++;
          });
        }
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResult.push({
        name: String(data),
        date: String(date[index]),
        bedTime:
          countRecords[index] > 0
            ? String((sumBedTime[index] / countRecords[index]).toFixed(1))
            : `0`,
        wakeTime:
          countRecords[index] > 0
            ? String((sumWakeTime[index] / countRecords[index]).toFixed(1))
            : `0`,
        sleepTime:
          countRecords[index] > 0
            ? String((sumSleepTime[index] / countRecords[index]).toFixed(1))
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

// 4-2. chart (avg - month) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const avgMonth = async (user_id_param: string, DATE_param: any) => {
  // result 변수 선언
  let findResult: any[] = [];
  let finalResult: any[] = [];
  let statusResult: string = ``;

  // sum, count 변수 선언
  let sumBedTime: number[] = new Array<number>(12).fill(0);
  let sumWakeTime: number[] = new Array<number>(12).fill(0);
  let sumSleepTime: number[] = new Array<number>(12).fill(0);
  let countRecords: number[] = new Array<number>(12).fill(0);

  // date 변수 정의
  const yearStartFmt: string = DATE_param.yearStartFmt;

  // monthStartDate 정의
  const monthStartDate: moment.Moment[] = Array.from(
    { length: 12 },
    (_v, i: number) => moment(yearStartFmt).startOf(`year`).add(i, `months`),
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

  // 월별 [start, end] 범위(avgAll 동일 month 경계)
  const monthRange: { start: string; end: string }[] = monthStartDate.map(
    (startDate: moment.Moment) => ({
      start: startDate.clone().startOf(`month`).format(`YYYY-MM-DD`),
      end: startDate.clone().endOf(`month`).format(`YYYY-MM-DD`),
    }),
  );

  try {
    // 반복 aggregate 통합: 전체 월 범위를 1회만 조회 후 메모리 버킷팅
    [findResult] = await Promise.all([
      repository.avgAll(
        user_id_param,
        monthRange[0].start,
        monthRange[monthRange.length - 1].end,
      ),
    ]);

    // sum, count 설정 (avgAll 매칭 술어: dateStart/dateEnd 모두 구간 내)
    monthRange.forEach((range: any, index: number) => {
      findResult.forEach((item: any) => {
        if (
          item?.sleep_record_dateStart >= range.start &&
          item?.sleep_record_dateStart <= range.end &&
          item?.sleep_record_dateEnd >= range.start &&
          item?.sleep_record_dateEnd <= range.end
        ) {
          const sections: any[] = item?.sleep_section ?? [];
          sections.forEach((sec: any) => {
            sumBedTime[index] += Number(
              timeToDecimal(sec?.sleep_record_bedTime ?? `00:00`) ?? `0`,
            );
            sumWakeTime[index] += Number(
              timeToDecimal(sec?.sleep_record_wakeTime ?? `00:00`) ?? `0`,
            );
            sumSleepTime[index] += Number(
              timeToDecimal(sec?.sleep_record_sleepTime ?? `00:00`) ?? `0`,
            );
            countRecords[index]++;
          });
        }
      });
    });

    // name 배열을 순회하며 결과 저장
    name.forEach((data: any, index: number) => {
      finalResult.push({
        name: String(data),
        date: String(date[index]),
        bedTime:
          countRecords[index] > 0
            ? String((sumBedTime[index] / countRecords[index]).toFixed(1))
            : `0`,
        wakeTime:
          countRecords[index] > 0
            ? String((sumWakeTime[index] / countRecords[index]).toFixed(1))
            : `0`,
        sleepTime:
          countRecords[index] > 0
            ? String((sumSleepTime[index] / countRecords[index]).toFixed(1))
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
