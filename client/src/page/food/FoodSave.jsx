// FoodSave.jsx

import {React, useState, useEffect, useRef, createRef} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {percent, log} from "../../import/ImportUtils.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../import/ImportComponents.jsx";
import {Img, Picker, Count, Delete} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCategory") || "{}";
  const foodArray = JSON.parse(session)?.food || [];
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
  const [EXIST, setEXIST] = useState([""]);
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/food/list",
    toSave:"/food/save",
    toFind:"/food/find/list",
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
    food_number: 0,
    food_dummy: false,
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram: 0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
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
    await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    })
    .then((res) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev) => {
        if (prev.length === 1 && prev[0]?._id === "") {
          return res.data.result;
        }
        else {
          return {...prev, ...res.data.result};
        }
      });
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.food_section?.reduce((acc, cur) => {
      return {
        totalKcal: acc.totalKcal + Number(cur.food_kcal),
        totalFat: acc.totalFat + Number(cur.food_fat),
        totalCarb: acc.totalCarb + Number(cur.food_carb),
        totalProtein: acc.totalProtein + Number(cur.food_protein),
      };
    }, { totalKcal: 0, totalFat: 0, totalCarb: 0, totalProtein: 0});

    setOBJECT((prev) => ({
      ...prev,
      food_total_kcal: Number(totals.totalKcal.toFixed(1)),
      food_total_fat: Number(totals.totalFat.toFixed(1)),
      food_total_carb: Number(totals.totalCarb.toFixed(1)),
      food_total_protein: Number(totals.totalProtein.toFixed(1)),
    }));
  }, [OBJECT?.food_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram: 0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.food_section.length ? OBJECT?.food_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      food_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const REFS = useRef(OBJECT?.food_section?.map(() => ({
    food_part_idx: createRef(),
    food_count: createRef(),
    food_gram: createRef(),
    food_title: createRef(),
    food_kcal: createRef(),
    food_carb: createRef(),
    food_protein: createRef(),
    food_fat: createRef(),
  })));
  const [ERRORS, setERRORS] = useState(OBJECT?.food_section?.map(() => ({
    food_part_idx: false,
    food_count: false,
    food_gram: false,
    food_title: false,
    food_kcal: false,
    food_carb: false,
    food_protein: false,
    food_fat: false,
  })));
  useEffect(() => {
    REFS.current = OBJECT?.food_section?.map((_, idx) => REFS?.current[idx] || {
      food_part_idx: createRef(),
      food_count: createRef(),
      food_gram: createRef(),
      food_title: createRef(),
      food_kcal: createRef(),
      food_carb: createRef(),
      food_protein: createRef(),
      food_fat: createRef(),
    });
  }, [OBJECT?.food_section.length]);
  const validate = (OBJECT) => {
    // 첫 번째 오류를 찾았는지 여부를 추적하는 플래그
    let foundError = false;

    // 초기 에러 상태에서 모든 필드를 false로 설정
    const initialErrors = OBJECT?.food_section?.map(() => ({
      food_part_idx: false,
      food_count: false,
      food_gram: false,
      food_title: false,
      food_kcal: false,
      food_carb: false,
      food_protein: false,
      food_fat: false,
    }));

    for (let idx = 0; idx < OBJECT?.food_section.length; idx++) {
      const section = OBJECT?.food_section[idx];
      // 오류가 있는 항목만 업데이트
      if (section.food_part_idx === 0) {
        alert(translate("errorFoodPart"));
        REFS?.current[idx]?.food_part_idx.current.focus();
        initialErrors[idx].food_part_idx = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_count === 0) {
        alert(translate("errorFoodCount"));
        REFS?.current[idx]?.food_count.current.focus();
        initialErrors[idx].food_count = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_gram === 0) {
        alert(translate("errorFoodGram"));
        REFS?.current[idx]?.food_gram.current.focus();
        initialErrors[idx].food_gram = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_title === "") {
        alert(translate("errorFoodTitle"));
        REFS?.current[idx]?.food_title.current.focus();
        initialErrors[idx].food_title = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_kcal === 0) {
        alert(translate("errorFoodKcal"));
        REFS?.current[idx]?.food_kcal.current.focus();
        initialErrors[idx].food_kcal = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_carb === 0) {
        alert(translate("errorFoodCarb"));
        REFS?.current[idx]?.food_carb.current.focus();
        initialErrors[idx].food_carb = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_protein === 0) {
        alert(translate("errorFoodProtein"));
        REFS?.current[idx]?.food_protein.current.focus();
        initialErrors[idx].food_protein = true;
        foundError = true;
        break;
      }
      // 오류가 있는 항목만 업데이트
      else if (section.food_fat === 0) {
        alert(translate("errorFoodFat"));
        REFS?.current[idx]?.food_fat.current.focus();
        initialErrors[idx].food_fat = true;
        foundError = true;
        break;
      }
    }
    // 업데이트된 에러 상태를 설정
    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT)) {
      return;
    }
    await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
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
    await axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
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
      food_section: prev.food_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border shadow-none p-20"}>
        <Picker
          DATE={DATE}
          setDATE={setDATE}
          EXIST={EXIST}
          setEXIST={setEXIST}
        />
        <Br20/>
        <Count
          COUNT={COUNT}
          setCOUNT={setCOUNT}
          limit={10}
        />
      </Card>
    );
    // 7-2. total
    const totalSection = () => (
      <Card className={"border shadow-none p-20"}>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalKcal")}
            size={"small"}
            value={numeral(OBJECT?.food_total_kcal).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("k")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalCarb")}
            size={"small"}
            value={numeral(OBJECT?.food_total_carb).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food3} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("g")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalProtein")}
            size={"small"}
            value={numeral(OBJECT?.food_total_protein).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food4} className={"w-16 h-16"} />
              ),
               endAdornment: (
                <Div className={"fs-0-8rem"}>
                  {translate("g")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalFat")}
            size={"small"}
            value={numeral(OBJECT?.food_total_fat).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("g")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
      </Card>
    );
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const tableFragment = (i) => (
        <Card className={"border shadow-none p-20"} key={i}>
          <Div className={"d-between"}>
            <Badge
              badgeContent={i + 1}
              color={"primary"}
              showZero={true}
            />
            <Delete
              id={OBJECT?._id}
              sectionId={OBJECT?.food_section[i]?._id}
              index={i}
              handlerDelete={handlerDelete}
            />
          </Div>
          <Br40/>
          <Div className={"d-center"}>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={translate("part")}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              value={OBJECT?.food_section[i]?.food_part_idx}
              inputRef={REFS?.current[i]?.food_part_idx}
              error={ERRORS[i]?.food_part_idx}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const newIndex = Number(e.target.value);
                setOBJECT((prev) => ({
                  ...prev,
                  food_section: prev.food_section?.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_part_idx: newIndex,
                      food_part_val: foodArray[newIndex]?.food_part,
                    } : item
                  ))
                }));
              }}
            >
              {foodArray.map((item, idx) => (
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(item.food_part)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
            {(OBJECT?.food_section[i]?.food_gram === 0) ? (
              <TextField
                select={false}
                label={translate("foodCount")}
                size={"small"}
                type={"text"}
                variant={"outlined"}
                className={"w-40vw ms-3vw"}
                value={Math.min(OBJECT?.food_section[i]?.food_count, 9999)}
                inputRef={REFS?.current[i]?.food_count}
                error={ERRORS[i]?.food_count}
                InputProps={{
                  readOnly: false
                }}
                onChange={(e) => {
                  const newCount = Number(e.target.value);
                  if (newCount > 9999) {
                    return;
                  }
                  if (isNaN(newCount) || newCount < 0) {
                    return;
                  }
                  else if (newCount === 0) {
                    return;
                  }
                  setOBJECT((prev) => ({
                    ...prev,
                    food_section: prev.food_section?.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        food_count: newCount,
                        food_kcal: Number(((newCount * item.food_kcal) / item.food_count).toFixed(2)),
                        food_fat: Number(((newCount * item.food_fat) / item.food_count).toFixed(2)),
                        food_carb: Number(((newCount * item.food_carb) / item.food_count).toFixed(2)),
                        food_protein: Number(((newCount * item.food_protein) / item.food_count).toFixed(2)),
                      } : item
                    ))
                  }));
                }}
              />
            ) : (
              <TextField
                select={false}
                label={translate("gram")}
                size={"small"}
                type={"text"}
                variant={"outlined"}
                className={"w-40vw ms-3vw"}
                value={Math.min(OBJECT?.food_section[i]?.food_gram, 9999)}
                inputRef={REFS?.current[i]?.food_gram}
                error={ERRORS[i]?.food_gram}
                InputProps={{
                  readOnly: false,
                  endAdornment: (
                    translate("g")
                  )
                }}
                onChange={(e) => {
                  const newGram = Number(e.target.value);
                  if (newGram > 9999) {
                    return;
                  }
                  if (isNaN(newGram) || newGram < 0) {
                    return;
                  }
                  else if (newGram === 0) {
                    return;
                  }
                  setOBJECT((prev) => ({
                    ...prev,
                    food_section: prev.food_section?.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        food_gram: newGram,
                        food_kcal: Number(((newGram * item.food_kcal) / item.food_gram).toFixed(2)),
                        food_fat: Number(((newGram * item.food_fat) / item.food_gram).toFixed(2)),
                        food_carb: Number(((newGram * item.food_carb) / item.food_gram).toFixed(2)),
                        food_protein: Number(((newGram * item.food_protein) / item.food_gram).toFixed(2)),
                      } : item
                    ))
                  }));
                }}
              />
            )}
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              size={"small"}
              variant={"outlined"}
              className={"w-86vw"}
              label={translate("foodTitle")}
              value={OBJECT?.food_section[i]?.food_title || " "}
              inputRef={REFS?.current[i]?.food_title}
              error={ERRORS[i]?.food_title}
              InputProps={{
                readOnly: false,
              }}
            />
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("kcal")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              value={numeral(OBJECT?.food_section[i]?.food_kcal).format('0,0')}
              inputRef={REFS?.current[i]?.food_kcal}
              error={ERRORS[i]?.food_kcal}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={food2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("k")}
                  </Div>
                )
              }}
            />
            <TextField
              select={false}
              label={translate("carb")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              value={numeral(OBJECT?.food_section[i]?.food_carb).format('0,0')}
              inputRef={REFS?.current[i]?.food_carb}
              error={ERRORS[i]?.food_carb}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={food3} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
            />
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("protein")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              value={numeral(OBJECT?.food_section[i]?.food_protein).format('0,0')}
              inputRef={REFS?.current[i]?.food_protein}
              error={ERRORS[i]?.food_protein}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={food4} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
            />
            <TextField
              select={false}
              label={translate("fat")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              value={numeral(OBJECT?.food_section[i]?.food_fat).format('0,0')}
              inputRef={REFS?.current[i]?.food_fat}
              error={ERRORS[i]?.food_fat}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={food5} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
            />
          </Div>
          <Br20/>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? loadingFragment() : OBJECT?.food_section?.map((_, i) => (tableFragment(i)))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min67vh"}>
          {dateCountSection()}
          {totalSection()}
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