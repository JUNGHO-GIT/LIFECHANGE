/**
 * @file SleepRecordList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { SleepRecord, SleepRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer } from "@exportLibs";
import { formatDateMmDd, formatDateYyyyMmDd } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

declare interface SleepTimeStat {
  dateStart: string;
  dateEnd: string;
  sleepTime: number;
}

// -------------------------------------------------------------------------------------------------
export const SleepRecordList = memo(() => {

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
  const [ OBJECT, setOBJECT ] = useState<[SleepRecordType]>([SleepRecord]);
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
  // - 선택 기간의 평균 수면 패턴과 최고·최저 수면 계산
  const recordSummary = useMemo(() => {
    // 시:분 형식의 시간을 분 단위로 변환
    const toMinutes = (value?: string | number | null): number => {
      const [ hours = `0`, minutes = `0` ] = String(value ?? `00:00`).split(`:`);
      const result = (Number(hours) * 60) + Number(minutes);

      return Number.isFinite(result) ? result : 0;
    };

    // 분 단위 시간을 시:분 형식으로 변환
    const formatTime = (value: number): string => {
      const roundedValue = Math.max(0, Math.round(value));
      const hours = Math.floor(roundedValue / 60).toString().padStart(2, `0`);
      const minutes = (roundedValue % 60).toString().padStart(2, `0`);

      return `${hours}:${minutes}`;
    };

    const formatRecordDate = (item: SleepTimeStat): string => (
      item.dateStart && item.dateStart !== `0000-00-00`
        ? `${formatDateYyyyMmDd(item.dateStart)} - ${formatDateYyyyMmDd(item.dateEnd)}`
        : `-`
    );

    // 자정을 통과하는 시각값의 원형 평균 계산
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

    const validRecords = OBJECT.filter((item) => Boolean(item._id));
    const bedValues = validRecords
    .map((item) => toMinutes(item.sleep_record_bedTime ?? item.sleep_section?.[0]?.sleep_record_bedTime))
    .filter((value) => value > 0);
    const wakeValues = validRecords
    .map((item) => toMinutes(item.sleep_record_wakeTime ?? item.sleep_section?.[0]?.sleep_record_wakeTime))
    .filter((value) => value > 0);
    const sleepValues = validRecords
    .map((item) => toMinutes(item.sleep_record_sleepTime ?? item.sleep_section?.[0]?.sleep_record_sleepTime))
    .filter((value) => value > 0);
    const sleepStats = validRecords
    .map((item) => ({
      dateStart: item.sleep_record_dateStart,
      dateEnd: item.sleep_record_dateEnd,
      sleepTime: toMinutes(item.sleep_record_sleepTime ?? item.sleep_section?.[0]?.sleep_record_sleepTime),
    }))
    .filter((item) => item.sleepTime > 0);
    const emptySleep: SleepTimeStat = {
      dateStart: ``,
      dateEnd: ``,
      sleepTime: 0,
    };
    const highestSleep = sleepStats.reduce((highest, item) => (
      item.sleepTime > highest.sleepTime ? item : highest
    ), emptySleep);
    const lowestSleep = sleepStats.reduce((lowest, item) => (
      item.sleepTime < lowest.sleepTime ? item : lowest
    ), sleepStats[0] ?? emptySleep);
    const avgBed = calcClockAverage(bedValues);
    const avgWake = calcClockAverage(wakeValues);
    const avgSleep = sleepValues.length > 0
      ? Math.round(sleepValues.reduce((sum, value) => sum + value, 0) / sleepValues.length)
      : 0;
    // 취침·기상·수면 시간의 구성 비율 계산
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
      recordCnt: COUNT.totalCnt,
      avgBedText: formatTime(avgBed),
      avgWakeText: formatTime(avgWake),
      avgSleepText: formatTime(avgSleep),
      highestSleepText: formatTime(highestSleep.sleepTime),
      highestDateText: formatRecordDate(highestSleep),
      lowestSleepText: formatTime(lowestSleep.sleepTime),
      lowestDateText: formatRecordDate(lowestSleep),
      bedPercent,
      wakePercent,
      sleepPercent,
      chartData,
    };
  }, [ OBJECT, COUNT.totalCnt, chartThemeColors ]);

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
      setEXIST(
        !res.data.result || res.data.result?.length === 0 ? [``] : res.data.result
      );
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
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [SleepRecord]);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));
      // 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
      setIsExpanded(() => {
        if (res.data.result?.length !== isExpanded.length) {
          return Array.from({ length: res.data.result?.length }, () => ({ expanded: true }));
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
    const summarySection = () => (
      <Grid container={true} spacing={0} className={`sleep-record-summary radius-3 border-light-1 shadow-1 p-15px`}>
        {/** row 1 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-left`}>
            <Div className={`fs-0-95rem fw-600`}>
              {formatDateYyyyMmDd(DATE?.dateStart)}
              {` - `}
              {formatDateYyyyMmDd(DATE?.dateEnd)}
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={6} className={`d-row-center p-relative sleep-record-chart w-124px h-124px`}>
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
            <Div className={`sleep-record-chart-center`}>
              <Div className={`fs-0-5rem fw-700 mb-5px`} style={{
                color: chartThemeColors.bedTime,
                lineHeight: `1.15`
              }}>
                {`취침 ${recordSummary.bedPercent}%`}
              </Div>
              <Div className={`fs-0-5rem fw-700 mb-5px`} style={{
                color: chartThemeColors.wakeTime,
                lineHeight: `1.15`
              }}>
                {`기상 ${recordSummary.wakePercent}%`}
              </Div>
              <Div className={`fs-0-5rem fw-700`} style={{
                color: chartThemeColors.sleepTime,
                lineHeight: `1.15`
              }}>
                {`수면 ${recordSummary.sleepPercent}%`}
              </Div>
            </Div>
          </Grid>

          <Grid size={6} className={`sleep-record-legend p-relative d-col-center`}>
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
                <Div className={`fs-0-7rem fw-600 black mr-5px`}>
                  {recordSummary.avgBedText}
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
                <Div className={`fs-0-7rem fw-600 black mr-5px`}>
                  {recordSummary.avgWakeText}
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
                <Div className={`fs-0-7rem fw-600 black mr-5px`}>
                  {recordSummary.avgSleepText}
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
          <Grid size={12} className={`sleep-record-stat-grid`}>
            <Div className={`sleep-record-stat-card`}>
              <Div className={`sleep-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`maxSleepTime`)}
                </Div>
                <Div className={`sleep-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.highestDateText}>
                  {recordSummary.highestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right sleep-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.highestSleepText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`hm`)}
                </Div>
              </Div>
            </Div>
            <Div className={`sleep-record-stat-card`}>
              <Div className={`sleep-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`minSleepTime`)}
                </Div>
                <Div className={`sleep-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.lowestDateText}>
                  {recordSummary.lowestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right sleep-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.lowestSleepText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`hm`)}
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
                        dateType: item.sleep_record_dateType,
                        dateStart: item.sleep_record_dateStart,
                        dateEnd: item.sleep_record_dateEnd,
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
                    <Grid size={7} className={`d-row-left`}>
                      <Div className={`fs-0-9rem fw-600 black mr-5px`}>
                        {formatDateMmDd(item.sleep_record_dateStart)}
                      </Div>
                      <Div className={`fs-0-9rem fw-500 dark mr-5px`}>
                        {translate(getDayNotFmt(item.sleep_record_dateStart).format(`ddd`))}
                      </Div>
                      <Div className={`d-center`}>
                        <Icons
                          name={(item.sleep_record_score_smile ?? `smile3`)}
                          className={`w-14px h-14px`}
                          sx={{ padding: 0 }}
                        />
                      </Div>
                    </Grid>
                    <Grid size={3} className={`d-row-right pr-5px`}>
                      <Div className={`fs-0-85rem fw-700 black`}>
                        {item.sleep_record_sleepTime ?? item.sleep_section?.[0]?.sleep_record_sleepTime ?? `00:00`}
                      </Div>
                      <Div className={`fs-0-6rem fw-500 dark ml-4px`}>
                        {translate(`hm`)}
                      </Div>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container={true} spacing={1}>
                    {/** row 1 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-row-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.bedTime }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`bedTime`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.sleep_record_bedTime_color ?? item.sleep_section?.[0]?.sleep_record_bedTime_color ?? ``}`}>
                              {item.sleep_record_bedTime ?? item.sleep_section?.[0]?.sleep_record_bedTime}
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
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.wakeTime }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`wakeTime`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.sleep_record_wakeTime_color ?? item.sleep_section?.[0]?.sleep_record_wakeTime_color ?? ``}`}>
                              {item.sleep_record_wakeTime ?? item.sleep_section?.[0]?.sleep_record_wakeTime}
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
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.sleepTime }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`sleepTime`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.sleep_record_sleepTime_color ?? item.sleep_section?.[0]?.sleep_record_sleepTime_color ?? ``}`}>
                              {item.sleep_record_sleepTime ?? item.sleep_section?.[0]?.sleep_record_sleepTime}
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
        ))}
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
        {summarySection()}
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
