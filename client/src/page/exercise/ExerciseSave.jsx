// ExerciseSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../import/ImportHooks.jsx";
import {percent, koreanDate} from "../../import/ImportLogics";
import {Header, NavBar, Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopUp} from "../../import/ImportComponents.jsx";
import {Div, Hr10, Br10} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Button, DateCalendar, DigitalClock} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "";
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/exercise/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
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
      exercise_set: 1,
      exercise_rep: 1,
      exercise_kg: 1,
      exercise_rest: 1,
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
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

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

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handlerCount = (e) => {
    const newCount = Number(e);
    const defaultSection = {
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_rest: 0,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    };
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: newCount
    }));
    if (newCount > 0) {
      let updatedSection = Array(newCount).fill(null).map((_, idx) =>
        idx < OBJECT?.exercise_section.length ? OBJECT?.exercise_section[idx] : defaultSection
      );
      setOBJECT((prev) => ({
        ...prev,
        exercise_section: updatedSection
      }));
    }
    else {
      setOBJECT((prev) => ({
        ...prev,
        exercise_section: []
      }));
    }
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlerValidate = (e, popTrigger) => {
    const newValInt = Number(e.target.value);
    const newValStr = String(e.target.value);
    if (newValInt < 0) {
      popTrigger.openPopup(e.currentTarget);
    }
    else if (newValInt > 10) {
      popTrigger.openPopup(e.currentTarget);
    }
    else if (newValStr === "") {
      handlerCount("");
    }
    else if (isNaN(newValInt) || newValStr === "NaN") {
      handlerCount("0");
    }
    else if (newValStr.startsWith("0")) {
      handlerCount(newValStr.replace(/^0+/, ""));
    }
    else {
      handlerCount(newValStr);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <PopUp
        type={"calendar"}
        className={""}
        position={"bottom"}
        direction={"center"}
        contents={
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              className={"ms-n5"}
              readOnly={false}
              value={moment(DATE.startDt)}
              sx={{
                width: "280px",
                height: "330px"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD"),
                }));
              }}
            />
          </LocalizationProvider>
        }>
        {(popTrigger={}) => (
          <TextField
            select={false}
            label={"날짜"}
            size={"small"}
            value={DATE.startDt}
            variant={"outlined"}
            className={"w-60vw"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"TbTextPlus"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        className={""}
        position={"bottom"}
        direction={"left"}
        contents={
          <Div className={"d-center"}>
            0이상 10이하의 숫자만 입력하세요.
          </Div>
        }>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            id={"sectionCnt"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-60vw"}
            value={COUNT?.sectionCnt}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbTextPlus"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
            onChange={(e) => {
              handlerValidate(e, popTrigger);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total
    const totalSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <TextField
          select={false}
          label={"총 볼륨"}
          size={"small"}
          value={`${numeral(OBJECT?.exercise_total_volume).format('0,0')}`}
          variant={"outlined"}
          className={"w-60vw mb-20"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Adornment name={"LiaDumbbellSolid"} className={"w-16 h-16 dark"}position={"start"}/>
            )
          }}
        />
        <TextField
          select={false}
          label={"총 유산소 시간"}
          size={"small"}
          value={OBJECT?.exercise_total_cardio}
          variant={"outlined"}
          className={"w-60vw mb-20"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Adornment name={"TbRun"} className={"w-16 h-16 dark"} position={"start"}/>
            )
          }}
        />
        <TextField
          select={false}
          label={"체중"}
          size={"small"}
          value={`${numeral(OBJECT?.exercise_body_weight).format('0,0')}`}
          variant={"outlined"}
          className={"w-60vw mb-20"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Adornment name={"TbScaleOutline"} className={"w-16 h-16 dark"} position={"start"}/>
            )
          }}
        />
      </Card>
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
        className={""}
        position={"bottom"}
        direction={"left"}
        contents={
          <>
          <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"}>
            <Div className={"fs-14"}>복사</Div>
          </Icons>
          <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"}>
            <Div className={"fs-14"}>복사</Div>
          </Icons>
          </>
        }>
        {(popTrigger={}) => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark mt-n10 me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6. table
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
            id={`exercise_part_val-${i}`}
            name={`exercise_part_val-${i}`}
            variant={"outlined"}
            className={"w-25vw me-10"}
            value={OBJECT?.exercise_section[i]?.exercise_part_idx}
            InputProps={{
              readOnly: false
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
            id={`exercise_title_val-${i}`}
            name={`exercise_title_val-${i}`}
            variant={"outlined"}
            className={"w-25vw ms-10"}
            value={OBJECT?.exercise_section[i]?.exercise_title_idx}
            InputProps={{
              readOnly: false
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
            id={`exercise_set-${i}`}
            name={`exercise_set-${i}`}
            className={"w-60vw"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_set).format('0,0')}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
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
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"횟수"}
            size={"small"}
            variant={"outlined"}
            className={"w-60vw"}
            value={OBJECT?.exercise_section[i]?.exercise_rep}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
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
            id={`exercise_kg-${i}`}
            name={`exercise_kg-${i}`}
            className={"w-60vw"}
            value={OBJECT?.exercise_section[i]?.exercise_kg}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"BiEditAlt"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
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
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            elementId={`popover`}
            type={"timePicker"}
            className={""}
            position={"top"}
            direction={"center"}
            contents={
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.exercise_section[i]?.exercise_cardio, "HH:mm")}
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
                  }}
                />
              </LocalizationProvider>
            }>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={"유산소"}
                size={"small"}
                variant={"outlined"}
                className={"w-60vw"}
                value={OBJECT?.exercise_section[i]?.exercise_cardio}
                InputProps={{
                  readOnly: true
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
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min110vh"}>
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
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
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
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navParam, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
