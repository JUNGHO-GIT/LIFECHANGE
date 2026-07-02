/**
 * @file ExerciseRecordList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, memo, useCallback, useMemo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { ExerciseRecord, ExerciseRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer } from "@exportLibs";
import { formatDateMmDd, formatDateYyyyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Img, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
type ExerciseGoalKey = `count` | `volume` | `cardio` | `scale`;

declare interface ExerciseTotals {
  count: number;
  volume: number;
  cardio: number;
  scale: number;
}

declare interface ExerciseGoalSource {
  key: ExerciseGoalKey;
  label: string;
  unit: string;
  actual: number;
  goal: number;
  color: string;
}

declare interface ExerciseGoalRow {
  key: ExerciseGoalKey;
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

declare interface ExerciseScaleStat {
  dateStart: string;
  dateEnd: string;
  scale: number;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseRecordList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, sessionId, toDetail, localUnit,
    navigate, location_dateType, location_dateStart, location_dateEnd, chartThemeColors,
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
      part: `all`,
      title: `all`,
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
  const [ OBJECT, setOBJECT ] = useState<[ExerciseRecordType]>([ExerciseRecord]);
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
  const handleToggle = useCallback((i: number) => {
    setIsExpanded((prev: any) => prev.map((x: any, idx: number) => (
      idx === i ? { expanded: !x.expanded } : x
    )));
  }, [setIsExpanded]);

  // 3. summary ----------------------------------------------------------------------------------
  // - 기록 1건당 평균 운동량 요약
  const recordSummary = useMemo(() => {
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
    const formatNumber = (value: number): string => {
      const roundedValue = Math.round(value * 10) / 10;
      return insertComma(roundedValue);
    };
    const formatTime = (value: number): string => {
      const roundedValue = Math.max(0, Math.round(value));
      const hours = Math.floor(roundedValue / 60).toString().padStart(2, `0`);
      const minutes = (roundedValue % 60).toString().padStart(2, `0`);

      return `${hours}:${minutes}`;
    };
    const getRecordTotals = (item: ExerciseRecordType): ExerciseTotals => ({
      count: toNumber(item.exercise_record_total_count),
      volume: toNumber(item.exercise_record_total_volume),
      cardio: toMinutes(item.exercise_record_total_cardio),
      scale: toNumber(item.exercise_record_total_scale),
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
    const formatRecordDate = (item: ExerciseScaleStat): string => {
      if (!item.dateStart) {
        return `-`;
      }
      if (item.dateStart === item.dateEnd) {
        return formatDateMmDd(item.dateStart);
      }
      return `${formatDateMmDd(item.dateStart)} - ${formatDateMmDd(item.dateEnd)}`;
    };
    const validRecords = OBJECT.filter((item) => (
      item.exercise_record_dateStart && item.exercise_record_dateStart !== `0000-00-00`
    ));
    const recordCount = validRecords.length;
    const recordTotals = validRecords.reduce<ExerciseTotals>(
      (sum, item) => addTotals(sum, getRecordTotals(item)),
      createEmptyTotals(),
    );
    const recordDivisor = recordCount > 0 ? recordCount : 1;
    const scaleRecords = validRecords.filter((item) => toNumber(item.exercise_record_total_scale) > 0);
    const avgVolume = recordTotals.volume / recordDivisor;
    const avgCardio = recordTotals.cardio / recordDivisor;
    const avgScale = scaleRecords.length > 0
      ? recordTotals.scale / scaleRecords.length
      : 0;
    const emptyScaleRecord: ExerciseScaleStat = {
      dateStart: ``,
      dateEnd: ``,
      scale: 0,
    };
    const scaleStats: ExerciseScaleStat[] = scaleRecords.map((item) => ({
      dateStart: item.exercise_record_dateStart,
      dateEnd: item.exercise_record_dateEnd,
      scale: toNumber(item.exercise_record_total_scale),
    }));
    const highestRecord = scaleStats.reduce((highest, item) => (
      item.scale > highest.scale ? item : highest
    ), scaleStats[0] ?? emptyScaleRecord);
    const lowestRecord = scaleStats.reduce((lowest, item) => (
      item.scale < lowest.scale ? item : lowest
    ), scaleStats[0] ?? emptyScaleRecord);
    const chartItems = [
      { name: `volume`, value: avgVolume, color: chartThemeColors.volume },
      { name: `cardio`, value: avgCardio, color: chartThemeColors.cardio },
      { name: `scale`, value: avgScale, color: chartThemeColors.scale },
    ].filter((item) => item.value > 0);
    const chartData = chartItems.length > 0 ? chartItems : [
      { name: `Empty`, value: 1, color: `#edf0f4` },
    ];

    return {
      recordCount,
      avgVolumeText: formatNumber(avgVolume),
      avgCardioText: formatTime(avgCardio),
      avgScaleText: formatNumber(avgScale),
      scaleRecordCount: scaleRecords.length,
      highestScaleText: formatNumber(highestRecord.scale),
      highestDateText: formatRecordDate(highestRecord),
      lowestScaleText: formatNumber(lowestRecord.scale),
      lowestDateText: formatRecordDate(lowestRecord),
      chartData,
    };
  }, [OBJECT, chartThemeColors]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/record/exist`, {
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
    axios.get(`${URL_OBJECT}/record/list`, {
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
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [ExerciseRecord]);
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
    URL_OBJECT, sessionId, PAGING?.sort, PAGING.page, PAGING?.part, PAGING?.title, DATE?.dateStart, DATE?.dateEnd,
  ]);

  // 7. list -----------------------------------------------------------------------------------
  const listNode = () => {
    // 7-0. summary
    const recordSummarySection = () => (
      <Grid container={true} spacing={0} className={`exercise-record-summary radius-3 border-light-1 shadow-1 p-15px`}>
        {/** row 1 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-left`}>
            <Div className={`exercise-record-period fs-0-95rem fw-600`}>
              {formatDateYyyyMmDd(DATE?.dateStart)}
              {` -`}
              {formatDateYyyyMmDd(DATE?.dateEnd)}
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={6} className={`d-row-center p-relative exercise-record-chart w-124px h-124px`}>
            <ResponsiveContainer width={`100%`} height={`100%`}>
              <PieChart>
                <Pie
                  data={recordSummary.chartData}
                  cx={`50%`}
                  cy={`50%`}
                  innerRadius={40}
                  outerRadius={58}
                  dataKey={`value`}
                  nameKey={`name`}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={recordSummary.chartData.length > 1 ? 2 : 0}
                  stroke={`#fff`}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={520}
                  animationEasing={`ease-out`}
                >
                  {recordSummary.chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Div className={`exercise-record-chart-center`}>
              <Div className={`fs-0-55rem fw-600 dark mb-3px`}>
                {translate(`avg`)}
              </Div>
              <Div className={`fs-0-85rem fw-700 black`}>
                {recordSummary.avgVolumeText}
              </Div>
              <Div className={`fs-0-55rem fw-600 dark mt-3px`}>
                {translate(`vol`)}
              </Div>
            </Div>
          </Grid>

          <Grid size={6} className={`exercise-record-legend p-relative d-col-center`}>
            <Div className={`d-row-between mb-5px w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.volume }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`volume`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {recordSummary.avgVolumeText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`vol`)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between mb-5px w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.cardio }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`cardio`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {recordSummary.avgCardioText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`hm`)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.scale }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`scale`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {recordSummary.avgScaleText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {localUnit}
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 3 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={`exercise-record-stat-grid`}>
            <Div className={`exercise-record-stat-card`}>
              <Div className={`exercise-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`maxScale`)}
                </Div>
                <Div className={`exercise-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.highestDateText}>
                  {recordSummary.highestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right exercise-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.highestScaleText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {localUnit}
                </Div>
              </Div>
            </Div>
            <Div className={`exercise-record-stat-card`}>
              <Div className={`exercise-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`minScale`)}
                </Div>
                <Div className={`exercise-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.lowestDateText}>
                  {recordSummary.lowestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right exercise-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.lowestScaleText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {localUnit}
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>
      </Grid>
    );

    // 7-1. list
    const listSection = () => (
      <Grid container={true} spacing={0}>
        {deferredObject?.map((item, i) => (
          <Grid container={true} spacing={0} className={`accordion radius-3 border-light-1 shadow-1 mb-10px`} key={i}>
            <Grid size={12} className={`p-2px`}>
              <Accordion className={`radius-3 border-0 shadow-0`} expanded={isExpanded?.[i]?.expanded}>
                <AccordionSummary
                  expandIcon={(
                    <Icons
                      key={`ChevronDown`}
                      name={`ChevronDown`}
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
                        dateType: item.exercise_record_dateType,
                        dateStart: item.exercise_record_dateStart,
                        dateEnd: item.exercise_record_dateEnd,
                      },
                    });
                  }}
                >
                  <Grid container={true} spacing={0}>
                    <Grid size={2} className={`d-row-center`}>
                      <Icons
                        key={`Search`}
                        name={`Search`}
                        className={`w-16px h-16px`}
                      />
                    </Grid>
                    <Grid size={5} className={`d-row-left`}>
                      <Div className={`fs-0-9rem fw-600 black mr-5px`}>
                        {formatDateMmDd(item.exercise_record_dateStart)}
                      </Div>
                      <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                        {translate(getDayNotFmt(item.exercise_record_dateStart).format(`ddd`))}
                      </Div>
                      <Icons
                        name={(item.exercise_record_score_smile ?? `smile3`)}
                        className={`w-14px h-14px ml-10px`}
                        sx={{ padding: 0 }}
                      />
                    </Grid>
                    <Grid size={5} className={`d-row-right`}>
                      <Div className={`d-row-center`}>
                        <Div className={`fs-0-75rem fw-700 ${item.exercise_record_summary_scale_color ?? item.exercise_record_total_scale_color}`}>
                          {insertComma(item.exercise_record_total_scale ?? `0`)}
                        </Div>
                        <Div className={`fs-0-6rem fw-600 dark ml-5px`}>
                          {localUnit}
                        </Div>
                      </Div>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container={true} spacing={1}>
                    {/** row 1 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-row-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.volume }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`volume`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_volume_color}`}>
                              {insertComma(item.exercise_record_total_volume)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
                              {translate(`vol`)}
                            </Div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Hr m={1} className={`bg-light`} />

                    {/** row 2 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.cardio }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`cardio`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_cardio_color}`}>
                              {item.exercise_record_total_cardio}
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
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.scale }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`scale`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.exercise_record_total_scale_color}`}>
                              {insertComma(item.exercise_record_total_scale)}
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
        ))}
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
        {recordSummarySection()}
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
