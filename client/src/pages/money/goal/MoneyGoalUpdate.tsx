// MoneyGoalUpdate.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { useValidateMoney } from "@imports/ImportValidates";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input, Img, Bg } from "@imports/ImportComponents";
import { Picker, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { money2 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const MoneyGoalUpdate = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt,  getMonthStartFmt, getMonthEndFmt
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, URL_OBJECT, sessionId,sessionCurrencyCode, location_id, firstStr
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateMoney();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [EXIST, setEXIST] = useState<any[]>([""]);
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList: `/${firstStr}/goal/list`,
    toSave: `/${firstStr}/goal/save`,
    toUpdate: `/${firstStr}/goal/update`,
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState<any>({
    dateType: location_dateType || "",
      dateStart: location_dateStart || dayFmt,
      dateEnd: location_dateEnd || dayFmt,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    _id: "",
    money_goal_number: 0,
    money_goal_dummy: "N",
    money_goal_dateType: "",
    money_goal_dateStart: "0000-00-00",
    money_goal_dateEnd: "0000-00-00",
    money_goal_income: "0",
    money_goal_expense: "0"
  };
  const [OBJECT, setOBJECT] = useState<any>(OBJECT_DEF);

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
      setEXIST(res.data.result || []);
    })
    .catch((err: any) => {
      console.error(err);
    });
  }, [sessionId, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        _id: location_id,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || OBJECT_DEF);
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
  }, [sessionId, location_id]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowNew = () => {
    // 객체 초기화
    setOBJECT(OBJECT_DEF);

    // 카운트 초기화
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: 1
    }));

    // 날짜 초기화
    setDATE((prev: any) => ({
      ...prev,
      dateType: "",
      dateStart: dayFmt,
      dateEnd: dayFmt
    }));

    // 페이지 이동
    Object.assign(SEND, {
      dateType: "day",
      dateStart: dayFmt,
      dateEnd: dayFmt
    });
    navigate(SEND.toSave, {
      state: SEND
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT, COUNT)) {
      setLOADING(false);
      return;
    }
    axios.put(`${URL_OBJECT}/goal/update`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    axios.delete(`${URL_OBJECT}/goal/deletes`, {
      data: {
        user_id: sessionId,
        _id: OBJECT?._id,
        DATE: DATE,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index: number) => {
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

  // 7. save ---------------------------------------------------------------------------------------
  const saveNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Picker
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
              limit={1}
            />
          </Grid>
        </Grid>
      </Card>
    );
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container spacing={2}>
            <Grid size={6} className={"d-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={"#1976d2"}
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.money_goal_income).format("0,0")}
                inputRef={REFS.current[i]?.emoney_goal_income}
                error={ERRORS[i]?.money_goal_income}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalIncome")}`
                  ) : (
                    `${translate("goalIncome")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={money2}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  sessionCurrencyCode
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_goal_income: "0",
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_goal_income: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.money_goal_expense).format("0,0")}
                inputRef={REFS.current[i]?.emoney_goal_expense}
                error={ERRORS[i]?.money_goal_expense}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalExpense")}`
                  ) : (
                    `${translate("goalExpense")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={money2}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  sessionCurrencyCode
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_goal_expense: "0",
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_goal_expense: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : cardFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min60vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {dateCountSection()}
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      flow={{
        navigate, flowNew, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {saveNode()}
      {footerNode()}
    </>
  );
};
