/**
 * @file SleepRecordMiddleware.ts
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

// 1. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const list = async (object: any) => {

  // 0. calcOverTenMillion ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const calcOverTenMillion = (param: string) => {

    let finalResult: string = ``;

    if (!param || param === `0` || param === `00:00` || String(param).includes(`:`)) {
      finalResult = param;
    }
    // 12300000 -> 1.23M / 10000000 -> 10M
    else if (Number(param) >= 10_000_000) {
      finalResult = `${(Number.parseFloat((Number(param) / 1_000_000).toFixed(2)).toString())}M`;
    }
    else {
      finalResult = Number.parseFloat(Number(param).toFixed(2)).toString();
    }

    return finalResult;
  };

  // 0. calcNonValueColor ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const calcNonValueColor = (param: string) => {

    let finalResult: string = ``;

    if (!param) {
      finalResult = param;
    }
    else if (param === `0` || param === `00:00`) {
      finalResult = `grey`;
    }
    else {
      finalResult = `light-black`;
    }

    return finalResult;
  };

  // 1. calcDiffTimeColor ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const calcDiffTimeColor = (goalParam: string, recordParam: string, extra: string) => {

    const goalHours: number = Number.parseFloat(goalParam?.split(`:`)[0] ?? `0`);
    const goalMinutes: number = Number.parseFloat(goalParam?.split(`:`)[1] ?? `0`);
    const recordHours: number = Number.parseFloat(recordParam?.split(`:`)[0] ?? `0`);
    const recordMinutes: number = Number.parseFloat(recordParam?.split(`:`)[1] ?? `0`);
    const goal: number = (goalHours * 60) + goalMinutes;
    const record: number = (recordHours * 60) + recordMinutes;
    let diffVal: number = Math.abs(goal - record);
    let finalResult: string = ``;

    if (!goal || !record) {
      return calcNonValueColor(recordParam);
    }

    if (extra === `sleepTime`) {
      diffVal = goal - record;
    }

    if (diffVal <= 10) {
      finalResult += ` firstScore`;
    }
    else if (diffVal <= 20) {
      finalResult += ` secondScore`;
    }
    else if (diffVal <= 40) {
      finalResult += ` thirdScore`;
    }
    else if (diffVal <= 60) {
      finalResult += ` fourthScore`;
    }
    else {
      finalResult += ` fifthScore`;
    }

    return finalResult;
  };

  // 2. calcScoreSmileImage ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const calcScoreSmileImage = (colors: string[]) => {

    const scoreMap: Record<string, number> = {
      firstScore: 5,
      secondScore: 4,
      thirdScore: 3,
      fourthScore: 2,
      fifthScore: 1,
    };
    const scores: number[] = colors.reduce((acc: number[], color: string) => {
      const scoreKey: string | undefined = Object.keys(scoreMap).find((key: string) => (
        color?.includes(key)
      ));

      if (scoreKey) {
        acc.push(scoreMap[scoreKey]);
      }

      return acc;
    }, []);

    if (scores.length <= 0) {
      return `smile3`;
    }

    const avgScore: number = scores.reduce((acc: number, score: number) => acc + score, 0) / scores.length;

    if (avgScore >= 0 && avgScore <= 1) {
      return `smile1`;
    }
    else if (avgScore > 1 && avgScore <= 2) {
      return `smile2`;
    }
    else if (avgScore > 2 && avgScore <= 3) {
      return `smile3`;
    }
    else if (avgScore > 3 && avgScore <= 4) {
      return `smile4`;
    }
    else if (avgScore > 4 && avgScore <= 5) {
      return `smile5`;
    }
    else {
      return `smile3`;
    }
  };

  // 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  object?.result?.forEach((item: any) => {
    const sleepRecordBedTime: string = item?.sleep_record_bedTime;
    const sleepRecordWakeTime: string = item?.sleep_record_wakeTime;
    const sleepRecordSleepTime: string = item?.sleep_record_sleepTime;

    item.sleep_record_bedTime = calcOverTenMillion(
      item?.sleep_record_bedTime
    );
    item.sleep_record_wakeTime = calcOverTenMillion(
      item?.sleep_record_wakeTime
    );
    item.sleep_record_sleepTime = calcOverTenMillion(
      item?.sleep_record_sleepTime
    );

    item.sleep_record_bedTime_color = calcDiffTimeColor(
      item?.sleep_goal_bedTime, sleepRecordBedTime, `bedTime`
    );
    item.sleep_record_wakeTime_color = calcDiffTimeColor(
      item?.sleep_goal_wakeTime, sleepRecordWakeTime, `wakeTime`
    );
    item.sleep_record_sleepTime_color = calcDiffTimeColor(
      item?.sleep_goal_sleepTime, sleepRecordSleepTime, `sleepTime`
    );
    item.sleep_record_score_smile = calcScoreSmileImage([
      item.sleep_record_bedTime_color,
      item.sleep_record_wakeTime_color,
      item.sleep_record_sleepTime_color,
    ]);

    item.sleep_section?.forEach((section: any) => {
      section.sleep_record_bedTime = calcOverTenMillion(
        section?.sleep_record_bedTime
      );
      section.sleep_record_wakeTime = calcOverTenMillion(
        section?.sleep_record_wakeTime
      );
      section.sleep_record_sleepTime = calcOverTenMillion(
        section?.sleep_record_sleepTime
      );

      section.sleep_record_bedTime_color = calcNonValueColor(
        section?.sleep_record_bedTime
      );
      section.sleep_record_wakeTime_color = calcNonValueColor(
        section?.sleep_record_wakeTime
      );
      section.sleep_record_sleepTime_color = calcNonValueColor(
        section?.sleep_record_sleepTime
      );
    });
  });

  return object;
};
