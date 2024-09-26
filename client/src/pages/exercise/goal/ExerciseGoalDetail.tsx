// ExerciseGoalDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useTime } from "@imports/ImportHooks";
import { useValidateExercise } from "@imports/ImportValidates";
import { ExerciseGoal } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input, Img, Bg } from "@imports/ImportComponents";
import { Picker, Time, Count, Delete, Dial } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    dayFmt, getMonthStartFmt, getMonthEndFmt
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, toList
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateExercise();

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
    dateType: location_dateType || "",
    dateStart: location_dateStart || dayFmt,
    dateEnd: location_dateEnd || dayFmt,
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
  }, [sessionId, DATE.dateEnd]);

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
  }, [sessionId, DATE.dateEnd]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = (type: string) => {
    if (!validate(OBJECT, COUNT)) {
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
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(toList, {
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
  const flowDelete = () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
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
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(toList, {
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
      <Card className={"border-1 radius p-20"}>
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
        <Card className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius p-20`} key={i}>
          <Grid container spacing={2}>
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
                value={numeral(OBJECT?.exercise_goal_count).format("0,0")}
                inputRef={REFS[i]?.exercise_goal_count}
                error={ERRORS[i]?.exercise_goal_count}
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
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.exercise_goal_volume).format("0,0")}
                inputRef={REFS[i]?.exercise_goal_volume}
                error={ERRORS[i]?.exercise_goal_volume}
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
            <Grid size={12}>
              <Time
                OBJECT={OBJECT}
                setOBJECT={setOBJECT}
                REFS={REFS}
                ERRORS={ERRORS}
                DATE={DATE}
                LOCKED={LOCKED}
                extra={"exercise_goal_cardio"}
                i={i}
              />
            </Grid>
            <Input
              label={translate("goalWeight")}
              value={OBJECT?.exercise_goal_weight}
              inputRef={REFS[i]?.exercise_goal_weight}
              error={ERRORS[i]?.exercise_goal_weight}
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
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : detailFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {dateCountSection()}
            {detailSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 8. dial ---------------------------------------------------------------------------------------
  const dialNode = () => (
    <Dial
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
      {dialNode()}
      {footerNode()}
    </>
  );
};
