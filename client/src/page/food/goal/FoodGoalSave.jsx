// FoodGoalSave.jsx

import {React, useState, useEffect, useRef, createRef} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {sync} from "../../../import/ImportUtils.jsx";
import {Loading, Footer, Empty} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../../import/ImportComponents.jsx";
import {PopUp, Img, Picker, Time, Count, Delete} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField} from "../../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodGoalSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCategory") || "{}";
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
    toList:"/food/goal/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: location_dateEnd || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    food_goal_number: 0,
    food_goal_dummy: "N",
    food_goal_dateStart: "0000-00-00",
    food_goal_dateEnd: "0000-00-00",
    food_goal_kcal: 0,
    food_goal_carb: 0,
    food_goal_protein: 0,
    food_goal_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    food_goal_kcal: false,
    food_goal_carb: false,
    food_goal_protein: false,
    food_goal_fat: false,
  });
  const REFS = useRef({
    food_goal_kcal: createRef(),
    food_goal_carb: createRef(),
    food_goal_protein: createRef(),
    food_goal_fat: createRef(),
  });

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
      food_goal_kcal: false,
      food_goal_carb: false,
      food_goal_protein: false,
      food_goal_fat: false,
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
    else if (!OBJECT.food_goal_kcal || OBJECT.food_goal_kcal === 0) {
      alert(translate("errorFoodGoalKcal"));
      refsCurrent.food_goal_kcal.current &&
      refsCurrent.food_goal_kcal.current?.focus();
      initialErrors.food_goal_kcal = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_carb || OBJECT.food_goal_carb === 0) {
      alert(translate("errorFoodGoalCarb"));
      refsCurrent.food_goal_carb.current &&
      refsCurrent.food_goal_carb.current?.focus();
      initialErrors.food_goal_carb = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_protein || OBJECT.food_goal_protein === 0) {
      alert(translate("errorFoodGoalProtein"));
      refsCurrent.food_goal_protein.current &&
      refsCurrent.food_goal_protein.current?.focus();
      initialErrors.food_goal_protein = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_fat || OBJECT.food_goal_fat === 0) {
      alert(translate("errorFoodGoalFat"));
      refsCurrent.food_goal_fat.current &&
      refsCurrent.food_goal_fat.current?.focus();
      initialErrors.food_goal_fat = true;
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
      food_goal_kcal: 0,
      food_goal_carb: 0,
      food_goal_protein: 0,
      food_goal_fat: 0,
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
    // 7-3. table
    const tableSection = () => {
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
              sectionId={""}
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
              label={`${translate("goalKcal")} (${translate("total")})`}
              variant={"outlined"}
              className={"w-86vw"}
              value={numeral(OBJECT?.food_goal_kcal).format("0,0")}
              inputRef={REFS?.current?.food_goal_kcal}
              error={ERRORS?.food_goal_kcal}
              InputProps={{
                startAdornment: (
                  <Img src={food2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("kc")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(99999, parseInt(rawValue, 10));
                setOBJECT((prev) => ({
                  ...prev,
                  food_goal_kcal: limitedValue
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
              label={`${translate("goalCarb")} (${translate("total")})`}
              variant={"outlined"}
              className={"w-86vw"}
              value={numeral(OBJECT?.food_goal_carb).format("0,0")}
              inputRef={REFS?.current?.food_goal_carb}
              error={ERRORS?.food_goal_carb}
              InputProps={{
                startAdornment: (
                  <Img src={food3} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(99999, parseInt(rawValue, 10));
                setOBJECT((prev) => ({
                  ...prev,
                  food_goal_carb: limitedValue
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
              label={`${translate("goalProtein")} (${translate("total")})`}
              variant={"outlined"}
              className={"w-86vw"}
              value={numeral(OBJECT?.food_goal_protein).format("0,0")}
              inputRef={REFS?.current?.food_goal_protein}
              error={ERRORS?.food_goal_protein}
              InputProps={{
                startAdornment: (
                  <Img src={food4} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(99999, parseInt(rawValue, 10));
                setOBJECT((prev) => ({
                  ...prev,
                  food_goal_protein: limitedValue
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
              label={`${translate("goalFat")} (${translate("total")})`}
              variant={"outlined"}
              className={"w-86vw"}
              value={numeral(OBJECT?.food_goal_fat).format("0,0")}
              inputRef={REFS?.current?.food_goal_fat}
              error={ERRORS?.food_goal_fat}
              InputProps={{
                startAdornment: (
                  <Img src={food5} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(99999, parseInt(rawValue, 10));
                setOBJECT((prev) => ({
                  ...prev,
                  food_goal_fat: limitedValue
                }));
              }}
            />
          </Div>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : tableFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
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
