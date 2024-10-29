// MoneyDetail.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useValidateMoney } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { axios } from "@importLibs";
import { insertComma, sync } from "@importScripts";
import { Money } from "@importSchemas";
import { Loader, Footer, Dialog } from "@importLayouts";
import { PickerDay, Memo, Count, Delete, Select, Input } from "@importContainers";
import { Img, Bg, Div } from "@importComponents";
import { Paper, MenuItem, Grid, Checkbox, Card } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, sessionId, localCurrency, moneyArray } = useCommonValue();
  const { toList, toToday, bgColors } = useCommonValue();
  const { location_from, location_dateType } = useCommonValue();
  const { location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();
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

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.money_dateStart.trim()} - ${OBJECT.money_dateEnd.trim()}`;

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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
          money_section: []
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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
        totalIncomeExclusion: (
          acc.totalIncomeExclusion + (cur.money_part_val === "income" ? Number(cur.money_amount) : 0)
        ),

        // money_part_val 가 expense인경우
        totalExpenseExclusion: (
          acc.totalExpenseExclusion + (cur.money_part_val === "expense" ? Number(cur.money_amount) : 0)
        ),
      };
    }, {
      totalIncomeExclusion: 0,
      totalExpenseExclusion: 0
    });

    setOBJECT((prev: any) => ({
      ...prev,
      money_total_income: Math.round(totals.totalIncomeExclusion).toString(),
      money_total_expense: Math.round(totals.totalExpenseExclusion).toString(),
    }));

  }, [OBJECT?.money_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      money_part_idx: 0,
      money_part_val: "",
      money_title_idx: 0,
      money_title_val: "",
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
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "real")) {
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
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("property");
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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("property");
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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-3. handle----------------------------------------------------------------------------------
  const handleDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      money_section: prev.money_section.filter((_item: any, idx: number) => (idx !== index))
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Grid container={true} spacing={2} className={"border-1 radius-1 p-20"}>
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
      <Grid container={true} spacing={2} className={"border-1 radius-1 p-20"}>
        {/** row 1 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              label={translate("totalIncome")}
              value={insertComma(OBJECT?.money_total_income || "0")}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"money2"}
                />
              }
              endadornment={
                localCurrency
              }
            />
          </Grid>
        </Grid>
        {/** /.row 1 **/}

        {/** row 2 **/}
        <Grid container={true} spacing={2}>
          <Grid size={12}>
            <Input
              locked={LOCKED}
              label={translate("totalExpense")}
              value={insertComma(OBJECT?.money_total_expense || "0")}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"money2"}
                />
              }
              endadornment={
                localCurrency
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Grid container spacing={2} className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`} key={`detail-${i}`}>
          {/** row 1 **/}
          <Grid container={true} spacing={2}>
            <Grid size={6} className={"d-row-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={bgColors?.[item?.money_part_idx]}
              />
            </Grid>
            <Grid size={6} className={"d-row-right"}>
              <Delete
                index={i}
                handleDelete={handleDelete}
                LOCKED={LOCKED}
              />
            </Grid>
          </Grid>
          {/** /.row 1 **/}

          {/** row 2 **/}
          <Grid container={true} spacing={2}>
            <Grid size={6}>
              <Select
                locked={LOCKED}
                label={translate("part")}
                value={item?.money_part_idx || 0}
                inputRef={REFS?.[i]?.money_part_idx}
                error={ERRORS?.[i]?.money_part_idx}
                onChange={(e: any) => {
                  // 빈값 처리
                  let value = e.target.value === "" ? 0 : Number(e.target.value);
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        money_part_idx: value,
                        money_part_val: moneyArray[value]?.money_part,
                        money_title_idx: 0,
                        money_title_val: moneyArray[value]?.money_title[0],
                      } : section
                    ))
                  }));
                }}
              >
                {moneyArray?.map((part: any, idx: number) => (
                  <MenuItem
                    key={idx}
                    value={idx}
                    className={"fs-0-8rem"}
                  >
                    {translate(part?.money_part)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={6}>
              <Select
                locked={LOCKED}
                label={translate("title")}
                value={item?.money_title_idx || 0}
                inputRef={REFS?.[i]?.money_title_idx}
                error={ERRORS?.[i]?.money_title_idx}
                onChange={(e: any) => {
                  // 빈값 처리
                  let value = e.target.value === "" ? 0 : Number(e.target.value);
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        money_title_idx: value,
                        money_title_val: moneyArray[section?.money_part_idx]?.money_title[value],
                      } : section
                    ))
                  }));
                }}
              >
                {moneyArray[item?.money_part_idx]?.money_title?.map((title: any, idx: number) => (
                  <MenuItem
                    key={idx}
                    value={idx}
                    className={"fs-0-8rem"}
                  >
                    {translate(title)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          {/** /.row 2 **/}

          {/** row 3 **/}
          <Grid container={true} spacing={2}>
            <Grid size={12}>
              <Input
                locked={LOCKED}
                label={translate("amount")}
                value={insertComma(item?.money_amount || "0")}
                inputRef={REFS?.[i]?.money_amount}
                error={ERRORS?.[i]?.money_amount}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"money2"}
                  />
                }
                endadornment={
                  localCurrency
                }
                onChange={(e: any) => {
                  // 빈값 처리
                  let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                  // 999999999 제한 + 정수
                  if (Number(value) > 999999999 || !/^\d+$/.test(value)) {
                    return;
                  }
                  // 01, 05 같은 숫자는 1, 5로 변경
                  if (/^0(?!\.)/.test(value)) {
                    value = value.replace(/^0+/, '');
                  }
                  // object 설정
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((section: any, idx: number) => (
                      idx === i ? {
                        ...section,
                        money_amount: value,
                      } : section
                    ))
                  }));
                }}
              />
            </Grid>
          </Grid>
          {/** /.row 3 **/}

          {/** row 4 **/}
          <Grid container={true} spacing={2}>
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
          {/** /.row 4 **/}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {OBJECT?.money_section?.map((item: any, i: number) => (
            COUNT?.newSectionCnt > 0 && detailFragment(item, i)
          ))}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {dateCountSection()}
        {totalSection()}
        {LOADING ? <Loader /> : detailSection()}
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