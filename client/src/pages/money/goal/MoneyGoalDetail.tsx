// MoneyGoalDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateMoney } from "@imports/ImportValidates";
import { MoneyGoal } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, Count, Delete, Input } from "@imports/ImportContainers";
import { Img, Bg } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, localCurrency, toList } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { weekStartFmt, weekEndFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateMoney();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(MoneyGoal);
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
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState<any>({
    dateType: location_dateType || "week",
    dateStart: location_dateStart || weekStartFmt,
    dateEnd: location_dateEnd || weekEndFmt,
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} ~ ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.money_goal_dateStart.trim()} ~ ${OBJECT.money_goal_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.money_goal_dateStart === "0000-00-00" &&
        OBJECT.money_goal_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.money_goal_dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/goal/exist`, {
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
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || MoneyGoal);
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = (type: string) => {
    setLOADING(true);
    if (!validate(OBJECT, COUNT, "goal")) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === "create" ? "post" : "put",
      url: type === "create" ? `${URL_OBJECT}/goal/create` : `${URL_OBJECT}/goal/update`,
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
          open: true,
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
          open: true,
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
  const flowDelete = () => {
    setLOADING(true);
    if (!validate(OBJECT, COUNT, "delete")) {
      setLOADING(false);
      return;
    }
    axios.delete(`${URL_OBJECT}/goal/delete`, {
      data: {
        user_id: sessionId,
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        sync();
        setALERT({
          open: true,
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
          open: true,
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
  const handlerDelete = (_index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      money_goal_income: "",
      money_goal_expense: ""
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border-1 radius-1 p-20"}>
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            <PickerDay
              DATE={DATE}
              setDATE={setDATE}
              EXIST={EXIST}
              setEXIST={setEXIST}
            />
          </Grid>
          <Grid size={12}>
            <Count
              COUNT={COUNT}
              setCOUNT={setCOUNT}
              LOCKED={LOCKED}
              setLOCKED={setLOCKED}
              limit={1}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`} key={i}>
          <Grid container spacing={2} columns={12}>
            <Grid size={6} className={"d-row-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={"#1976d2"}
              />
            </Grid>
            <Grid size={6} className={"d-row-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
                LOCKED={LOCKED}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.money_goal_income).format("0,0")}
                inputRef={REFS?.[i]?.money_goal_income}
                error={ERRORS?.[i]?.money_goal_income}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalIncome")}`
                  ) : (
                    `${translate("goalIncome")} (${translate("total")})`
                  )
                }
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
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_goal_income: "0",
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_goal_income: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.money_goal_expense).format("0,0")}
                inputRef={REFS?.[i]?.money_goal_expense}
                error={ERRORS?.[i]?.money_goal_expense}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalExpense")}`
                  ) : (
                    `${translate("goalExpense")} (${translate("total")})`
                  )
                }
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
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_goal_expense: "0",
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_goal_expense: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && detailFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 h-min75vh"}>
        <Grid size={12}>
          {dateCountSection()}
          {!LOADING ? detailSection() : <Loading />}
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
