/**
 * @file MoneyRecordList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useMemo, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate } from "@exportHooks";
import { useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { MoneyRecord, MoneyRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { PieChart, Pie, Cell, ResponsiveContainer } from "@exportLibs";
import { formatDateMmDd, formatDateYyyyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

declare interface MoneyAmountStat {
  dateStart: string;
  dateEnd: string;
  amount: number;
}

// ---------------------------------------------------------------------------------------------
export const MoneyRecordList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, PATH, sessionId, localCurrency, toDetail,
    navigate, location_dateType, location_dateStart, location_dateEnd, chartThemeColors,
  } = useCommonValue();
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
  const [ OBJECT, setOBJECT ] = useState<[MoneyRecordType]>([MoneyRecord]);
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
  // 목록 항목 렌더를 비긴급으로 분리: 전환·데이터 반영 시 화면 틀이 먼저 그려지고 목록은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);

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
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [MoneyRecord]);
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

  // 3. summary ----------------------------------------------------------------------------------
  // - 선택 기간의 자산 흐름과 최고·최저 지출 계산
  const recordSummary = useMemo(() => {
    // 쉼표와 k/m 단위를 일반 숫자로 변환
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

    // 금액을 화면 표시용 천 단위 또는 k 단위로 변환
    const formatNumber = (value: number): string => {
      const roundedValue = Math.round(value);
      return Math.abs(roundedValue) >= 100_000
      ? `${Math.round(roundedValue / 1_000)}k`
      : insertComma(roundedValue);
    };

    const formatRecordDate = (item: MoneyAmountStat): string => (
      item.dateStart && item.dateStart !== `0000-00-00`
        ? `${formatDateYyyyMmDd(item.dateStart)} - ${formatDateYyyyMmDd(item.dateEnd)}`
        : `-`
    );

    const validRecords = OBJECT.filter((item) => Boolean(item._id));
    const totalIncome = validRecords.reduce((sum, item) => (
      sum + toNumber(item.money_record_total_income)
    ), 0);
    const totalExpense = validRecords.reduce((sum, item) => (
      sum + toNumber(item.money_record_total_expense)
    ), 0);
    const expenseStats = validRecords
    .map((item) => ({
      dateStart: item.money_record_dateStart,
      dateEnd: item.money_record_dateEnd,
      amount: toNumber(item.money_record_total_expense),
    }))
    .filter((item) => item.amount > 0);
    const emptyExpense: MoneyAmountStat = {
      dateStart: ``,
      dateEnd: ``,
      amount: 0,
    };
    const highestExpense = expenseStats.reduce((highest, item) => (
      item.amount > highest.amount ? item : highest
    ), emptyExpense);
    const lowestExpense = expenseStats.reduce((lowest, item) => (
      item.amount < lowest.amount ? item : lowest
    ), expenseStats[0] ?? emptyExpense);
    // 수입·지출 구성 비율 계산
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
      recordCnt: COUNT.totalCnt,
      highestExpenseText: formatNumber(highestExpense.amount),
      highestDateText: formatRecordDate(highestExpense),
      lowestExpenseText: formatNumber(lowestExpense.amount),
      lowestDateText: formatRecordDate(lowestExpense),
      incomePercent,
      expensePercent,
      chartData,
    };
  }, [ OBJECT, COUNT.totalCnt, chartThemeColors ]);

  // 7. list -----------------------------------------------------------------------------------
  const listNode = () => {
    // 7-0. summary
    const summarySection = () => (
      <Grid container={true} spacing={0} className={`money-record-summary radius-3 border-light-1 shadow-1 p-15px`}>
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
          <Grid size={6} className={`d-row-center p-relative money-record-chart w-124px h-124px`}>
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
            <Div className={`money-record-chart-center`}>
              <Div className={`fs-0-5rem fw-700 mb-5px`} style={{
                color: chartThemeColors.income,
                lineHeight: `1.15`
              }}>
                {`수입 ${recordSummary.incomePercent}%`}
              </Div>
              <Div className={`fs-0-5rem fw-700`} style={{
                color: chartThemeColors.expense,
                lineHeight: `1.15`
              }}>
                {`지출 ${recordSummary.expensePercent}%`}
              </Div>
            </Div>
          </Grid>

          <Grid size={6} className={`money-record-legend p-relative d-col-center`}>
            <Div className={`d-row-between mb-5px w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.income }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`income`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`}>
                  {recordSummary.totalIncomeText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(localCurrency)}
                </Div>
              </Div>
            </Div>
            <Div className={`d-row-between w-100p`}>
              <Div className={`d-row-center mb-5px`}>
                <Div className={`fs-0-6rem mr-3px`} style={{ color: chartThemeColors.expense }}>
                  {`●`}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(`expense`)}
                </Div>
              </Div>
              <Div className={`d-row-right mb-5px`}>
                <Div className={`fs-0-7rem fw-600 black mr-5px`}>
                  {recordSummary.totalExpenseText}
                </Div>
                <Div className={`fs-0-6rem fw-600 dark`}>
                  {translate(localCurrency)}
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 3 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={`money-record-stat-grid`}>
            <Div className={`money-record-stat-card`}>
              <Div className={`money-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`maxExpense`)}
                </Div>
                <Div className={`money-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.highestDateText}>
                  {recordSummary.highestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right money-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.highestExpenseText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(localCurrency)}
                </Div>
              </Div>
            </Div>
            <Div className={`money-record-stat-card`}>
              <Div className={`money-record-stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`minExpense`)}
                </Div>
                <Div className={`money-record-stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.lowestDateText}>
                  {recordSummary.lowestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right money-record-stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.lowestExpenseText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(localCurrency)}
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
                        dateType: item.money_record_dateType,
                        dateStart: item.money_record_dateStart,
                        dateEnd: item.money_record_dateEnd,
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
                        {formatDateMmDd(item.money_record_dateStart)}
                      </Div>
                      <Div className={`fs-0-9rem fw-500 dark mr-5px`}>
                        {translate(getDayNotFmt(item.money_record_dateStart).format(`ddd`))}
                      </Div>
                      <Div className={`d-center`}>
                        <Icons
                          name={(item.money_record_score_smile ?? `smile3`)}
                          className={`w-14px h-14px`}
                          sx={{ padding: 0 }}
                        />
                      </Div>
                    </Grid>
                    <Grid size={5} className={`d-row-right`}>
                      <Div className={`d-row-center`}>
                        <Div className={`fs-0-75rem fw-700`}>
                          {insertComma(item.money_record_total_expense ?? `0`)}
                        </Div>
                        <Div className={`fs-0-6rem fw-600 dark ml-5px`}>
                          {translate(localCurrency)}
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
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.income }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`income`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.money_record_total_income_color}`}>
                              {insertComma(item.money_record_total_income ?? `0`)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
                              {translate(localCurrency)}
                            </Div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Hr m={1} className={`bg-light`} />

                    {/** row 2 * */}
                    <Grid container={true} spacing={1}>
                      <Grid size={2} className={`d-center`}>
                        <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.expense }}>
                          {`●`}
                        </Div>
                      </Grid>
                      <Grid size={3} className={`d-row-left`}>
                        <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                          {translate(`expense`)}
                        </Div>
                      </Grid>
                      <Grid size={7}>
                        <Grid container={true} spacing={1}>
                          <Grid size={10} className={`d-row-right`}>
                            <Div className={`fs-0-8rem fw-600 ${item.money_record_total_expense_color}`}>
                              {insertComma(item.money_record_total_expense ?? `0`)}
                            </Div>
                          </Grid>
                          <Grid size={2} className={`d-row-center`}>
                            <Div className={`fs-0-6rem`}>
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
        ))}
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
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
