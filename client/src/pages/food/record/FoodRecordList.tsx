/**
 * @file FoodRecordList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { FoodRecord, FoodRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "@exportLibs";
import { formatDateYyyyMmDd, formatDateYyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

// ----------------------------------------------------------------------------------------------
type NutritionTotals = {
  kcal: number;
  carb: number;
  protein: number;
  fat: number;
};

interface RecordKcalStat {
  dateStart: string;
  dateEnd: string;
  kcal: number;
}

// ----------------------------------------------------------------------------------------------
export const FoodRecordList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toDetail, navigate } = useCommonValue();
  const { location_dateType, location_dateStart, location_dateEnd, chartThemeColors } = useCommonValue();
  const { getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ DATE, setDATE ] = useStorageLocal(
    `date`, PATH, ``, {
      dateType: location_dateType ?? ``,
      dateStart: location_dateStart ?? getMonthStartFmt(),
      dateEnd: location_dateEnd ?? getMonthEndFmt(),
    }
  );
  const [ PAGING, setPAGING ] = useStorageLocal(
    `paging`, PATH, ``, {
      sort: `asc`,
      page: 1,
      part: `all`,
    },
  );
  const [ isExpanded, setIsExpanded ] = useStorageLocal(
    `isExpanded`, PATH, ``, [
      {
        expanded: true,
      },
    ],
  );

  // 2-2. useState -------------------------------------------------------------------------------
  const [ OBJECT, setOBJECT ] = useState<[FoodRecordType]>([FoodRecord]);
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
  // - 기록 1건당 평균 섭취량 요약
  const recordSummary = useMemo(() => {
    const toNumber = (value?: string | number | null) => {
      const result = Number(String(value ?? `0`).replaceAll(`,`, ``));
      return Number.isFinite(result) ? result : 0;
    };
    const roundToTenth = (value: number) => Math.round(value * 10) / 10;
    const formatNumber = (value: number) => insertComma(Math.round(value));
    const validRecords = OBJECT.filter((item) => (
      item.food_record_dateStart && item.food_record_dateStart !== `0000-00-00`
    ));
    const recordCount = validRecords.length;
    const kcalRecords: RecordKcalStat[] = validRecords.map((item) => ({
      dateStart: item.food_record_dateStart,
      dateEnd: item.food_record_dateEnd,
      kcal: toNumber(item.food_record_total_kcal),
    }));
    const recordTotals = validRecords.reduce<NutritionTotals>((sum, item) => ({
      kcal: sum.kcal + toNumber(item.food_record_total_kcal),
      carb: sum.carb + toNumber(item.food_record_total_carb),
      protein: sum.protein + toNumber(item.food_record_total_protein),
      fat: sum.fat + toNumber(item.food_record_total_fat),
    }), {
      kcal: 0,
      carb: 0,
      protein: 0,
      fat: 0,
    });
    const averageKcal = recordCount > 0 ? recordTotals.kcal / recordCount : 0;
    const averageTotals: NutritionTotals = {
      kcal: Math.round(averageKcal),
      carb: recordCount > 0 ? roundToTenth(recordTotals.carb / recordCount) : 0,
      protein: recordCount > 0 ? roundToTenth(recordTotals.protein / recordCount) : 0,
      fat: recordCount > 0 ? roundToTenth(recordTotals.fat / recordCount) : 0,
    };
    const emptyKcalRecord: RecordKcalStat = {
      dateStart: ``,
      dateEnd: ``,
      kcal: 0,
    };
    const highestRecord = kcalRecords.reduce((highest, item) => (
      item.kcal > highest.kcal ? item : highest
    ), kcalRecords[0] ?? emptyKcalRecord);
    const lowestRecord = kcalRecords.reduce((lowest, item) => (
      item.kcal < lowest.kcal ? item : lowest
    ), kcalRecords[0] ?? emptyKcalRecord);
    // 3-1. 기록 기간 표시 ---------------------------------------------------------------------
    const formatRecordDate = (item: RecordKcalStat) => {
      if (!item.dateStart) {
        return `-`;
      }
      if (item.dateStart === item.dateEnd) {
        return formatDateYyMmDd(item.dateStart);
      }
      return `${formatDateYyMmDd(item.dateStart)} - ${formatDateYyMmDd(item.dateEnd)}`;
    };
    const macroTotal = averageTotals.carb + averageTotals.protein + averageTotals.fat;
    const carbPercent = macroTotal > 0 ? Math.round((averageTotals.carb / macroTotal) * 100) : 0;
    const proteinBase = macroTotal > 0 ? Math.round((averageTotals.protein / macroTotal) * 100) : 0;
    const proteinPercent = Math.min(100 - carbPercent, proteinBase);
    const fatPercent = macroTotal > 0 ? 100 - carbPercent - proteinPercent : 0;
    const chartData = macroTotal > 0 ? [
      { name: `carb`, value: averageTotals.carb, percent: carbPercent, color: chartThemeColors.carb },
      { name: `protein`, value: averageTotals.protein, percent: proteinPercent, color: chartThemeColors.protein },
      { name: `fat`, value: averageTotals.fat, percent: fatPercent, color: chartThemeColors.fat },
    ].filter((item) => item.value > 0) : [
      { name: `Empty`, value: 1, percent: 0, color: `#edf0f4` },
    ];

    return {
      recordCount,
      totalKcalText: formatNumber(recordTotals.kcal),
      averageKcalText: formatNumber(averageTotals.kcal),
      averageCarbText: formatNumber(averageTotals.carb),
      averageProteinText: formatNumber(averageTotals.protein),
      averageFatText: formatNumber(averageTotals.fat),
      highestKcalText: formatNumber(highestRecord.kcal),
      highestDateText: formatRecordDate(highestRecord),
      lowestKcalText: formatNumber(lowestRecord.kcal),
      lowestDateText: formatRecordDate(lowestRecord),
      chartData,
      carbPercent,
      proteinPercent,
      fatPercent,
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
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [FoodRecord]);
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
    URL_OBJECT, sessionId, PAGING?.sort, PAGING.page, PAGING?.part, DATE?.dateStart, DATE?.dateEnd,
  ]);

  // 7. list -----------------------------------------------------------------------------------
  const listNode = () => {
    // 7-0. summary
    const recordSummarySection = () => (
      <Grid container={true} spacing={0} className={`food-record-summary radius-3 border-light-1 shadow-1 p-15px`}>
        {/** row 1 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-left`}>
            <Div className={`food-record-period fs-0-95rem fw-600`}>
              {formatDateYyyyMmDd(DATE?.dateStart)}
              {` -`}
              {formatDateYyyyMmDd(DATE?.dateEnd)}
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />
        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={6} className={`d-row-center p-relative food-record-chart w-124px h-124px`}>
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
                <Tooltip
                  formatter={(value: any, name: any, item: any) => {
                    const payload = item?.payload;
                    const isEmpty = payload?.name === `Empty`;
                    const label = isEmpty ? translate(`record`) : translate(name as string);
                    const displayValue = isEmpty ? 0 : Number(value);
                    const unit = isEmpty ? `` : ` ${translate(`g`)}`;
                    const percent = payload?.percent ? ` (${payload.percent}%)` : ``;
                    return [ `${insertComma(displayValue)}${unit}${percent}`, label ];
                  }}
                  contentStyle={{
                    borderRadius: `8px`,
                    boxShadow: `0 6px 18px 0 rgba(15, 23, 42, 0.1)`,
                    padding: `8px`,
                    border: `1px solid #edf0f4`,
                    background: `#fff`,
                    color: `#666`,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <Div className={`food-record-chart-center`}>
              <Div className={`fs-0-55rem fw-600 dark mb-3px`}>
                {translate(`avg`)}
              </Div>
              <Div className={`fs-0-9rem fw-700 black`}>
                {recordSummary.averageKcalText}
              </Div>
              <Div className={`fs-0-5rem fw-600 dark mt-3px`}>
                {translate(`kc`)}
              </Div>
            </Div>
          </Grid>
          <Grid size={6} className={`food-record-legend p-relative d-col-center`}>
            <Div className={`d-row-between w-100p mb-5px`}>
              <Div className={`d-row-center`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.carb }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {`${translate(`avg`)} ${translate(`ca`)}`}
                </Div>
              </Div>
              <Div className={`d-row-right`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {recordSummary.averageCarbText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`g`)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between w-100p mb-5px`}>
              <Div className={`d-row-center`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.protein }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {`${translate(`avg`)} ${translate(`protein`)}`}
                </Div>
              </Div>
              <Div className={`d-row-right`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {recordSummary.averageProteinText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`g`)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between w-100p`}>
              <Div className={`d-row-center`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.fat }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {`${translate(`avg`)} ${translate(`fat`)}`}
                </Div>
              </Div>
              <Div className={`d-row-right`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`} compact={true}>
                  {recordSummary.averageFatText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`g`)}
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 3 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={`food-record-stat-grid`}>
            <Div className={`food-record-stat-card`}>
              <Div className={`food-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`totalKcal`)}
                </Div>
                <Div className={`food-record-stat-meta fs-0-55rem dark mt-3px`}>
                  {`${insertComma(recordSummary.recordCount)} ${translate(`record`)}`}
                </Div>
              </Div>
              <Div className={`d-row-right food-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.totalKcalText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`kc`)}
                </Div>
              </Div>
            </Div>
            <Div className={`food-record-stat-card`}>
              <Div className={`food-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`highestKcal`)}
                </Div>
                <Div className={`food-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.highestDateText}>
                  {recordSummary.highestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right food-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.highestKcalText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`kc`)}
                </Div>
              </Div>
            </Div>
            <Div className={`food-record-stat-card`}>
              <Div className={`food-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`lowestKcal`)}
                </Div>
                <Div className={`food-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.lowestDateText}>
                  {recordSummary.lowestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right food-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.lowestKcalText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`kc`)}
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
                        dateType: item.food_record_dateType,
                        dateStart: item.food_record_dateStart,
                        dateEnd: item.food_record_dateEnd,
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
                        {formatDateYyMmDd(item.food_record_dateStart)}
                      </Div>
                      <Div className={`fs-0-9rem fw-500 dark mr-10px`}>
                        {translate(getDayNotFmt(item.food_record_dateStart).format(`ddd`))}
                      </Div>
                      <Div className={`d-center`}>
                        <Icons
                          key={`smile3`}
                          name={(item.food_record_score_smile ?? `smile3`)}
                          isIconButton={false}
                          className={`w-16px h-16px mb-n1px`}
                        />
                      </Div>
                    </Grid>
                    <Grid size={5} className={`d-row-right`}>
                      <Div className={`d-row-center`}>
                        <Div className={`fs-0-75rem fw-700`}>
                          {insertComma(item.food_record_total_kcal ?? `0`)}
                        </Div>
                        <Div className={`fs-0-6rem fw-600 dark ml-5px`}>
                          {translate(`kc`)}
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
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.kcal }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`kcal`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.food_record_total_kcal_color}`}>
                              {insertComma(item.food_record_total_kcal ?? `0`)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
                              {translate(`kc`)}
                            </Div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Hr m={1} className={`bg-light`} />

                    {/** row 2 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.carb }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`carb`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.food_record_total_carb_color}`}>
                              {insertComma(item.food_record_total_carb ?? `0`)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
                              {translate(`g`)}
                            </Div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Hr m={1} className={`bg-light`} />

                    {/** row 3 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.protein }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`protein`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.food_record_total_protein_color}`}>
                              {insertComma(item.food_record_total_protein ?? `0`)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
                              {translate(`g`)}
                            </Div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Hr m={1} className={`bg-light`} />

                    {/** row 4 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.fat }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`fat`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.food_record_total_fat_color}`}>
                              {insertComma(item.food_record_total_fat ?? `0`)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
                              {translate(`g`)}
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
        {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={`food`} /> : listSection()}
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

  // 10. return ---------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
