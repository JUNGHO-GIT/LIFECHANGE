// ExerciseSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime, useTranslate} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, MenuItem} from "../../import/ImportMuis.jsx";
import {DateCalendar, DigitalClock} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1, common2, common3, common5} from "../../import/ImportImages.jsx";
import {exercise3, exercise4, exercise5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt || moment().format("YYYY-MM-DD"),
      endDt: location_endDt || moment().format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [sessionId, setSessionId] = useState(sessionStorage.getItem("sessionId") || "{}");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/exercise/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    exercise_number: 0,
    exercise_demo: false,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
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

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      Object.assign(SEND, {
        startDt: DATE.startDt,
        endDt: DATE.endDt
      });
      navigate(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: prev.exercise_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: prev.sectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <PopUp
        type={"calendar"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              value={moment(DATE.startDt)}
              sx={{
                width: "80vw",
                height: "60vh"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD"),
                }));
                closePopup();
              }}
            />
          </LocalizationProvider>
        )}>
        {(popTrigger={}) => (
          <TextField
            select={false}
            label={"날짜"}
            size={"small"}
            value={DATE.startDt}
            variant={"outlined"}
            className={"w-86vw"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
              ),
              endAdornment: null
            }}
          />
        )}
      </PopUp>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 10개 이하로 입력해주세요.`}
          </Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={COUNT.newSectionCnt}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={common2} className={"w-16 h-16 me-10"} alt={"common2"}/>
              ),
              endAdornment: (
                <Div className={"d-center me-n10"}>
                  <Icons
                    name={"TbMinus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt > COUNT.sectionCnt ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt - 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                  <Icons
                    name={"TbPlus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt < 10 ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt + 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                </Div>
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total
    const totalSection = () => (
      <Div className={"d-column"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 볼륨"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_total_volume).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={exercise3} className={"w-16 h-16 me-10"} alt={"exercise3"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>vol</Div>
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 유산소 시간"}
            size={"small"}
            value={OBJECT?.exercise_total_cardio}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={exercise4} className={"w-16 h-16 me-10"} alt={"exercise4"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>h:m</Div>
              )
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={"체중"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_body_weight).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={exercise5} className={"w-16 h-16 me-10"} alt={"exercise5"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>kg</Div>
              )
            }}
          />
        </Div>
      </Div>
    );
    // 7-4. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-row"}>
            <img src={common5} className={"w-16 h-16 icon pointer"} alt={"common5"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            <Div className={"fs-0-8rem"}>삭제</Div>
          </Div>
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"common3"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6-1. table (detail, save 는 empty x)
    // 7-6-2. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, OBJECT?.exercise_section[i]._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
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
                {item.exercise_part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"타이틀"}
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
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"세트"}
            size={"small"}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_set).format('0,0')}`}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={exercise3} className={"w-16 h-16 me-10"} alt={"exercise3"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>set</Div>
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
            label={"횟수"}
            size={"small"}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            value={OBJECT?.exercise_section[i]?.exercise_rep}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={exercise3} className={"w-16 h-16 me-10"} alt={"exercise3"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>per</Div>
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
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"무게"}
            size={"small"}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            value={OBJECT?.exercise_section[i]?.exercise_kg}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={exercise3} className={"w-16 h-16 me-10"} alt={"exercise3"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>kg</Div>
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
          <PopUp
            key={i}
            type={"timePicker"}
            position={"top"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.exercise_section[i]?.exercise_cardio, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      exercise_section: prev.exercise_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          exercise_cardio: moment(e).format("HH:mm")
                        } : item
                      ))
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={"유산소"}
                size={"small"}
                variant={"outlined"}
                className={"w-40vw ms-3vw"}
                value={OBJECT?.exercise_section[i]?.exercise_cardio}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={exercise4} className={"w-16 h-16 me-10"} alt={"exercise4"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>h:m</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column mb-20"}>
          {totalSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.exercise_section.map((_, i) => (tableFragment(i)))}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
        {tableSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
