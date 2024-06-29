// ExerciseSave.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useTime, useTranslate} from "../../import/ImportHooks.jsx";
import {percent, log} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../import/ImportComponents.jsx";
import {PopUp, Img, Picker, Time, Count, Delete} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../import/ImportMuis.jsx";
import {exercise3_1, exercise3_2, exercise3_3, exercise4, exercise5} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCategory") || "{}";
  const exerciseArray = JSON.parse(session)?.exercise || [];
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
    toList:"/exercise/list"
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
    exercise_number: 0,
    exercise_dummy: false,
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

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
    })
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2));
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
        if (prev.length === 1 && prev[0]._id === "") {
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
      console.error(JSON.stringify(err, null, 2));
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    if (!OBJECT?.exercise_section) {
      return;
    }

    let totalVolume = 0;
    let totalTime = 0;

    const updatedSections = OBJECT?.exercise_section.map((section) => {
      const {exercise_set, exercise_rep, exercise_kg} = section;
      const sectionVolume = exercise_set * exercise_rep * exercise_kg;

      totalVolume += sectionVolume;

      const {exercise_cardio} = section;
      if (exercise_cardio) {
        const [hours, minutes] = exercise_cardio.split(':').map(Number);
        totalTime += hours * 60 + minutes;
      }

      return {
        ...section,
        exercise_volume: sectionVolume
      };
    });

    setOBJECT((prev) => ({
      ...prev,
      exercise_section: updatedSections,
      exercise_total_volume: totalVolume,
      exercise_total_cardio: `${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`
    }));

  }, [JSON.stringify(OBJECT?.exercise_section)]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.exercise_section.length ? OBJECT?.exercise_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(JSON.stringify(res.data.msg).slice(1, -1));
        percent();
        Object.assign(SEND, {
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(JSON.stringify(res.data.msg).slice(1, -1));
      }
    })
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2));
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT._id === "") {
      alert(JSON.stringify((translate("noData"))).slice(1, -1));
      return;
    }
    await axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(JSON.stringify(res.data.msg).slice(1, -1));
        percent();
        Object.assign(SEND, {
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(JSON.stringify(res.data.msg).slice(1, -1));
      }
    })
    .catch((err) => {
      console.error(JSON.stringify(err, null, 2));
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: prev.exercise_section.filter((_, idx) => (idx !== index))
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
            label={translate("totalVolume")}
            size={"small"}
            value={numeral(OBJECT?.exercise_total_volume).format('0,0')}
            variant={"outlined"}
            className={"w-76vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={exercise3_1} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("vol")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalCardio")}
            size={"small"}
            value={OBJECT?.exercise_total_cardio}
            variant={"outlined"}
            className={"w-76vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={exercise4} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("hm")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("weight")}
            type={"text"}
            size={"small"}
            value={numeral(OBJECT?.exercise_body_weight).format('0,0')}
            variant={"outlined"}
            className={"w-76vw"}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(Number(rawValue), 999);
              setOBJECT((prev) => ({
                ...prev,
                exercise_body_weight: limitedValue
              }));
            }}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={exercise5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("kg")}
                </Div>
              )
            }}
          />
        </Div>
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
              sectionId={OBJECT?.exercise_section[i]?._id}
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
              value={OBJECT?.exercise_section[i]?.exercise_part_idx}
              InputProps={{
                readOnly: false,
                startAdornment: null,
                endAdornment: null
              }}
              onChange={(e) => {
                const newIndex = Number(e.target.value);
                setOBJECT((prev) => ({
                  ...prev,
                  exercise_section: prev.exercise_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      exercise_part_idx: newIndex,
                      exercise_part_val: exerciseArray[newIndex]?.exercise_part,
                      exercise_title_idx: 0,
                      exercise_title_val: exerciseArray[newIndex]?.exercise_title[0],
                    } : item
                  ))
                }));
              }}
            >
              {exerciseArray.map((item, idx) => (
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(item.exercise_part)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={translate("title")}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              value={OBJECT?.exercise_section[i]?.exercise_title_idx}
              InputProps={{
                readOnly: false,
                startAdornment: null,
                endAdornment: null
              }}
              onChange={(e) => {
                const newTitleIdx = Number(e.target.value);
                const newTitleVal = exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title[newTitleIdx];
                if (newTitleIdx >= 0 && newTitleVal) {
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_section: prev.exercise_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        exercise_title_idx: newTitleIdx,
                        exercise_title_val: newTitleVal,
                      } : item
                    ))
                  }));
                }
              }}
            >
              {exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title?.map((title, idx) => (
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(title)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("set")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              value={numeral(OBJECT?.exercise_section[i]?.exercise_set).format('0,0')}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={exercise3_1} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("s")}
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
                  exercise_section: prev.exercise_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      exercise_set: limitedValue
                    } : item
                  ))
                }));
              }}
            />
            <TextField
              select={false}
              label={translate("rep")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              value={OBJECT?.exercise_section[i]?.exercise_rep}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={exercise3_2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("r")}
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
                  exercise_section: prev.exercise_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      exercise_rep: limitedValue
                    } : item
                  ))
                }));
              }}
            />
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("kg")}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              value={OBJECT?.exercise_section[i]?.exercise_kg}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <Img src={exercise3_3} className={"w-16 h-16"} />
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
                  exercise_section: prev.exercise_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      exercise_kg: limitedValue
                    } : item
                  ))
                }));
              }}
            />
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              extra={"exercise_cardio"}
              i={i}
            />
          </Div>
          <Br20/>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? loadingFragment() : OBJECT?.exercise_section.map((_, i) => (tableFragment(i)))
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
