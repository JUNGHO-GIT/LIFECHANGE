// FoodGoalUpdate.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { useValidateFood } from "@imports/ImportValidates";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Img, Input, Bg  } from "@imports/ImportComponents";
import { Picker, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { food2, food3, food4, food5 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const FoodGoalUpdate = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt, getMonthStartFmt, getMonthEndFmt,
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, location_id,
    URL_OBJECT, sessionId, firstStr
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateFood();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [EXIST, setEXIST] = useState<any[]>([""]);
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
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
    initDateType: location_dateType || "",
    initDateStart: location_dateStart || dayFmt,
    initDateEnd: location_dateEnd || dayFmt,
    dateType: location_dateType || "",
    dateStart: location_dateStart || dayFmt,
    dateEnd: location_dateEnd || dayFmt,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    _id: "",
    food_goal_number: 0,
    food_goal_dummy: "N",
    food_goal_dateType: "",
    food_goal_dateStart: "0000-00-00",
    food_goal_dateEnd: "0000-00-00",
    food_goal_kcal: "0",
    food_goal_carb: "0",
    food_goal_protein: "0",
    food_goal_fat: "0",
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
      food_goal_kcal: "",
      food_goal_carb: "",
      food_goal_protein: "",
      food_goal_fat: "",
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
                value={numeral(OBJECT?.food_goal_kcal).format("0,0")}
                inputRef={REFS.current[i]?.efood_goal_kcal}
                error={ERRORS[i]?.food_goal_kcal}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalKcal")}`
                  ) : (
                    `${translate("goalKcal")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={food2}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("kc")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_kcal: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_kcal: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_carb).format("0,0")}
                inputRef={REFS.current[i]?.efood_goal_carb}
                error={ERRORS[i]?.food_goal_carb}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalCarb")}`
                  ) : (
                    `${translate("goalCarb")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={food3}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_carb: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_carb: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_protein).format("0,0")}
                inputRef={REFS.current[i]?.efood_goal_protein}
                error={ERRORS[i]?.food_goal_protein}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalProtein")}`
                  ) : (
                    `${translate("goalProtein")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={food4}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_protein: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_protein: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_fat).format("0,0")}
                inputRef={REFS.current[i]?.efood_goal_fat}
                error={ERRORS[i]?.food_goal_fat}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalFat")}`
                  ) : (
                    `${translate("goalFat")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={food5}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_fat: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_fat: value,
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
