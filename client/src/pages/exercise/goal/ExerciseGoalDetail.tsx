// ExerciseGoalDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTime } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateExercise } from "@imports/ImportValidates";
import { ExerciseGoal } from "@imports/ImportSchemas";
import { axios, numeral, sync } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, PickerTime, Count, Delete, Input } from "@imports/ImportContainers";
import { Img, Bg, Br } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toList } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getWeekStartFmt, getWeekEndFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateExercise();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(ExerciseGoal);
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
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} ~ ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.exercise_goal_dateStart.trim()} ~ ${OBJECT.exercise_goal_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.exercise_goal_dateStart === "0000-00-00" &&
        OBJECT.exercise_goal_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.exercise_goal_dateEnd]);

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
      setOBJECT(res.data.result || ExerciseGoal);
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
  const handlerDelete = (_index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      exercise_goal_count: "0",
      exercise_goal_volume: "0",
      exercise_goal_cardio: "00:00",
      exercise_goal_weight: "0",
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
                handlerDelete={handlerDelete}
                LOCKED={LOCKED}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                value={numeral(item?.exercise_goal_count).format("0,0")}
                inputRef={REFS?.[i]?.exercise_goal_count}
                error={ERRORS?.[i]?.exercise_goal_count}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalCount")}`
                  ) : (
                    `${translate("goalCount")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	key={"exercise2"}
                  	src={"exercise2"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("c")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_count: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_count: String(newValue)
                    }));
                  }
                }}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                value={numeral(item?.exercise_goal_volume).format("0,0")}
                inputRef={REFS?.[i]?.exercise_goal_volume}
                error={ERRORS?.[i]?.exercise_goal_volume}
                locked={LOCKED}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalVolume")}`
                  ) : (
                    `${translate("goalVolume")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	key={"exercise3_1"}
                  	src={"exercise3_1"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("vol")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  const newValue = value === "" ? 0 : Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_volume: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_volume: String(newValue)
                    }));
                  }
                }}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <PickerTime
                OBJECT={item}
                setOBJECT={setOBJECT}
                REFS={REFS}
                ERRORS={ERRORS}
                DATE={DATE}
                LOCKED={LOCKED}
                extra={"exercise_goal_cardio"}
                i={i}
              />
            </Grid>
            <Br px={1} />
            <Grid size={12}>
              <Input
                label={translate("goalWeight")}
                value={item?.exercise_goal_weight}
                inputRef={REFS?.[i]?.exercise_goal_weight}
                error={ERRORS?.[i]?.exercise_goal_weight}
                locked={LOCKED}
                startadornment={
                  <Img
                    key={"exercise5"}
                    src={"exercise5"}
                    className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("k")
                }
                onChange={(e: any) => {
                  const value = e.target.value;
                  const newValue = value.startsWith("0") ? value.slice(1) : value;
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_weight: "0"
                    }));
                  }
                  else if (newValue.match(/^\d*\.?\d{0,2}$/) && Number(newValue) <= 999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_weight: String(newValue)
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
            <Grid size={12} key={`detail`}>
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
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {dateCountSection()}
            {LOADING ? (
              <>
                <Loading />
              </>
            ) : (
              <>
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
