// ExerciseGoalSave.jsx

import {React, useState, useEffect, useRef, createRef} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {useTime, useTranslate} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportUtils.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../../import/ImportComponents.jsx";
import {PopUp, Img, Picker, Time, Count, Delete} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {exercise2, exercise3_1, exercise5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateType = location?.state?.dateType;
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

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
    dateStart: location_dateStart,
    dateEnd: location_dateEnd
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    exercise_goal_number: 0,
    exercise_goal_dummy: "N",
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: 0,
    exercise_goal_cardio: "00:00",
    exercise_goal_volume: 0,
    exercise_goal_weight: 0,
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
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/exist`, {
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
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/goal/detail`, {
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
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

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
    else if (!OBJECT.exercise_goal_count || OBJECT.exercise_goal_count === 0) {
      alert(translate("errorExerciseGoalCount"));
      refsCurrent.exercise_goal_count.current &&
      refsCurrent.exercise_goal_count.current?.focus();
      initialErrors.exercise_goal_count = true;
      foundError = true;
    }
    else if (!OBJECT.exercise_goal_volume || OBJECT.exercise_goal_volume === 0) {
      alert(translate("errorExerciseGoalVolume"));
      refsCurrent.exercise_goal_volume.current &&
      refsCurrent.exercise_goal_volume.current?.focus();
      initialErrors.exercise_goal_volume = true;
      foundError = true;
    }
    else if (!OBJECT.exercise_goal_weight || OBJECT.exercise_goal_weight === 0) {
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
      return;
    }
    await axios.post(`${URL_OBJECT}/goal/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        percent();
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
        alert(res.data.msg);
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
    await axios.post(`${URL_OBJECT}/goal/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        percent();
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
        alert(res.data.msg);
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
      exercise_goal_count: 0,
      exercise_goal_volume: 0,
      exercise_goal_cardio: "00:00",
      exercise_goal_weight: 0
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius shadow-none p-20"}>
        <Picker
          DATE={DATE}
          setDATE={setDATE}
          EXIST={EXIST}
          setEXIST={setEXIST}
        />
        <Br20 />
        <Count
          COUNT={COUNT}
          setCOUNT={setCOUNT}
          limit={1}
        />
      </Card>
    );
    // 7-2. total
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          <Div className={"d-between"}><Badge
              badgeContent={i + 1}
              showZero={true}
              sx={{
                '& .MuiBadge-badge': {
                  color: '#ffffff',
                  backgroundColor: "#1976d2",
                }
              }}
            />
            <Delete
              id={OBJECT?._id}
              sectionId=""
              index={i}
              handlerDelete={handlerDelete}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={`${translate("goalCount")} (${translate("total")})`}
              className={"w-86vw"}
              value={numeral(OBJECT?.exercise_goal_count).format("0,0")}
              inputRef={REFS?.current?.exercise_goal_count}
              error={ERRORS?.exercise_goal_count}
              InputProps={{
                startAdornment: (
                  <Img src={exercise2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("c")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(Number(rawValue), 999);
                setOBJECT((prev) => ({
                  ...prev,
                  exercise_goal_count: limitedValue
                }));
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={`${translate("goalVolume")} (${translate("total")})`}
              className={"w-86vw"}
              value={numeral(OBJECT?.exercise_goal_volume).format("0,0")}
              inputRef={REFS?.current?.exercise_goal_volume}
              error={ERRORS?.exercise_goal_volume}
              InputProps={{
                startAdornment: (
                  <Img src={exercise3_1} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("vol")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(Number(rawValue), 999);
                setOBJECT((prev) => ({
                  ...prev,
                  exercise_goal_volume: limitedValue
                }));
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={translate("goalWeight")}
              className={"w-86vw"}
              value={numeral(OBJECT?.exercise_goal_weight).format("0,0")}
              inputRef={REFS?.current?.exercise_goal_weight}
              error={ERRORS?.exercise_goal_weight}
              InputProps={{
                startAdornment: (
                  <Img src={exercise5} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("kg")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(Number(rawValue), 999);
                setOBJECT((prev) => ({
                  ...prev,
                  exercise_goal_weight: limitedValue
                }));
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              extra={"exercise_goal_cardio"}
              i={i}
            />
          </Div>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? loadingFragment() : tableFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-80"}>
        <Div className={"block-wrapper h-min75vh"}>
          {dateCountSection()}
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT, EXIST
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      handlers={{
        navigate, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};
