/**
 * @file MoneyGoalList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { MoneyGoal, MoneyGoalType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { formatDateMmDd, formatDateYyyyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";
import { MoneyGoalChart } from "./MoneyGoalChart";

// -------------------------------------------------------------------------------------------------
declare interface MoneyGoalSource {
  key: `income` | `expense`;
  actual: number;
  goal: number;
  color: string;
}

declare interface MoneyGoalRow extends MoneyGoalSource {
  actualText: string;
  goalText: string;
  diffText: string;
  percent: number;
  percentText: string;
  barPercent: number;
}

// -------------------------------------------------------------------------------------------------
export const MoneyGoalList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, sessionId, localCurrency, toDetail,
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
  const [ OBJECT, setOBJECT ] = useState<[MoneyGoalType]>([MoneyGoal]);
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
  // - 선택 기간의 자산 목표와 기록 달성 현황 계산
  const goalSummary = useMemo(() => {
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
    const formatNumber = (value: number): string => {
      const roundedValue = Math.round(value);
      return insertComma(roundedValue);
    };
    const formatSignedNumber = (value: number): string => (
      value > 0 ? `+${formatNumber(value)}` : formatNumber(value)
    );
    const calcIncomePercent = (actual: number, goal: number): number => (
      goal > 0 ? Math.round((actual / goal) * 100) : 0
    );
    const calcExpensePercent = (actual: number, goal: number): number => {
      if (goal <= 0) {
        return 0;
      }

      return actual <= goal ? 100 : Math.round((goal / actual) * 100);
    };
    const formatPercent = (percent: number, goal: number): string => (
      goal > 0 ? `${insertComma(percent)}%` : `-`
    );
    const validGoals = OBJECT.filter((item) => (
      item.money_goal_dateStart && item.money_goal_dateStart !== `0000-00-00`
    ));
    const totalIncome = validGoals.reduce((sum, item) => (
      sum + toNumber(item.money_record_total_income)
    ), 0);
    const totalExpense = validGoals.reduce((sum, item) => (
      sum + toNumber(item.money_record_total_expense)
    ), 0);
    const goalIncome = validGoals.reduce((sum, item) => (
      sum + toNumber(item.money_goal_income)
    ), 0);
    const goalExpense = validGoals.reduce((sum, item) => (
      sum + toNumber(item.money_goal_expense)
    ), 0);
    const goalSources: MoneyGoalSource[] = [
      {
        key: `income`,
        actual: totalIncome,
        goal: goalIncome,
        color: chartThemeColors.income,
      },
      {
        key: `expense`,
        actual: totalExpense,
        goal: goalExpense,
        color: chartThemeColors.expense,
      },
    ];
    const goalRows: MoneyGoalRow[] = goalSources.map((row) => {
      const percent = row.key === `expense`
        ? calcExpensePercent(row.actual, row.goal)
        : calcIncomePercent(row.actual, row.goal);

      return {
        ...row,
        actualText: formatNumber(row.actual),
        goalText: formatNumber(row.goal),
        diffText: formatSignedNumber(row.actual - row.goal),
        percent,
        percentText: formatPercent(percent, row.goal),
        barPercent: Math.min(100, percent),
      };
    });
    const incomeExpenseTotal = totalIncome + totalExpense;
    const incomePercent = incomeExpenseTotal > 0
      ? Math.round((totalIncome / incomeExpenseTotal) * 100)
      : 0;
    const expensePercent = incomeExpenseTotal > 0
      ? 100 - incomePercent
      : 0;
    const chartData = incomeExpenseTotal > 0
      ? [
        { name: `income`, value: totalIncome, percent: incomePercent, color: chartThemeColors.income },
        { name: `expense`, value: totalExpense, percent: expensePercent, color: chartThemeColors.expense },
      ].filter((item) => item.value > 0)
      : [
        { name: `Empty`, value: 1, percent: 0, color: `#edf0f4` },
      ];

    return {
      totalIncomeText: formatNumber(totalIncome),
      totalExpenseText: formatNumber(totalExpense),
      incomePercent,
      expensePercent,
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
      setLOADING(false);
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [MoneyGoal]);
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
    const summarySection = () => (
      <Grid container={true} spacing={0} className={`summary radius-3 border-light-1 shadow-1 p-15px`}>
        {/** row 1 **/}
        <Grid container={true} spacing={0}>
          <Grid size={12} className={`d-row-left`}>
            <Div className={`period fs-0-95rem fw-600`}>
              {formatDateYyyyMmDd(DATE?.dateStart)}
              {` -`}
              {formatDateYyyyMmDd(DATE?.dateEnd)}
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 2 **/}
        <Grid container={true} spacing={0}>
          <MoneyGoalChart />
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
                    {` ${translate(localCurrency)}`}
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
        <Grid container={true} spacing={0} key={item._id || `money-goal-${i}`}>
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
                      dateType: item.money_goal_dateType,
                      dateStart: item.money_goal_dateStart,
                      dateEnd: item.money_goal_dateEnd,
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
                      {formatDateMmDd(item.money_goal_dateStart)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.money_goal_dateStart).format(`ddd`))}
                    </Div>
                    <Div className={`fs-0-8rem fw-500 dark ml-5px mr-5px`}>
                      {`-`}
                    </Div>
                    <Div className={`fs-0-8rem fw-600 black`}>
                      {formatDateMmDd(item.money_goal_dateEnd)}
                    </Div>
                    <Div className={`fs-0-9rem fw-500 dark ml-5px`}>
                      {translate(getDayNotFmt(item.money_goal_dateEnd).format(`ddd`))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container={true} spacing={1} className={`legend`}>

                  {/** row 1 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.income }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`income`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.money_goal_income_color}`}>
                            {insertComma(item.money_goal_income ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(localCurrency)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.money_record_total_income_color}`}>
                            {insertComma(item.money_record_total_income ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(localCurrency)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.money_record_diff_income_color}`}>
                            {insertComma(item.money_record_diff_income ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(localCurrency)}
                          </Div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Hr m={1} className={`bg-light`} />

                  {/** row 2 * */}
                  <Grid container={true} spacing={1}>
                    <Grid size={1} className={`d-row-left`}>
                      <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.expense }}>
                        {`●`}
                      </Div>
                    </Grid>
                    <Grid size={4} className={`d-row-left`}>
                      <Div className={`fs-0-8rem fw-600 dark`}>
                        {translate(`expense`)}
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
                          <Div className={`fs-0-8rem fw-600 ${item.money_goal_expense_color}`}>
                            {insertComma(item.money_goal_expense ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(localCurrency)}
                          </Div>
                        </Grid>
                        {/** record * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`record`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.money_record_total_expense_color}`}>
                            {insertComma(item.money_record_total_expense ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(localCurrency)}
                          </Div>
                        </Grid>
                        {/** diff * */}
                        <Grid size={4} className={`d-row-center`}>
                          <Div className={`fs-0-7rem fw-500 dark`}>
                            {translate(`diff`)}
                          </Div>
                        </Grid>
                        <Grid size={6} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.money_record_diff_expense_color}`}>
                            {insertComma(item.money_record_diff_expense ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-center`}>
                          <Div className={`fs-0-55rem fw-600 dark`}>
                            {translate(localCurrency)}
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
        {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={`money`} /> : listSection()}
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
