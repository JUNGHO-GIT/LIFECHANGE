/**
 * @file SleepGoalList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { SleepGoal, SleepGoalType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer } from "@exportLibs";
import { formatDateMmDd, formatDateYyyyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
type SleepGoalKey = `bedTime` | `wakeTime` | `sleepTime`;

declare interface SleepGoalSource {
  key: SleepGoalKey;
  actual: number;
  goal: number;
  color: string;
}

declare interface SleepGoalRow extends SleepGoalSource {
  actualText: string;
  goalText: string;
  diffText: string;
  percent: number;
  percentText: string;
  barPercent: number;
}

// -------------------------------------------------------------------------------------------------
export const SleepGoalList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toDetail, navigate } = useCommonValue();
  const { location_dateType, location_dateStart, location_dateEnd, chartThemeColors } = useCommonValue();
  const { getDayFmt, getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal ------------------------------------------------------------------------
  const [ DATE, setDATE ] = useStorageLocal(
    `date`, PATH, ``, {
      dateType: location_dateType ?? ``,
      dateStart: location_dateStart ?? getDayFmt(),
      dateEnd: location_dateEnd ?? getDayFmt(),
    }
  );
  const [ PAGING, setPAGING ] = useStorageLocal(
    `paging`, PATH, ``, {
      sort: `asc`,
      page: 1,
    }
  );
  const [ isExpanded, setIsExpanded ] = useStorageLocal(
    `isExpanded`, PATH, ``, [
      {
        expanded: true,
      },
    ]
  );

  // 2-2. useState -------------------------------------------------------------------------------
  const [ OBJECT, setOBJECT ] = useState<[SleepGoalType]>([SleepGoal]);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ SEND, setSEND ] = useState({
    id: ``,
    dateType: `day`,
    dateStart: `0000-00-00`,
    dateEnd: `0000-00-00`,
  });
  const [ COUNT, setCOUNT ] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0,
  });

  // 2-2. useDeferredValue ----------------------------------------------------------------------
  // - 항목 렌더를 비긴급으로 분리
  // - 전환·데이터 반영 시 화면 틀이 먼저 그려지고 항목은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);

  // 3. summary ----------------------------------------------------------------------------------
  // - 선택 기간의 수면 목표와 기록 달성 현황 계산
  const goalSummary = useMemo(() => {
    const toMinutes = (value?: string | number | null): number => {
      const [ hours = `0`, minutes = `0` ] = String(value ?? `00:00`).split(`:`);
      const result = (Number(hours) * 60) + Number(minutes);

      return Number.isFinite(result) ? result : 0;
    };
    const toValidMinutes = (value?: string | number | null): number | null => {
      const rawValue: string = String(value ?? ``);
      if (!/^\d{1,2}:\d{2}$/.test(rawValue)) {
        return null;
      }
      return toMinutes(rawValue);
    };
    const formatTime = (value: number): string => {
      const roundedValue = Math.max(0, Math.round(value));
      const hours = Math.floor(roundedValue / 60).toString().padStart(2, `0`);
      const minutes = (roundedValue % 60).toString().padStart(2, `0`);

      return `${hours}:${minutes}`;
    };
    const formatSignedTime = (value: number): string => {
      const sign = value > 0 ? `+` : value < 0 ? `-` : ``;
      return `${sign}${formatTime(Math.abs(value))}`;
    };
    const calcClockAverage = (values: number[]): number => {
      if (values.length === 0) {
        return 0;
      }

      const radians = values.map((value) => (value / 1_440) * Math.PI * 2);
      const sinAvg = radians.reduce((sum, value) => sum + Math.sin(value), 0) / radians.length;
      const cosAvg = radians.reduce((sum, value) => sum + Math.cos(value), 0) / radians.length;
      const angle = Math.atan2(sinAvg, cosAvg);
      const normalized = angle < 0 ? angle + (Math.PI * 2) : angle;

      return Math.round((normalized / (Math.PI * 2)) * 1_440) % 1_440;
    };
    const calcClockDiff = (actual: number, goal: number): number => {
      const diff = Math.abs(actual - goal);
      return Math.min(diff, 1_440 - diff);
    };
    const calcClockPercent = (actual: number, goal: number): number => {
      if (actual <= 0 || goal <= 0) {
        return 0;
      }

      const diff = calcClockDiff(actual, goal);
      if (diff <= 10) {
        return 100;
      }
      if (diff <= 20) {
        return 80;
      }
      if (diff <= 40) {
        return 60;
      }
      if (diff <= 60) {
        return 40;
      }

      return 0;
    };
    const calcSleepPercent = (actual: number, goal: number): number => {
      if (goal <= 0) {
        return 0;
      }

      const diff = Math.abs(goal - actual);
      if (diff <= 10) {
        return 100;
      }
      if (diff <= 20) {
        return 80;
      }
      if (diff <= 40) {
        return 60;
      }
      if (diff <= 60) {
        return 40;
      }

      return 0;
    };
    const formatPercent = (percent: number, goal: number): string => (
      goal > 0 ? `${insertComma(percent)}%` : `-`
    );
    const validGoals = OBJECT.filter((item) => (
      item.sleep_goal_dateStart && item.sleep_goal_dateStart !== `0000-00-00`
    ));
    const bedValues = validGoals
    .map((item) => toValidMinutes(item.sleep_record_bedTime))
    .filter((value): value is number => value !== null);
    const wakeValues = validGoals
    .map((item) => toValidMinutes(item.sleep_record_wakeTime))
    .filter((value): value is number => value !== null);
    const sleepValues = validGoals
    .map((item) => toValidMinutes(item.sleep_record_sleepTime) ?? 0)
    .filter((value) => value > 0);
    const goalBedValues = validGoals
    .map((item) => toValidMinutes(item.sleep_goal_bedTime))
    .filter((value): value is number => value !== null);
    const goalWakeValues = validGoals
    .map((item) => toValidMinutes(item.sleep_goal_wakeTime))
    .filter((value): value is number => value !== null);
    const goalSleepValues = validGoals
    .map((item) => toValidMinutes(item.sleep_goal_sleepTime) ?? 0)
    .filter((value) => value > 0);
    const avgBed = calcClockAverage(bedValues);
    const avgWake = calcClockAverage(wakeValues);
    const avgSleep = sleepValues.length > 0
      ? Math.round(sleepValues.reduce((sum, value) => sum + value, 0) / sleepValues.length)
      : 0;
    const avgGoalBed = calcClockAverage(goalBedValues);
    const avgGoalWake = calcClockAverage(goalWakeValues);
    const avgGoalSleep = goalSleepValues.length > 0
      ? Math.round(goalSleepValues.reduce((sum, value) => sum + value, 0) / goalSleepValues.length)
      : 0;
    const goalSources: SleepGoalSource[] = [
      { key: `bedTime`, actual: avgBed, goal: avgGoalBed, color: chartThemeColors.bedTime },
      { key: `wakeTime`, actual: avgWake, goal: avgGoalWake, color: chartThemeColors.wakeTime },
      { key: `sleepTime`, actual: avgSleep, goal: avgGoalSleep, color: chartThemeColors.sleepTime },
    ];
    const goalRows: SleepGoalRow[] = goalSources.map((row) => {
      const isSleepTime = row.key === `sleepTime`;
      const diff = isSleepTime
        ? row.actual - row.goal
        : calcClockDiff(row.actual, row.goal);
      const percent = isSleepTime
        ? calcSleepPercent(row.actual, row.goal)
        : calcClockPercent(row.actual, row.goal);

      return {
        ...row,
        actualText: formatTime(row.actual),
        goalText: formatTime(row.goal),
        diffText: isSleepTime ? formatSignedTime(diff) : formatTime(diff),
        percent,
        percentText: formatPercent(percent, row.goal),
        barPercent: percent,
      };
    });
    const clockTotal = avgBed + avgWake + avgSleep;
    const bedPercent = clockTotal > 0
      ? Math.round((avgBed / clockTotal) * 100)
      : 0;
    const wakeBasePercent = clockTotal > 0
      ? Math.round((avgWake / clockTotal) * 100)
      : 0;
    const wakePercent = Math.min(100 - bedPercent, wakeBasePercent);
    const sleepPercent = clockTotal > 0
      ? 100 - bedPercent - wakePercent
      : 0;
    const chartData = clockTotal > 0
      ? [
        { name: `bedTime`, value: avgBed, percent: bedPercent, color: chartThemeColors.bedTime },
        { name: `wakeTime`, value: avgWake, percent: wakePercent, color: chartThemeColors.wakeTime },
        { name: `sleepTime`, value: avgSleep, percent: sleepPercent, color: chartThemeColors.sleepTime },
      ].filter((item) => item.value > 0)
      : [
        { name: `Empty`, value: 1, percent: 0, color: `#edf0f4` },
      ];

    return {
      avgBedText: formatTime(avgBed),
      avgWakeText: formatTime(avgWake),
      avgSleepText: formatTime(avgSleep),
      bedPercent,
      wakePercent,
      sleepPercent,
      chartData,
      goalRows,
    };
  }, [ OBJECT, chartThemeColors ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/goal/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: ``,
          dateStart: getMonthStartFmt(DATE?.dateStart),
          dateEnd: getMonthEndFmt(DATE?.dateEnd),
        },
      },
    })
    .then((res: any) => {
      setEXIST(!res.data.result || res.data.result?.length === 0 ? {
          day: [``],
          week: [``],
          month: [``],
          year: [``],
          select: [``],
        } : res.data.result);
    })
    .catch((error: any) => {
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
    });
  }, [ URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: {
          dateType: ``,
          dateStart: DATE?.dateStart,
          dateEnd: DATE?.dateEnd,
        },
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [SleepGoal]);
      const resultLength: number = res.data.result?.length ?? 0;
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));
      // 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
      setIsExpanded(() => {
        if (resultLength !== isExpanded.length) {
          return Array.from({ length: resultLength }, () => ({ expanded: true }));
        }
        return isExpanded;
      });
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [
    URL_OBJECT, sessionId, PAGING?.sort, PAGING.page, DATE?.dateStart, DATE?.dateEnd,
  ]);

  // 7. list -----------------------------------------------------------------------------------
  const listNode = () => {
    // 7-0. summary
    const goalSummarySection = () => (
      <Grid container={true} spacing={0} className={`summary radius-3 border-light-1 shadow-1 p-15px`}>
        {/** row 1 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-left`}>
            <Div className={`period fs-0-95rem fw-600`}>
              {formatDateYyyyMmDd(DATE?.dateStart)}
              {` - `}
              {formatDateYyyyMmDd(DATE?.dateEnd)}
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={6} className={`d-row-center p-relative chart w-124px h-124px`}>
            <ResponsiveContainer width={124} height={124}>
              <PieChart>
                <Pie
                  data={goalSummary.chartData}
                  cx={`50%`}
                  cy={`50%`}
                  innerRadius={40}
                  outerRadius={58}
                  dataKey={`value`}
                  nameKey={`name`}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={goalSummary.chartData.length > 1 ? 2 : 0}
                  stroke={`#fff`}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={520}
                  animationEasing={`ease-out`}
                >
                  {goalSummary.chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Div className={`chart-center`}>
              <Div className={`fs-0-5rem fw-700 mb-5px`} style={{
                color: chartThemeColors.bedTime,
                lineHeight: `1.15`,
              }}>
                {`취침 ${goalSummary.bedPercent}%`}
              </Div>
              <Div className={`fs-0-5rem fw-700 mb-5px`} style={{
                color: chartThemeColors.wakeTime,
                lineHeight: `1.15`,
              }}>
                {`기상 ${goalSummary.wakePercent}%`}
              </Div>
              <Div className={`fs-0-5rem fw-700`} style={{
                color: chartThemeColors.sleepTime,
                lineHeight: `1.15`,
              }}>
                {`수면 ${goalSummary.sleepPercent}%`}
              </Div>
            </Div>
          </Grid>

          <Grid size={6} className={`legend p-relative d-col-center`}>
            <Div className={`d-row-between mb-5px w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.bedTime }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`bedTime`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {goalSummary.avgBedText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`hm`)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between mb-5px w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.wakeTime }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`wakeTime`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {goalSummary.avgWakeText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`hm`)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.sleepTime }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`sleepTime`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {goalSummary.avgSleepText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`hm`)}
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 3 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={`goal-bars`}>
            {goalSummary.goalRows.map((row) => (
              <Div className={`goal-row`} key={row.key}>
                <Div className={`d-row-between w-100p mb-5px`}>
                  <Div className={`fs-0-65rem fw-600 dark`}>
                    {translate(row.key)}
                  </Div>
                  <Div className={`fs-0-85rem fw-700`}>
                    {row.percentText}
                  </Div>
                </Div>
                <Div className={`w-100p h-8px radius-2 track over-hidden`}>
                  <Div className={`h-8px radius-2`} style={{
                    width: `${row.barPercent}%`,
                    background: row.color,
                  }} />
                </Div>
                <Div className={`d-row-between w-100p mt-5px`} style={{ gap: `8px`, flexWrap: `wrap` }}>
                  <Div className={`fs-0-55rem fw-500 dark`} style={{ minWidth: 0 }}>
                    {row.actualText}
                    {` / `}
                    {row.goalText}
                    {` ${translate(`hm`)}`}
                  </Div>
                  <Div className={`fs-0-55rem fw-700`} style={{ color: row.color, flex: `0 0 auto` }}>
                    {row.diffText}
                  </Div>
                </Div>
              </Div>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );

    // 7-1. list
    const listSection = () => (
      deferredObject?.map((item, i) => (
        <Grid container={true} spacing={0} key={item._id || `sleep-goal-${i}`}>
          <Grid size={12} className={`accordion radius-3 border-light-1 shadow-1 mb-10px`}>
            <Accordion className={`radius-3 border-0 shadow-0`} expanded={isExpanded?.[i]?.expanded ?? true}>
              <AccordionSummary
                expandIcon={(
                  <Icons
                    key={`ChevronDown`}
                    name={`ChevronDown`}
                    isIconButton={true}
                    className={`w-16px h-16px`}
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsExpanded(isExpanded.map((item: any, index: number) => (
                        index === i ? { expanded: !item.expanded } : item
                      )));
                    }}
                  />
                )}
                onClick={() => {
                  void navigate(toDetail, {
                    state: {
                      id: item._id,
                      dateType: item.sleep_goal_dateType,
                      dateStart: item.sleep_goal_dateStart,
                      dateEnd: item.sleep_goal_dateEnd,
                    },
                  });
                }}
              >
                <Grid container={true} spacing={1}>
                  <Grid size={2} className={`d-row-center`}>
                    <Icons
                      key={`Search`}
                      name={`Search`}
                      isIconButton={false}
                      className={`w-16px h-16px`}
                    />
                  </Grid>
                  <Grid size={10} className={`d-row-left`}>
                    <Div className={`fs-0-8rem fw-600 black`}>
                      {formatDateMmDd(item.sleep_goal_dateStart)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.sleep_goal_dateStart).format(`ddd`))}
                    </Div>
                    <Div className={`fs-0-8rem fw-500 dark ml-5px mr-5px`}>
                      {`-`}
                    </Div>
                    <Div className={`fs-0-8rem fw-600 black`}>
                      {formatDateMmDd(item.sleep_goal_dateEnd)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.sleep_goal_dateEnd).format(`ddd`))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container={true} spacing={1} className={`legend`}>

                  {/** row 1 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.bedTime }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`bedTime`)}
                      </Div>
                    </Grid>
                    <Grid size={7}>
                      <Grid container={true} spacing={1}>
                        {/** goal * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`goal`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_goal_bedTime_color}`}>
                            {item.sleep_goal_bedTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_record_bedTime_color}`}>
                            {item.sleep_record_bedTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_record_diff_bedTime_color}`}>
                            {item.sleep_record_diff_bedTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 2 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.wakeTime }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`wakeTime`)}
                      </Div>
                    </Grid>
                    <Grid size={7}>
                      <Grid container={true} spacing={1}>
                        {/** goal * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`goal`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_goal_wakeTime_color}`}>
                            {item.sleep_goal_wakeTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_record_wakeTime_color}`}>
                            {item.sleep_record_wakeTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_record_diff_wakeTime_color}`}>
                            {item.sleep_record_diff_wakeTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 3 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.sleepTime }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`sleepTime`)}
                      </Div>
                    </Grid>
                    <Grid size={7}>
                      <Grid container={true} spacing={1}>
                        {/** goal * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`goal`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_goal_sleepTime_color}`}>
                            {item.sleep_goal_sleepTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_record_sleepTime_color}`}>
                            {item.sleep_record_sleepTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.sleep_record_diff_sleepTime_color}`}>
                            {item.sleep_record_diff_sleepTime}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {translate(`hm`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      ))
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
        {goalSummarySection()}
        <Hr m={25} className={`bg-light`} />
        {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={`sleep`} /> : listSection()}
      </Paper>
    );
  };

  // 8. dialog ----------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, PAGING, COUNT, EXIST,
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT, setEXIST,
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
