/**
 * @file ExerciseGoalList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, memo, useCallback, useMemo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { ExerciseGoal, ExerciseGoalType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { formatDateMmDd, formatDateYyyyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";
import { ExerciseGoalChart } from "./ExerciseGoalChart";

declare interface ExerciseTotals {
  count: number;
  volume: number;
  cardio: number;
  scale: number;
}

declare interface ExerciseGoalSource {
  key: `count` | `volume` | `cardio` | `scale`;
  label: string;
  unit: string;
  actual: number;
  goal: number;
  color: string;
}

declare interface ExerciseGoalRow {
  key: `count` | `volume` | `cardio` | `scale`;
  label: string;
  unit: string;
  actual: number;
  goal: number;
  actualText: string;
  goalText: string;
  diffText: string;
  percent: number;
  percentText: string;
  barPercent: number;
  color: string;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, sessionId, toDetail, localUnit,
    navigate, location_dateType, location_dateStart, location_dateEnd, chartColors, chartThemeColors,
  } = useCommonValue();
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
  const [ OBJECT, setOBJECT ] = useState<[ExerciseGoalType]>([ExerciseGoal]);
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
  // - 선택 기간의 운동 기록과 목표 달성 현황 계산
  const goalSummary = useMemo(() => {
    const createEmptyTotals = (): ExerciseTotals => ({
      count: 0,
      volume: 0,
      cardio: 0,
      scale: 0,
    });
    const toNumber = (value?: string | number | null): number => {
      const normalized = String(value ?? `0`)
      .replaceAll(`,`, ``)
      .trim()
      .toLowerCase();
      const unit = normalized.slice(-1);
      const numericText = unit === `k` || unit === `m`
      ? normalized.slice(0, -1)
      : normalized;
      const multiplier = unit === `m`
      ? 1_000_000
      : unit === `k`
      ? 1_000
      : 1;
      const result = Number(numericText) * multiplier;

      return Number.isFinite(result) ? result : 0;
    };
    const toMinutes = (value?: string | number | null): number => {
      const [ hours = `0`, minutes = `0` ] = String(value ?? `00:00`).split(`:`);
      const result = (Number(hours) * 60) + Number(minutes);

      return Number.isFinite(result) ? result : 0;
    };
    const roundToTenth = (value: number): number => {
      const sign = value < 0 ? -1 : 1;
      return sign * (Math.round((Math.abs(value) + Number.EPSILON) * 10) / 10);
    };
    const formatNumber = (value: number): string => {
      const roundedValue = roundToTenth(value);
      return insertComma(roundedValue);
    };
    const formatTime = (value: number): string => {
      const roundedValue = Math.max(0, Math.round(value));
      const hours = Math.floor(roundedValue / 60).toString().padStart(2, `0`);
      const minutes = (roundedValue % 60).toString().padStart(2, `0`);

      return `${hours}:${minutes}`;
    };
    const formatSignedNumber = (value: number): string => (
      value > 0 ? `+${formatNumber(value)}` : formatNumber(value)
    );
    const formatSignedTime = (value: number): string => {
      const sign = value > 0 ? `+` : value < 0 ? `-` : ``;
      return `${sign}${formatTime(Math.abs(value))}`;
    };
    const calcPercent = (actual: number, goal: number): number => (
      goal > 0 ? Math.round((actual / goal) * 100) : 0
    );
    const calcScalePercent = (actual: number, goal: number): number => {
      if (actual <= 0 || goal <= 0) {
        return 0;
      }

      return actual <= goal ? 100 : Math.round((goal / actual) * 100);
    };
    const formatPercent = (percent: number, goal: number): string => (
      goal > 0 ? `${insertComma(percent)}%` : `-`
    );
    const getRecordTotals = (item: ExerciseGoalType): ExerciseTotals => ({
      count: toNumber(item.exercise_record_total_count),
      volume: toNumber(item.exercise_record_total_volume),
      cardio: toMinutes(item.exercise_record_total_cardio),
      scale: toNumber(item.exercise_record_total_scale),
    });
    const getGoalTotals = (item: ExerciseGoalType): ExerciseTotals => ({
      count: toNumber(item.exercise_goal_count),
      volume: toNumber(item.exercise_goal_volume),
      cardio: toMinutes(item.exercise_goal_cardio),
      scale: toNumber(item.exercise_goal_scale),
    });
    const addTotals = (
      target: ExerciseTotals,
      source: ExerciseTotals,
    ): ExerciseTotals => {
      target.count += source.count;
      target.volume += source.volume;
      target.cardio += source.cardio;
      target.scale += source.scale;

      return target;
    };
    const validGoals = OBJECT.filter((item) => (
      item.exercise_goal_dateStart && item.exercise_goal_dateStart !== `0000-00-00`
    ));
    const recordTotals = validGoals.reduce<ExerciseTotals>(
      (sum, item) => addTotals(sum, getRecordTotals(item)),
      createEmptyTotals(),
    );
    const goalTotals = validGoals.reduce<ExerciseTotals>(
      (sum, item) => addTotals(sum, getGoalTotals(item)),
      createEmptyTotals(),
    );
    const scaleRecords = validGoals.filter((item) => toNumber(item.exercise_record_total_scale) > 0);
    const scaleGoals = validGoals.filter((item) => toNumber(item.exercise_goal_scale) > 0);
    const avgScale = scaleRecords.length > 0
      ? recordTotals.scale / scaleRecords.length
      : 0;
    const avgGoalScale = scaleGoals.length > 0
      ? goalTotals.scale / scaleGoals.length
      : 0;
    const goalSources: ExerciseGoalSource[] = [
      {
        key: `count`,
        label: `record`,
        unit: `c`,
        actual: recordTotals.count,
        goal: goalTotals.count,
        color: chartColors[5],
      },
      {
        key: `volume`,
        label: `volume`,
        unit: `vol`,
        actual: recordTotals.volume,
        goal: goalTotals.volume,
        color: chartThemeColors.volume,
      },
      {
        key: `cardio`,
        label: `cardio`,
        unit: `hm`,
        actual: recordTotals.cardio,
        goal: goalTotals.cardio,
        color: chartThemeColors.cardio,
      },
      {
        key: `scale`,
        label: `scale`,
        unit: localUnit,
        actual: avgScale,
        goal: avgGoalScale,
        color: chartThemeColors.scale,
      },
    ];
    const goalRows: ExerciseGoalRow[] = goalSources.map((row) => {
      const isCardio = row.key === `cardio`;
      const percent = row.key === `scale`
        ? calcScalePercent(row.actual, row.goal)
        : calcPercent(row.actual, row.goal);
      const diff = row.actual - row.goal;

      return {
        ...row,
        actualText: isCardio ? formatTime(row.actual) : formatNumber(row.actual),
        goalText: isCardio ? formatTime(row.goal) : formatNumber(row.goal),
        diffText: isCardio ? formatSignedTime(diff) : formatSignedNumber(diff),
        percent,
        percentText: formatPercent(percent, row.goal),
        barPercent: Math.min(100, percent),
      };
    });
    const goalPercents = goalRows
    .filter((row) => row.goal > 0)
    .map((row) => Math.min(100, row.percent));
    const overallPercent = goalPercents.length > 0
      ? Math.round(goalPercents.reduce((sum, percent) => sum + percent, 0) / goalPercents.length)
      : 0;
    const chartData = goalPercents.length > 0 ? [
      { name: `goal`, value: overallPercent, color: chartColors[5] },
      { name: `remain`, value: Math.max(0, 100 - overallPercent), color: `#edf0f4` },
    ] : [
      { name: `Empty`, value: 1, color: `#edf0f4` },
    ];

    return {
      avgVolumeText: formatNumber(validGoals.length > 0 ? recordTotals.volume / validGoals.length : 0),
      avgCardioText: formatTime(validGoals.length > 0 ? recordTotals.cardio / validGoals.length : 0),
      avgScaleText: formatNumber(avgScale),
      overallPercentText: goalPercents.length > 0 ? `${overallPercent}%` : `-`,
      chartData,
      goalRows,
    };
  }, [OBJECT, chartColors, chartThemeColors, localUnit]);

  // 4. 목표 목록 확장 상태 전환 ---------------------------------------------------------------
  const handleToggle = useCallback((i: number) => {
    setIsExpanded(prev => prev.map((x: any, idx: number) => (
      idx === i ? { expanded: !x.expanded } : x
    )));
  }, [setIsExpanded]);

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
      setLOADING(false);
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [ExerciseGoal]);
      const resultLength: number = res.data.result?.length ?? 0;
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));
      // 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
      setIsExpanded((prev: { expanded: boolean }[]) => {
        if (resultLength !== prev.length) {
          return Array.from({ length: resultLength }, () => ({ expanded: true }));
        }
        return prev;
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
    const summarySection = () => (
      <Grid container={true} spacing={0} className={`summary radius-3 border-light-1 shadow-1 p-15px`}>
        {/** row 1 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-center`}>
            <Div className={`fs-0-95rem fw-600`}>
              {`${formatDateYyyyMmDd(DATE?.dateStart)}`}
            </Div>
            <Div className={`fs-0-85rem fw-600 dark-grey`}>
               {`(${translate(getDayNotFmt(DATE?.dateStart).format(`ddd`))})`}
            </Div>
            <Div className={`fs-0-95rem fw-600 mx-10px`}>
              {`-`}
            </Div>
            <Div className={`fs-0-95rem fw-600`}>
              {`${formatDateYyyyMmDd(DATE?.dateEnd)}`}
            </Div>
            <Div className={`fs-0-85rem fw-600 dark-grey`}>
               {`(${translate(getDayNotFmt(DATE?.dateEnd).format(`ddd`))})`}
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 2 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-center`}>
            <ExerciseGoalChart DATE={DATE} />
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
                    {translate(row.label)}
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
                    {` ${row.key === `scale` ? localUnit : translate(row.unit)}`}
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
        <Grid container={true} spacing={0} key={item._id || `exercise-goal-${i}`}>
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
                      handleToggle(i);
                    }}
                  />
                )}
                onClick={() => {
                  void navigate(toDetail, {
                    state: {
                      id: item._id,
                      dateType: item.exercise_goal_dateType,
                      dateStart: item.exercise_goal_dateStart,
                      dateEnd: item.exercise_goal_dateEnd,
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
                      {formatDateMmDd(item.exercise_goal_dateStart)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.exercise_goal_dateStart).format(`ddd`))}
                    </Div>
                    <Div className={`fs-0-8rem fw-500 dark ml-5px mr-5px`}>
                      {`-`}
                    </Div>
                    <Div className={`fs-0-8rem fw-600 black`}>
                      {formatDateMmDd(item.exercise_goal_dateEnd)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.exercise_goal_dateEnd).format(`ddd`))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container={true} spacing={1} className={`legend`}>

                  {/** row 1 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartColors[5] }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`exerciseCount`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_goal_count_color}`}>
                            {insertComma(item.exercise_goal_count ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`c`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_count_color}`}>
                            {insertComma(item.exercise_record_total_count ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`c`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_count_color}`}>
                            {insertComma(item.exercise_record_diff_count ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`c`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 2 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.volume }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`volume`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_goal_volume_color}`}>
                            {insertComma(item.exercise_goal_volume ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`vol`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_volume_color}`}>
                            {insertComma(item.exercise_record_total_volume ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`vol`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_volume_color}`}>
                            {insertComma(item.exercise_record_diff_volume ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`vol`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 3 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.cardio }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`cardio`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_goal_cardio_color}`}>
                            {item.exercise_goal_cardio}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`min`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_cardio_color}`}>
                            {item.exercise_record_total_cardio}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`min`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_cardio_color}`}>
                            {item.exercise_record_diff_cardio}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`min`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 4 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.scale }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`scale`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_goal_scale_color}`}>
                            {insertComma(item.exercise_goal_scale ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {localUnit}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_scale_color}`}>
                            {insertComma(item.exercise_record_total_scale ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {localUnit}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.exercise_record_diff_scale_color}`}>
                            {insertComma(item.exercise_record_diff_scale ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-6rem`}>
                            {localUnit}
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
      <Paper className={`content-wrapper radius-2 border-light-1 shadow-1 h-min-75vh`}>
        {summarySection()}
        <Hr m={25} className={`bg-light`} />
        {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={`exercise`} /> : listSection()}
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
