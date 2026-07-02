/**
 * @file MoneyRecordDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, useState, useEffect, useRef, useCallback, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useValidateMoney } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { MoneyRecord, MoneyRecordType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { insertComma, sync, handleNumberInput } from "@exportScripts";
import { Footer, Dialog } from "@exportLayouts";
import { PickerDay, Memo, Count, Delete, Select, Input } from "@exportContainers";
import { Icons, Img, Bg, Div, Paper, Grid, Br } from "@exportComponents";
import { Checkbox, MenuItem } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyRecordDetail = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const {
    URL_OBJECT, navigate, sessionId, localCurrency, moneyArray,
    toList, bgColors, location_dateStart, location_dateEnd, chartThemeColors,
  } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { ERRORS, REFS, validate } = useValidateMoney();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-2. useState -------------------------------------------------------------------------------
  const [ LOCKED, setLOCKED ] = useState<string>(`unlocked`);
  const [ OBJECT, setOBJECT ] = useState<MoneyRecordType>(MoneyRecord);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ FLOW, setFLOW ] = useState({
    theme: `money`,
    exist: false,
    itsMe: false,
    itsNew: false,
  });
  const [ SEND, setSEND ] = useState({
    id: ``,
    dateType: ``,
    dateStart: `0000-00-00`,
    dateEnd: `0000-00-00`,
  });
  const [ COUNT, setCOUNT ] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0,
  });
  const [ DATE, setDATE ] = useState({
    dateType: `day`,
    dateStart: location_dateStart ?? getDayFmt(),
    dateEnd: location_dateEnd ?? getDayFmt(),
  });

  // 2-2. useDeferredValue ----------------------------------------------------------------------
  // 섹션 항목 렌더를 비긴급으로 분리: 진입 시 화면 틀이 먼저 그려지고 상세 항목은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);

  // 2-3. useRef --------------------------------------------------------------------------------
  const objectRef: React.RefObject<
    MoneyRecordType
  > = useRef(OBJECT);
  const countRef: React.RefObject<{
    totalCnt: number;
    sectionCnt: number;
    newSectionCnt: number;
  }> = useRef(COUNT);
  const dateRef: React.RefObject<{
    dateType: string;
    dateStart: string;
    dateEnd: string;
  }> = useRef(DATE);

  // 2-3. useEffect ------------------------------------------------------------------------------
  useEffect(() => {
    COUNT !== countRef.current && (countRef.current = COUNT);
    OBJECT !== objectRef.current && (objectRef.current = OBJECT);
    DATE !== dateRef.current && (dateRef.current = DATE);
  }, [ COUNT, OBJECT, DATE ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE?.dateType as keyof typeof EXIST]?.length > 0) {

      const dateRange: string = (
        `${DATE?.dateStart.trim()} - ${DATE?.dateEnd.trim()}`
      );
      const objectRange: string = (
        `${OBJECT.money_record_dateStart.trim()} - ${OBJECT.money_record_dateEnd.trim()}`
      );
      const isExist: boolean = (
        EXIST?.[DATE?.dateType as keyof typeof EXIST]?.includes(dateRange)
      );
      const itsMe: boolean = (
        dateRange === objectRange
      );
      const itsNew: boolean = (
        OBJECT.money_record_dateStart === `0000-00-00` &&
				OBJECT.money_record_dateEnd === `0000-00-00`
      );

      setFLOW((prev) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew,
      }));
    }
  }, [ EXIST, DATE?.dateEnd, OBJECT.money_record_dateEnd ]);

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
    if (LOCKED === `locked`) {
      setLOADING(false);
      return;
    }
    axios.get(`${URL_OBJECT}/record/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result ?? MoneyRecord);

      res.data.sectionCnt <= 0 && setOBJECT((prev) => ({
        ...prev,
        money_section: [],
      }));

      res.data.sectionCnt > 0 && setOBJECT((prev) => ({
        ...prev,
        money_section: prev.money_section?.sort((a: any, b: any) => (
          moneyArray.findIndex((item: any) => item.money_record_part === a.money_record_part) -
					moneyArray.findIndex((item: any) => item.money_record_part === b.money_record_part)
        )),
      }));

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ?? 0,
        sectionCnt: res.data.sectionCnt ?? 0,
        newSectionCnt: res.data.sectionCnt ?? 0,
      }));
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
  }, [ URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.money_section.reduce((acc: any, cur: any) => {
      // 미래예정(scheduled === "Y" && scheduled_done === "N")은 실적이 아니므로 합산에서 제외
      const isFutureScheduled: boolean = (
        cur.money_record_scheduled === `Y` && cur.money_record_scheduled_done === `N`
      );
      if (isFutureScheduled) {
        return acc;
      }
      return {
        totalIncome: Number(acc.totalIncome) +
				(cur.money_record_part === `income` ? Number(cur.money_record_amount) : 0),

        totalExpense: Number(acc.totalExpense) +
				(cur.money_record_part === `expense` ? Number(cur.money_record_amount) : 0),
      };
    }, {
      totalIncome: 0,
      totalExpense: 0,
    });

    setOBJECT((prev) => ({
      ...prev,
      money_record_total_income: Number(totals.totalIncome).toString(),
      money_record_total_expense: Number(totals.totalExpense).toString(),
    }));
  }, [OBJECT?.money_section]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection: any = {
      money_record_part: moneyArray[1]?.money_record_part ?? ``,
      money_record_title: moneyArray[0]?.money_record_title?.[0] ?? ``,
      money_record_amount: `0`,
      money_record_content: ``,
      money_record_include: `Y`,
      money_record_scheduled: `N`,
      money_record_scheduled_date: ``,
      money_record_scheduled_done: `N`,
    };
    const updatedSection: any[] = Array.from({ length: COUNT?.newSectionCnt }).fill(null).map((_item: any, idx: number) => {
      return idx < OBJECT?.money_section?.length ? OBJECT?.money_section[idx] : defaultSection;
    });
    setOBJECT((prev) => ({
      ...prev,
      money_section: updatedSection,
    }));

  }, [COUNT?.newSectionCnt]);

  // 3. flow ------------------------------------------------------------------------------------
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(objectRef.current, countRef.current, `record`)) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === `create` ? `post` : `put`,
      url: type === `create` ? `${URL_OBJECT}/record/create` : `${URL_OBJECT}/record/update`,
      data: {
        user_id: sessionId,
        OBJECT: objectRef.current,
        DATE: dateRef.current,
        type: type,
      },
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `success`,
        });
        void navigate(toList, {
          state: {
            dateType: ``,
            dateStart: DATE?.dateStart,
            dateEnd: DATE?.dateEnd,
          },
        });
        void sync(`property`);
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      }
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
      console.error(error);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ------------------------------------------------------------------------------------
  const flowDelete = async () => {
    setLOADING(true);
    if (!await validate(objectRef.current, countRef.current, `delete`)) {
      setLOADING(false);
      return;
    }
    axios({
      method: `delete`,
      url: `${URL_OBJECT}/record/delete`,
      data: {
        user_id: sessionId,
        DATE: dateRef.current,
      },
    })
    .then((res: any) => {
      if (res.data.status === `success`) {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `success`,
        });
        void navigate(toList, {
          state: {
            dateType: ``,
            dateStart: dateRef.current.dateStart,
            dateEnd: dateRef.current.dateEnd,
          },
        });
        void sync(`property`);
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      }
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
      console.error(error);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-3. handle --------------------------------------------------------------------------------
  const handleDelete = useCallback((index: number) => {
    setOBJECT((prev) => ({
      ...prev,
      money_section: (prev.money_section ?? []).filter((_item: any, idx: number) => (idx !== index)),
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  }, []);

  // 7. detail ----------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Grid container={true} spacing={2} className={`radius-3 border-light-1 shadow-1 p-20px`}>
        <Grid size={12}>
          <PickerDay
            DATE={DATE}
            setDATE={setDATE}
            EXIST={EXIST}
          />
        </Grid>
        <Grid size={12}>
          <Count
            COUNT={COUNT}
            setCOUNT={setCOUNT}
            LOCKED={LOCKED}
            setLOCKED={setLOCKED}
            limit={10}
          />
        </Grid>
      </Grid>
    );
    // 7-2. total
    const totalSection = () => (
      <Grid container={true} spacing={2} className={`radius-3 border-light-1 shadow-1 p-20px`}>
        {/** row 1 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalIncome`)}
              value={insertComma(OBJECT?.money_record_total_income ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.income }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                localCurrency
              }
            />
          </Grid>
        </Grid>

        {/** row 2 * */}
        <Grid container={true} spacing={1}>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              readOnly={true}
              label={translate(`totalExpense`)}
              value={insertComma(OBJECT?.money_record_total_expense ?? `0`)}
              startadornment={(
                <Div className={`fs-0-6rem`} style={{ color: chartThemeColors.expense }}>
                  {`●`}
                </Div>
              )}
              endadornment={
                localCurrency
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => (
      <>
        {deferredObject.money_section?.map((item, i) => {
          // money_record_title을 위한 현재 part의 데이터를 찾기
          const currentPartData: any = moneyArray.find((f: any) => f.money_record_part === item?.money_record_part);
          const partIndex: number = moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part);

          return (
            <Grid
              container={true}
              spacing={2}
              key={`detail-${item.money_record_part}-${item.money_record_title}-${item.money_record_amount}-${item.money_record_content}-${item.money_record_include}-${item.money_record_scheduled_date}`}
              className={`${LOCKED === `locked` ? `locked` : ``} radius-3 border-light-1 shadow-1 p-20px`}
            >
              {/** row 1 * */}
              <Grid container={true} spacing={1}>
                <Grid size={6} className={`d-row-left`}>
                  <Bg
                    badgeContent={i + 1}
                    bgcolor={bgColors?.[partIndex]}
                  />
                </Grid>
                <Grid size={6} className={`d-row-right`}>
                  <Delete
                    index={i}
                    handleDelete={handleDelete}
                    LOCKED={LOCKED}
                  />
                </Grid>
              </Grid>

              {/** row 2 * */}
              <Grid container={true} spacing={1}>
                <Grid size={6}>
                  <Select
                    locked={LOCKED}
                    label={translate(`part`)}
                    value={item?.money_record_part ?? ``}
                    inputRef={REFS?.[i]?.money_record_part}
                    error={ERRORS?.[i]?.money_record_part}
                    onChange={(e: any) => {
                      const value: string = String(e.target.value ?? ``);
                      const targetPartData = moneyArray.find((f: any) => f.money_record_part === value);
                      setOBJECT((prev) => ({
                        ...prev,
                        money_section: prev.money_section?.map((section: any, idx: number) => (
												idx === i ? {
												  ...section,
												  money_record_part: value,
												  money_record_title: targetPartData?.money_record_title?.[0] ?? ``,
												} : section
                        )),
                      }));
                    }}
                  >
                    {moneyArray.map((part: any, idx: number) => (
                      <MenuItem
                        key={part.money_record_part}
                        value={part.money_record_part}
                        className={`fs-0-8rem`}
                      >
                        {translate(part.money_record_part as string)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid size={6}>
                  <Select
                    locked={LOCKED}
                    label={translate(`title`)}
                    value={item?.money_record_title ?? ``}
                    inputRef={REFS?.[i]?.money_record_title}
                    error={ERRORS?.[i]?.money_record_title}
                    onChange={(e: any) => {
                      const value: string = String(e.target.value ?? ``);
                      setOBJECT((prev) => ({
                        ...prev,
                        money_section: prev.money_section?.map((section: any, idx: number) => (
                          idx === i ? {
                            ...section,
                            money_record_title: value,
                          } : section
                        )),
                      }));
                    }}
                  >
                    {(currentPartData?.money_record_title ?? []).map((title: any, idx: number) => (
                      <MenuItem
                        key={title}
                        value={title}
                        className={`fs-0-8rem`}
                      >
                        {translate(title as string)}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              {/** row 3 * */}
              <Grid container={true} spacing={1}>
                <Grid size={12}>
                  <Input
                    locked={LOCKED}
                    label={translate(`amount`)}
                    value={insertComma(item?.money_record_amount ?? `0`)}
                    inputRef={REFS?.[i]?.money_record_amount}
                    error={ERRORS?.[i]?.money_record_amount}
                    startadornment={(
                      <Div className={`fs-0-6rem`} style={{ color: bgColors?.[partIndex] ?? chartThemeColors.expense }}>
                        {`●`}
                      </Div>
                    )}
                    endadornment={
                      localCurrency
                    }
                    onChange={(e: any) => {
                      const processedValue: string | null = handleNumberInput(e.target?.value, 999_999_999);
                      if (processedValue === null) {
                      return;
                    }
                      const value: string = processedValue ?? `0`;
                      setOBJECT((prev) => ({
                        ...prev,
                        money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
													  ...section,
													  money_record_amount: value,
													} : section
                        )),
                      }));
                    }}
                  />
                </Grid>
              </Grid>

              {/** row 4 * */}
              <Grid container={true} spacing={1}>
                <Grid size={{ xs: 7, sm: 8 }} className={`d-center`}>
                  <Memo
                    OBJECT={OBJECT}
                    setOBJECT={setOBJECT}
                    LOCKED={LOCKED}
                    extra={`money_record_content`}
                    i={i}
                  />
                </Grid>
                <Grid size={{ xs: 5, sm: 4 }} className={`d-center`}>
                  <Div className={`fs-0-7rem fw-500 dark ml-10px`}>
                    {translate(`includeProperty`)}
                  </Div>
                  <Checkbox
                    size={`small`}
                    className={`p-0px ml-5px`}
                    checked={item?.money_record_include === `Y`}
                    disabled={LOCKED === `locked`}
                    onChange={(e: any) => {
                      setOBJECT((prev) => ({
                        ...prev,
                        money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
													  ...section,
													  money_record_include: e.target.checked ? `Y` : `N`,
													} : section
                        )),
                      }));
                    }}
                  />
                </Grid>
              </Grid>

              {/** row 5 * */}
              <Grid container={true} spacing={1}>
                <Grid size={{ xs: 5, sm: 4 }} className={`d-center`}>
                  <Div className={`fs-0-7rem fw-500 dark`}>
                    {translate(`scheduledExpense`)}
                  </Div>
                  <Checkbox
                    size={`small`}
                    className={`p-0px ml-5px`}
                    checked={item?.money_record_scheduled === `Y`}
                    disabled={LOCKED === `locked`}
                    onChange={(e: any) => {
                      setOBJECT((prev) => ({
                        ...prev,
                        money_section: prev.money_section?.map((section: any, idx: number) => (
												idx === i ? {
												  ...section,
												  money_record_scheduled: e.target.checked ? `Y` : `N`,
												} : section
                        )),
                      }));
                    }}
                  />
                </Grid>
                {item?.money_record_scheduled === `Y` && (
                  <Grid size={{ xs: 7, sm: 8 }} className={`d-center`}>
                    <Div className={`fs-0-7rem fw-500 dark`}>
                      {translate(`scheduledDone`)}
                    </Div>
                    <Checkbox
                      size={`small`}
                      className={`p-0px ml-5px`}
                      checked={item?.money_record_scheduled_done === `Y`}
                      disabled={LOCKED === `locked`}
                      onChange={(e: any) => {
                        setOBJECT((prev) => ({
                          ...prev,
                          money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
													  ...section,
													  money_record_scheduled_done: e.target.checked ? `Y` : `N`,
													} : section
                          )),
                        }));
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {/** row 6 * */}
              {item?.money_record_scheduled === `Y` && (
                <Grid container={true} spacing={1}>
                  <Grid size={12}>
                    <Input
                      locked={LOCKED}
                      type={`date`}
                      shrink={`shrink`}
                      label={translate(`scheduledDate`)}
                      value={item?.money_record_scheduled_date ?? ``}
                      onChange={(e: any) => {
                        const value: string = String(e.target.value ?? ``);
                        setOBJECT((prev) => ({
                          ...prev,
                          money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
													  ...section,
													  money_record_scheduled_date: value,
													} : section
                          )),
                        }));
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          );
        })}
      </>
    );
    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
        {dateCountSection()}
        <Br m={20} />
        {totalSection()}
        <Br m={20} />
        {COUNT?.newSectionCnt > 0 && detailSection()}
      </Paper>
    );
  };

  // 8. dialog ----------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      LOCKED={LOCKED}
      setLOCKED={setLOCKED}
    />
  );

  // 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST, FLOW,
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
      }}
      flow={{
        flowSave, flowDelete,
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {detailNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});
