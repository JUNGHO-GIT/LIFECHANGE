// FoodGoalSave.jsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "../../../imports/ImportReacts.jsx";
import { useCommon } from "../../../imports/ImportHooks.jsx";
import { moment, axios, numeral } from "../../../imports/ImportLibs.jsx";
import { sync } from "../../../imports/ImportUtils.jsx";
import { Loading, Footer } from "../../../imports/ImportLayouts.jsx";
import { Div, Br20, Img, Input } from "../../../imports/ImportComponents.jsx";
import { Picker, Count, Delete } from "../../../imports/ImportContainers.jsx";
import { Card, Paper, Badge, Grid } from "../../../imports/ImportMuis.jsx";
import { food2, food3, food4, food5 } from "../../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodGoalSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateType, location_dateStart, location_dateEnd, koreanDate,
  URL_OBJECT, sessionId, translate } = useCommon();

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
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
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
    else if (!OBJECT.food_goal_kcal || OBJECT.food_goal_kcal === "0") {
      alert(translate("errorFoodGoalKcal"));
      refsCurrent.food_goal_kcal.current &&
      refsCurrent.food_goal_kcal.current?.focus();
      initialErrors.food_goal_kcal = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_carb || OBJECT.food_goal_carb === "0") {
      alert(translate("errorFoodGoalCarb"));
      refsCurrent.food_goal_carb.current &&
      refsCurrent.food_goal_carb.current?.focus();
      initialErrors.food_goal_carb = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_protein || OBJECT.food_goal_protein === "0") {
      alert(translate("errorFoodGoalProtein"));
      refsCurrent.food_goal_protein.current &&
      refsCurrent.food_goal_protein.current?.focus();
      initialErrors.food_goal_protein = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_fat || OBJECT.food_goal_fat === "0") {
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
      food_goal_kcal: "",
      food_goal_carb: "",
      food_goal_protein: "",
      food_goal_fat: "",
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
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"border radius p-20"} key={i}>
          <Div className={"d-between"}>
            <Badge
              badgeContent={i + 1}
              showZero={true}
              sx={{
                '& .MuiBadge-badge': {
                  marginTop: "-10px",
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
            <Input
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalKcal")}`
                ) : (
                  `${translate("goalKcal")} (${translate("total")})`
                )
              }
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
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value) || value === "") {
                  const newValue = Number(value);
                  if (value === "") {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_kcal: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999) {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_kcal: value,
                    }));
                  }
                }
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Input
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalCarb")}`
                ) : (
                  `${translate("goalCarb")} (${translate("total")})`
                )
              }
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
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value) || value === "") {
                  const newValue = Number(value);
                  if (value === "") {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_carb: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 99999) {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_carb: value,
                    }));
                  }
                }
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Input
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalProtein")}`
                ) : (
                  `${translate("goalProtein")} (${translate("total")})`
                )
              }
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
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value) || value === "") {
                  const newValue = Number(value);
                  if (value === "") {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_protein: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 99999) {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_protein: value,
                    }));
                  }
                }
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Input
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalFat")}`
                ) : (
                  `${translate("goalFat")} (${translate("total")})`
                )
              }
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
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value) || value === "") {
                  const newValue = Number(value);
                  if (value === "") {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_fat: "0"
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 99999) {
                    setOBJECT((prev) => ({
                      ...prev,
                      food_goal_fat: value,
                    }));
                  }
                }
              }}
            />
          </Div>
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
        <Grid container columnSpacing={1}>
          <Grid size={12}>
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
