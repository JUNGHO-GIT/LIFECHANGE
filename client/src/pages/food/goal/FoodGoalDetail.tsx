// FoodGoalDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateFood } from "@imports/ImportValidates";
import { FoodGoal } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, Count, Delete, Input } from "@imports/ImportContainers";
import { Img, Bg, Br } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, toList } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getWeekStartFmt, getWeekEndFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateFood();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(FoodGoal);
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
    dateType: location_dateType || "week",
    dateStart: location_dateStart || getWeekStartFmt(),
    dateEnd: location_dateEnd || getWeekEndFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} ~ ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.food_goal_dateStart.trim()} ~ ${OBJECT.food_goal_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.food_goal_dateStart === "0000-00-00" &&
        OBJECT.food_goal_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.food_goal_dateEnd]);

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
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || FoodGoal);
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async (type: string) => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "goal")) {
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
  const handleDelete = (_index: number) => {
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

  // 7. detail -------------------------------------------------------------------------------------
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
              limit={1}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. detail
    const detailSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Card className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`}>
          <Grid container spacing={1} columns={12}>
            <Grid size={6} className={"d-row-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={"#1976d2"}
              />
            </Grid>
            <Grid size={6} className={"d-row-right"}>
              <Delete
                index={i}
                handleDelete={handleDelete}
                LOCKED={LOCKED}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                value={numeral(item?.food_goal_kcal).format("0,0")}
                inputRef={REFS?.[i]?.food_goal_kcal}
                error={ERRORS?.[i]?.food_goal_kcal}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalKcal")}`
                  ) : (
                    `${translate("goalKcal")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	key={"food2"}
                  	src={"food2"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("kc")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_kcal: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_kcal: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                value={numeral(item?.food_goal_carb).format("0,0")}
                inputRef={REFS?.[i]?.food_goal_carb}
                error={ERRORS?.[i]?.food_goal_carb}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalCarb")}`
                  ) : (
                    `${translate("goalCarb")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	key={"food3"}
                  	src={"food3"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_carb: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 99999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_carb: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                value={numeral(item?.food_goal_protein).format("0,0")}
                inputRef={REFS?.[i]?.food_goal_protein}
                error={ERRORS?.[i]?.food_goal_protein}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalProtein")}`
                  ) : (
                    `${translate("goalProtein")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	key={"food4"}
                  	src={"food4"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_protein: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 99999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_protein: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                value={numeral(item?.food_goal_fat).format("0,0")}
                inputRef={REFS?.[i]?.food_goal_fat}
                error={ERRORS?.[i]?.food_goal_fat}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalFat")}`
                  ) : (
                    `${translate("goalFat")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	key={"food5"}
                  	src={"food5"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_fat: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 99999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      food_goal_fat: String(newValue),
                    }));
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={0} columns={12}>
            <Grid size={12} key={`detail-${0}`}>
              {COUNT?.newSectionCnt > 0 && (
                detailFragment(OBJECT, 0)
              )}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-column-center"}>
            {dateCountSection()}
            {LOADING ? <Loading /> : detailSection()}
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
