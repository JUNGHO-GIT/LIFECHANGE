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
import { formatDateYyyyMmDd, formatDateYyMmDd, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Icons, Paper, Grid } from "@exportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";
import { FoodRecordChart } from "./FoodRecordChart";

// ----------------------------------------------------------------------------------------------
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
  // - 기록 기간의 칼로리 범위 요약
  const recordSummary = useMemo(() => {
    const toNumber = (value?: string | number | null) => {
      const result = Number(String(value ?? `0`).replaceAll(`,`, ``));
      return Number.isFinite(result) ? result : 0;
    };
    const formatNumber = (value: number) => insertComma(Math.round(value));
    const validRecords = OBJECT.filter((item) => (
      item.food_record_dateStart && item.food_record_dateStart !== `0000-00-00`
    ));
    const kcalRecords: RecordKcalStat[] = validRecords.map((item) => ({
      dateStart: item.food_record_dateStart,
      dateEnd: item.food_record_dateEnd,
      kcal: toNumber(item.food_record_total_kcal),
    }));
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

    // 3-2. 평균 칼로리 ------------------------------------------------------------------
    const averageKcal: number = kcalRecords.length > 0
      ? kcalRecords.reduce((sum, item) => sum + item.kcal, 0) / kcalRecords.length
      : 0;

    return {
      highestKcalText: formatNumber(highestRecord.kcal),
      highestDateText: formatRecordDate(highestRecord),
      lowestKcalText: formatNumber(lowestRecord.kcal),
      lowestDateText: formatRecordDate(lowestRecord),
      averageKcalText: formatNumber(averageKcal),
      averageCountText: kcalRecords.length > 0 ? `${kcalRecords.length}` : `-`,
    };
  }, [OBJECT]);

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
    URL_OBJECT, sessionId, PAGING?.sort, PAGING.page, PAGING?.part, DATE?.dateStart, DATE?.dateEnd,
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
            <FoodRecordChart DATE={DATE} />
          </Grid>
        </Grid>

        <Hr m={20} className={`bg-light`} />

        {/** row 3 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12} className={`stat-grid`}>
            {/** 최고 칼로리 **/}
            <Div className={`stat-card`}>
              <Div className={`stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`highestKcal`)}
                </Div>
                <Div className={`stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.highestDateText}>
                  {recordSummary.highestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.highestKcalText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`kc`)}
                </Div>
              </Div>
            </Div>
            {/** 최저 칼로리 **/}
            <Div className={`stat-card`}>
              <Div className={`stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`lowestKcal`)}
                </Div>
                <Div className={`stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.lowestDateText}>
                  {recordSummary.lowestDateText}
                </Div>
              </Div>
              <Div className={`d-row-right stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.lowestKcalText}
                </Div>
                <Div className={`fs-0-55rem fw-600 dark`}>
                  {translate(`kc`)}
                </Div>
              </Div>
            </Div>
            {/** 평균 칼로리 **/}
            <Div className={`stat-card`}>
              <Div className={`stat-label`}>
                <Div className={`fs-0-65rem fw-600 dark`}>
                  {translate(`avgKcal`)}
                </Div>
                <Div className={`stat-meta fs-0-55rem dark mt-3px`} title={recordSummary.averageCountText}>
                  {recordSummary.averageCountText === `-`
                    ? `-`
                    : `${recordSummary.averageCountText} ${translate(`count`)}`}
                </Div>
              </Div>
              <Div className={`d-row-right stat-value`}>
                <Div className={`fs-0-85rem fw-700 mr-4px`} compact={false}>
                  {recordSummary.averageKcalText}
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
      deferredObject?.map((item, i) => (
        <Grid container={true} spacing={0} key={item._id || `food-record-${i}`}>
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
                      isIconButton={false}
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
                      <Div className={`fs-0-55rem fw-600 dark ml-5px`}>
                        {translate(`kc`)}
                      </Div>
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
                        <Grid size={10} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_kcal_color}`}>
                            {insertComma(item.food_record_total_kcal ?? `0`)}
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
                        <Grid size={10} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_carb_color}`}>
                            {insertComma(item.food_record_total_carb ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-right`}>
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
                        <Grid size={10} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_protein_color}`}>
                            {insertComma(item.food_record_total_protein ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-right`}>
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
                        <Grid size={10} className={`d-row-right`}>
                          <Div className={`fs-0-8rem fw-600 ${item.food_record_total_fat_color}`}>
                            {insertComma(item.food_record_total_fat ?? `0`)}
                          </Div>
                        </Grid>
                        <Grid size={2} className={`d-row-right`}>
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

  // 10. return ---------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
