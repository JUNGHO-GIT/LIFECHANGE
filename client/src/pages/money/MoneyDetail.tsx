// MoneyDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateMoney } from "@imports/ImportValidates";
import { Money } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, Memo, Count, Delete, Select, Input } from "@imports/ImportContainers";
import { Img, Bg, Div, Br } from "@imports/ImportComponents";
import { Paper, Card, MenuItem, Grid, Checkbox } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, localCurrency, moneyArray, toList, bgColors } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateMoney();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(Money);
  const [EXIST, setEXIST] = useState<any>({
    day: [""],
    week: [""],
    month: [""],
    year: [""],
    select: [""],
  });
  const [FLOW, setFLOW] = useState<any>({
    exist: false,
    itsMe: false,
    itsNew: false,
  });
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState<any>({
    dateType: location_dateType || "day",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} ~ ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.money_dateStart.trim()} ~ ${OBJECT.money_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.money_dateStart === "0000-00-00" &&
        OBJECT.money_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.money_dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: getMonthStartFmt(DATE.dateStart),
          dateEnd: getMonthEndFmt(DATE.dateEnd),
        },
      },
    })
    .then((res: any) => {
      setEXIST(
        !res.data.result || res.data.result.length === 0 ? [""] : res.data.result
      );
    })
    .catch((err: any) => {
      console.error(err);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    if (LOCKED === "locked") {
      setLOADING(false);
      return;
    }
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      // 기본값 설정
      setOBJECT(res.data.result || Money);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev: any) => ({
          ...prev,
          money_section: [],
        }));
      }
      // sectionCnt가 0이 아니면 section 내부 part_idx 값에 따라 재정렬
      else {
        setOBJECT((prev: any) => ({
          ...prev,
          money_section: prev.money_section.sort((a: any, b: any) => (
            a.money_part_idx - b.money_part_idx
          )),
        }));
      }

      // count 설정
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.money_section.reduce((acc: any, cur: any) => {
      return {
        // money_part_val 가 income인경우
        totalIncome: (
          acc.totalIncome + (cur.money_part_val === "income" ? Number(cur.money_amount) : 0)
        ),

        // money_part_val 가 expense인경우
        totalExpense: (
          acc.totalExpense + (cur.money_part_val === "expense" ? Number(cur.money_amount) : 0)
        ),
      };
    }, {
      totalIncome: 0,
      totalExpense: 0
    });

    setOBJECT((prev: any) => ({
      ...prev,
      money_total_income: Math.round(totals.totalIncome).toString(),
      money_total_expense: Math.round(totals.totalExpense).toString(),
    }));

  }, [OBJECT?.money_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      money_part_idx: 0,
      money_part_val: "all",
      money_title_idx: 0,
      money_title_val: "all",
      money_amount: "0",
      money_content: "",
      money_include: "Y",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_item: any, idx: number) =>
      idx < OBJECT?.money_section.length ? OBJECT?.money_section[idx] : defaultSection
    );
    setOBJECT((prev: any) => ({
      ...prev,
      money_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = (type: string) => {
    setLOADING(true);
    if (!validate(OBJECT, COUNT, "real")) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === "create" ? "post" : "put",
      url: type === "create" ? `${URL_OBJECT}/create` : `${URL_OBJECT}/update`,
      data: {
        user_id: sessionId,
        OBJECT: OBJECT,
        DATE: DATE,
        type: type,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        sync();
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDelete = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "delete")) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`, {
      data: {
        user_id: sessionId,
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      money_section: prev.money_section.filter((_item: any, idx: number) => (idx !== index))
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. detailNode ---------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border-1 radius-1 p-20"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            <PickerDay
              DATE={DATE}
              setDATE={setDATE}
              EXIST={EXIST}
            />
          </Grid>
          <Br px={1} />
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
      </Card>
    );
    // 7-2. total
    const totalSection = () => (
      <Card className={"border-1 radius-1 p-20"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            <Input
              label={translate("totalIncome")}
              value={numeral(OBJECT?.money_total_income).format("0,0")}
              readOnly={true}
              startadornment={
                <Img
                	key={"money2"}
                	src={"money2"}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                localCurrency
              }
            />
          </Grid>
          <Br px={1} />
          <Grid size={12}>
            <Input
              label={translate("totalExpense")}
              value={numeral(OBJECT?.money_total_expense).format("0,0")}
              readOnly={true}
              startadornment={
                <Img
                	key={"money2"}
                	src={"money2"}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                localCurrency
              }
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. card
    const detailSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Card className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={6} className={"d-row-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={bgColors?.[item?.money_part_idx]}
              />
            </Grid>
            <Grid size={6} className={"d-row-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
                LOCKED={LOCKED}
              />
            </Grid>
            <Br px={1} />
            <Grid size={6}>
              <Select
                label={translate("part")}
                locked={LOCKED}
                inputRef={REFS?.[i]?.money_part_idx}
                error={ERRORS?.[i]?.money_part_idx}
                value={item?.money_part_idx ?? 0}
                onChange={(e: any) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        money_part_idx: newIndex,
                        money_part_val: moneyArray[newIndex]?.money_part,
                        money_title_idx: 0,
                        money_title_val: moneyArray[newIndex]?.money_title[0],
                      } : section
                    )),
                  }));
                }}
              >
                {moneyArray?.map((part: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(part.money_part)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("title")}
                locked={LOCKED}
                inputRef={REFS?.[i]?.money_title_idx}
                error={ERRORS?.[i]?.money_title_idx}
                value={item?.money_title_idx ?? 0}
                onChange={(e: any) => {
                  const newTitleIdx = Number(e.target.value);
                  const newTitleVal = moneyArray[item?.money_part_idx]?.money_title[newTitleIdx];
                  if (newTitleIdx >= 0 && newTitleVal) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_section: prev.money_section?.map((section: any, idx: number) => (
                        idx === i ? {
                          ...section,
                          money_title_idx: newTitleIdx,
                          money_title_val: newTitleVal,
                        } : section
                      )),
                    }));
                  }
                }}
              >
                {moneyArray[item?.money_part_idx]?.money_title?.map((title: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(title)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                label={translate("amount")}
                value={numeral(item?.money_amount).format("0,0")}
                inputRef={REFS?.[i]?.money_amount}
                error={ERRORS?.[i]?.money_amount}
                locked={LOCKED}
                startadornment={
                  <Img
                    key={"money2"}
                    src={"money2"}
                    className={"w-16 h-16"}
                  />
                }
                endadornment={
                  localCurrency
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        money_amount: String(newValue),
                      } : section
                    )),
                  }));
                }}
              />
            </Grid>
            <Br px={1} />
            <Grid size={{ xs: 7, sm: 8 }} className={"d-center"}>
              <Memo
                OBJECT={OBJECT}
                setOBJECT={setOBJECT}
                LOCKED={LOCKED}
                extra={"money_content"}
                i={i}
              />
            </Grid>
            <Grid size={{ xs: 5, sm: 4 }} className={"d-center"}>
              <Div className={"fs-0-7rem fw-500 dark ms-10"}>
                {translate("includeProperty")}
              </Div>
              <Checkbox
                size={"small"}
                className={"p-0 ms-5"}
                checked={item?.money_include === "Y"}
                disabled={LOCKED === "locked"}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        money_include: e.target.checked ? "Y" : "N",
                      } : section
                    )),
                  }));
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={0} columns={12}>
            {OBJECT?.money_section?.map((item: any, i: number) => (
              <Grid size={12} key={`detail-${i}`}>
                {COUNT?.newSectionCnt > 0 && (
                  detailFragment(item, i)
                )}
              </Grid>
            ))}
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {dateCountSection()}
            {LOADING ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {totalSection()}
                {detailSection()}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      LOCKED={LOCKED}
      setLOCKED={setLOCKED}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST, FLOW,
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
      }}
      flow={{
        flowSave, flowDelete
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {detailNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};