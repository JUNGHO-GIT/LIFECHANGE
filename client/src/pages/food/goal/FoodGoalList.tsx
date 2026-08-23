/**
 * @file FoodGoalList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, useMemo, memo, useCallback } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { FoodGoal, FoodGoalType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { formatDateYyyyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";
import { FoodGoalChart } from "./FoodGoalChart";

// -------------------------------------------------------------------------------------------------
type NutritionTotals = {
  kcal: number;
  carb: number;
  protein: number;
  fat: number;
};

type GoalRowItem = {
  key: keyof NutritionTotals;
  actual: number;
  goal: number;
  diff: number;
  percent: number;
  color: string;
};

// -------------------------------------------------------------------------------------------------
export const FoodGoalList = memo(() => {

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
    },
  );
  const [ PAGING, setPAGING ] = useStorageLocal(
    `paging`, PATH, ``, {
      sort: `asc`,
      page: 1,
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
  const [ OBJECT, setOBJECT ] = useState<[FoodGoalType]>([FoodGoal]);
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
  // - 목표 기간의 기록 합계와 목표값 비교
  const goalSummary = useMemo(() => {
    const createEmptyTotals = (): NutritionTotals => ({
      kcal: 0,
      carb: 0,
      protein: 0,
      fat: 0,
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
      const multiplier = unit === `m` ? 1_000_000 : unit === `k` ? 1_000 : 1;
      const result = Number(numericText) * multiplier;

      return Number.isFinite(result) ? result : 0;
    };
    const roundToTenth = (value: number) => Math.round(value * 10) / 10;
    const formatNumber = (value: number) => {
      const roundedValue = Math.round(value);
      return insertComma(roundedValue);
    };
    const formatSignedNumber = (value: number) => (
      value > 0 ? `+${formatNumber(value)}` : formatNumber(value)
    );
    const calculatePercent = (actual: number, goal: number) => (
      goal > 0 ? Math.round((actual / goal) * 100) : 0
    );
    const formatPercent = (percent: number, goal: number) => (
      goal > 0 ? `${insertComma(percent)}%` : `-`
    );
    const addTotals = (
      target: NutritionTotals,
      source: NutritionTotals,
    ): NutritionTotals => {
      target.kcal += source.kcal;
      target.carb += source.carb;
      target.protein += source.protein;
      target.fat += source.fat;

      return target;
    };
    const createGoalRow = (item: GoalRowItem) => ({
      key: item.key,
      actualText: formatNumber(item.actual),
      goalText: formatNumber(item.goal),
      diffText: formatSignedNumber(item.diff),
      percentText: formatPercent(item.percent, item.goal),
      barPercent: Math.min(100, item.percent),
      color: item.color,
    });
    const validGoals = OBJECT.filter((item) => (
      item.food_goal_dateStart && item.food_goal_dateStart !== `0000-00-00`
    ));
    const recordTotals = validGoals.reduce<NutritionTotals>((sum, item) => addTotals(sum, {
      kcal: toNumber(item.food_record_total_kcal),
      carb: toNumber(item.food_record_total_carb),
      protein: toNumber(item.food_record_total_protein),
      fat: toNumber(item.food_record_total_fat),
    }), createEmptyTotals());
    const goalTotals = validGoals.reduce<NutritionTotals>((sum, item) => addTotals(sum, {
      kcal: toNumber(item.food_goal_kcal),
      carb: toNumber(item.food_goal_carb),
      protein: toNumber(item.food_goal_protein),
      fat: toNumber(item.food_goal_fat),
    }), createEmptyTotals());

    recordTotals.kcal = Math.round(recordTotals.kcal);
    recordTotals.carb = roundToTenth(recordTotals.carb);
    recordTotals.protein = roundToTenth(recordTotals.protein);
    recordTotals.fat = roundToTenth(recordTotals.fat);
    goalTotals.kcal = Math.round(goalTotals.kcal);
    goalTotals.carb = roundToTenth(goalTotals.carb);
    goalTotals.protein = roundToTenth(goalTotals.protein);
    goalTotals.fat = roundToTenth(goalTotals.fat);

    const differences: NutritionTotals = {
      kcal: recordTotals.kcal - goalTotals.kcal,
      carb: roundToTenth(recordTotals.carb - goalTotals.carb),
      protein: roundToTenth(recordTotals.protein - goalTotals.protein),
      fat: roundToTenth(recordTotals.fat - goalTotals.fat),
    };
    const goalPercents = {
      kcal: calculatePercent(recordTotals.kcal, goalTotals.kcal),
      carb: calculatePercent(recordTotals.carb, goalTotals.carb),
      protein: calculatePercent(recordTotals.protein, goalTotals.protein),
      fat: calculatePercent(recordTotals.fat, goalTotals.fat),
    };
    const macroTotal = recordTotals.carb + recordTotals.protein + recordTotals.fat;
    const carbPercent = macroTotal > 0 ? Math.round((recordTotals.carb / macroTotal) * 100) : 0;
    const proteinBase = macroTotal > 0 ? Math.round((recordTotals.protein / macroTotal) * 100) : 0;
    const proteinPercent = Math.min(100 - carbPercent, proteinBase);
    const fatPercent = macroTotal > 0 ? 100 - carbPercent - proteinPercent : 0;
    const chartData = macroTotal > 0 ? [
      { name: `carb`, value: recordTotals.carb, percent: carbPercent, color: chartThemeColors.carb },
      { name: `protein`, value: recordTotals.protein, percent: proteinPercent, color: chartThemeColors.protein },
      { name: `fat`, value: recordTotals.fat, percent: fatPercent, color: chartThemeColors.fat },
    ].filter((item) => item.value > 0) : [
      { name: `Empty`, value: 1, percent: 0, color: `#edf0f4` },
    ];
    const goalRowItems: GoalRowItem[] = [
      {
        key: `kcal`,
        actual: recordTotals.kcal,
        goal: goalTotals.kcal,
        diff: differences.kcal,
        percent: goalPercents.kcal,
        color: chartThemeColors.kcal,
      },
      {
        key: `carb`,
        actual: recordTotals.carb,
        goal: goalTotals.carb,
        diff: differences.carb,
        percent: goalPercents.carb,
        color: chartThemeColors.carb,
      },
      {
        key: `protein`,
        actual: recordTotals.protein,
        goal: goalTotals.protein,
        diff: differences.protein,
        percent: goalPercents.protein,
        color: chartThemeColors.protein,
      },
      {
        key: `fat`,
        actual: recordTotals.fat,
        goal: goalTotals.fat,
        diff: differences.fat,
        percent: goalPercents.fat,
        color: chartThemeColors.fat,
      },
    ];

    return {
      totalCarbText: formatNumber(recordTotals.carb),
      totalProteinText: formatNumber(recordTotals.protein),
      totalFatText: formatNumber(recordTotals.fat),
      chartData,
      carbPercent,
      proteinPercent,
      fatPercent,
      goalRows: goalRowItems.map(createGoalRow),
    };
  }, [OBJECT, chartThemeColors]);

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
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [FoodGoal]);
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
            <FoodGoalChart DATE={DATE} />
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
        <Grid container={true} spacing={0} key={item._id || `food-goal-${i}`}>
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
                      dateType: item.food_goal_dateType,
                      dateStart: item.food_goal_dateStart,
                      dateEnd: item.food_goal_dateEnd,
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
                      {item.food_goal_dateStart?.slice(5, 10)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.food_goal_dateStart).format(`ddd`))}
                    </Div>
                    <Div className={`fs-0-8rem fw-500 dark ml-5px mr-5px`}>
                      {`-`}
                    </Div>
                    <Div className={`fs-0-8rem fw-600 black`}>
                      {item.food_goal_dateEnd?.slice(5, 10)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.food_goal_dateEnd).format(`ddd`))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container={true} spacing={1} className={`legend`}>

                  {/** row 1 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.kcal }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`kcal`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_kcal_color}`}>
                            {insertComma(item.food_goal_kcal ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`kc`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_kcal_color}`}>
                            {insertComma(item.food_record_total_kcal ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`kc`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_diff_kcal_color}`}>
                            {insertComma(item.food_record_diff_kcal ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`kc`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 2 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.carb }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`carb`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_carb_color}`}>
                            {insertComma(item.food_goal_carb ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_carb_color}`}>
                            {insertComma(item.food_record_total_carb ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_diff_carb_color}`}>
                            {insertComma(item.food_record_diff_carb ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 3 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.protein }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`protein`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_protein_color}`}>
                            {insertComma(item.food_goal_protein ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_protein_color}`}>
                            {insertComma(item.food_record_total_protein ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_diff_protein_color}`}>
                            {insertComma(item.food_record_diff_protein ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 4 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.fat }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`fat`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.food_goal_fat_color}`}>
                            {insertComma(item.food_goal_fat ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_fat_color}`}>
                            {insertComma(item.food_record_total_fat ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(`g`)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_diff_fat_color}`}>
                            {insertComma(item.food_record_diff_fat ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
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
      ))
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-2 border-light-1 shadow-1 h-min-75vh`}>
        {summarySection()}
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

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
