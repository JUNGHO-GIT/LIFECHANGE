// ExerciseGoalSave.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useTime } from "@imports/ImportHooks";
import { useValidateExercise } from "@imports/ImportValidates";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input, Img, Bg } from "@imports/ImportComponents";
import { Picker, Time, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { exercise2, exercise3_1, exercise5 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();
  const {
    dayFmt, getMonthStartFmt, getMonthEndFmt
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId,
    location_id, firstStr
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateExercise();

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
    exercise_goal_number: 0,
    exercise_goal_dummy: "N",
    exercise_goal_dateType: "",
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: "0",
    exercise_goal_cardio: "00:00",
    exercise_goal_volume: "0",
    exercise_goal_weight: "0",
  };
  const [OBJECT, setOBJECT] = useState<any>(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

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
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT, COUNT)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/goal/save`, {
      user_id: sessionId,
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
                value={numeral(OBJECT?.exercise_goal_count).format("0,0")}
                inputRef={REFS.current[i]?.exercise_goal_count}
                error={ERRORS[i]?.exercise_goal_count}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalCount")}`
                  ) : (
                    `${translate("goalCount")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={exercise2}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("c")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_goal_count: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_goal_count: value
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.exercise_goal_volume).format("0,0")}
                inputRef={REFS.current[i]?.exercise_goal_volume}
                error={ERRORS[i]?.exercise_goal_volume}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalVolume")}`
                  ) : (
                    `${translate("goalVolume")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img
                  	src={exercise3_1}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("vol")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_goal_volume: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        exercise_goal_volume: value
                      }));
                    }
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
                extra={"exercise_goal_cardio"}
                i={i}
              />
            </Grid>
            <Input
              label={translate("goalWeight")}
              value={OBJECT?.exercise_goal_weight}
              inputRef={REFS.current[i]?.exercise_goal_weight}
              error={ERRORS[i]?.exercise_goal_weight}
              startadornment={
                <Img
                	src={exercise5}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("k")
              }
              onChange={(e: any) => {
                const value = e.target.value.replace(/^0+/, '');
                if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                  const newValue = parseFloat(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_weight: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      exercise_goal_weight: value
                    }));
                  }
                }
              }}
            />
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
        navigate, flowSave, flowDeletes
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
