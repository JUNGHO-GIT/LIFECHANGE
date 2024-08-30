// ExerciseGoalSave.jsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "../../../imports/ImportReacts.jsx";
import { useTime, useCommon } from "../../../imports/ImportHooks.jsx";
import { moment, axios, numeral } from "../../../imports/ImportLibs.jsx";
import { sync } from "../../../imports/ImportUtils.jsx";
import { Loading, Footer } from "../../../imports/ImportLayouts.jsx";
import { Div, Input, Img, Bg } from "../../../imports/ImportComponents.jsx";
import { Picker, Time, Count, Delete } from "../../../imports/ImportContainers.jsx";
import { Card, Paper, Grid } from "../../../imports/ImportMuis.jsx";
import { exercise2, exercise3_1, exercise5 } from "../../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateType, location_dateStart, location_dateEnd, PATH, koreanDate,
  URL_OBJECT, sessionId, translate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/exercise/goal/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
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
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    exercise_goal_count: false,
    exercise_goal_volume: false,
    exercise_goal_weight: false,
  });
  const REFS = useRef({
    exercise_goal_count: createRef(),
    exercise_goal_volume: createRef(),
    exercise_goal_weight: createRef(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: DATE.dateType,
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    })
    .then((res) => {
      setEXIST(res.data.result || []);
      setLOADING(false);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result || OBJECT_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT) => {
    let foundError = false;
    const initialErrors = {
      exercise_goal_count: false,
      exercise_goal_volume: false,
      exercise_goal_weight: false,
    };

    if (COUNT.newSectionCnt === 0) {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    const refsCurrent = REFS?.current;
    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return;
    }
    else if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === "0") {
      alert(translate("errorExerciseGoalCount"));
      refsCurrent.exercise_goal_count.current &&
      refsCurrent.exercise_goal_count.current?.focus();
      initialErrors.exercise_goal_count = true;
      foundError = true;
    }
    else if (!OBJECT.exercise_goal_volume || OBJECT.exercise_goal_volume === "0") {
      alert(translate("errorExerciseGoalVolume"));
      refsCurrent.exercise_goal_volume.current &&
      refsCurrent.exercise_goal_volume.current?.focus();
      initialErrors.exercise_goal_volume = true;
      foundError = true;
    }
    else if (!OBJECT.exercise_goal_weight || OBJECT.exercise_goal_weight === "0") {
      alert(translate("errorExerciseGoalWeight"));
      refsCurrent.exercise_goal_weight.current &&
      refsCurrent.exercise_goal_weight.current?.focus();
      initialErrors.exercise_goal_weight = true;
      foundError = true;
    }
    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/goal/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
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
    .catch((err) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    axios.post(`${URL_OBJECT}/goal/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
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
    .catch((err) => {
      console.error(err);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      exercise_goal_count: "0",
      exercise_goal_volume: "0",
      exercise_goal_cardio: "00:00",
      exercise_goal_weight: "0",
    }));
    setCOUNT((prev) => ({
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
      const cardFragment = (i) => (
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
                inputRef={REFS?.current?.exercise_goal_count}
                error={ERRORS?.exercise_goal_count}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalCount")}`
                  ) : (
                    `${translate("goalCount")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={exercise2} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("c")
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_goal_count: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev) => ({
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
                inputRef={REFS?.current?.exercise_goal_volume}
                error={ERRORS?.exercise_goal_volume}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalVolume")}`
                  ) : (
                    `${translate("goalVolume")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={exercise3_1} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("vol")
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev) => ({
                        ...prev,
                        exercise_goal_volume: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999) {
                      setOBJECT((prev) => ({
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
              inputRef={REFS?.current?.exercise_goal_weight}
              error={ERRORS?.exercise_goal_weight}
              startadornment={
                <Img src={exercise5} className={"w-16 h-16"} />
              }
              endadornment={
                translate("k")
              }
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, '');
                if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                  const newValue = parseFloat(value);
                  if (value === "") {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_goal_weight: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 999) {
                    setOBJECT((prev) => ({
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
